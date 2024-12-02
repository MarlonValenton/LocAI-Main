import {fileURLToPath} from "node:url";
import path from "node:path";
import {readFileSync} from "node:fs";
import fs from "node:fs/promises";
import {app, shell, BrowserWindow, ipcMain, nativeTheme} from "electron";
import LocaiConfig from "../src/interfaces/locaiconfig.ts";
import {registerLlmRpc} from "./rpc/llmRpc.ts";
import {getModelFiles} from "./utils/getModelFiles.ts";
import {getChatSessions} from "./utils/getChatSessions.ts";
import {createChatSessionFile} from "./utils/createChatSessionFile.ts";
import {saveChatSession} from "./utils/saveChatSession.ts";
import {chatSessionExists} from "./utils/chatSessionExists.ts";
import {deleteChatSession} from "./utils/deleteChatSession.ts";
import {exportFile} from "./utils/exportFile.ts";
import {getConfig} from "./utils/getConfig.ts";
import {createPromptFile} from "./utils/createPromptFile.ts";
import {getPrompts} from "./utils/getPrompts.ts";
import {promptExists} from "./utils/promptExists.ts";
import {savePrompt} from "./utils/savePrompt.ts";
import {deletePrompt} from "./utils/deletePrompt.ts";
import {openPath} from "./utils/openPath.ts";
import saveConfig from "./utils/saveConfig.ts";

let configFile: LocaiConfig;
let configFilePath: string;

try {
    if (
        await fs
            .stat("locaiconfig.json")
            .then(() => true)
            .catch(() => false)
    ) {
        console.log("Creating necessary folders");

        configFile = JSON.parse(readFileSync("./locaiconfig.json", {encoding: "utf-8"}));

        await fs.mkdir("models", {recursive: true});
        await fs.mkdir("prompts", {recursive: true});
        await fs.mkdir("chat_sessions", {recursive: true});

        if (configFile.chatSessionsDirectory === null) {
            configFile.chatSessionsDirectory = "chat_sessions";
            await fs.writeFile("locaiconfig.json", JSON.stringify(configFile, null, 2), "utf-8");
        }

        if (configFile.modelsDirectory === null) {
            configFile.modelsDirectory = "models";
            await fs.writeFile("locaiconfig.json", JSON.stringify(configFile, null, 2), "utf-8");
        }

        if (configFile.promptsDirectory === null) {
            configFile.promptsDirectory = "prompts";
            await fs.writeFile("locaiconfig.json", JSON.stringify(configFile, null, 2), "utf-8");
        }
    } else {
        await fs.mkdir("chat_sessions", {recursive: true});
        await fs.mkdir("models", {recursive: true});
        await fs.mkdir("prompts", {recursive: true});

        configFile = {
            theme: nativeTheme.shouldUseDarkColors ? "dark" : "light",
            modelsDirectory: "models",
            chatSessionsDirectory: "chat_sessions",
            promptsDirectory: "prompts",
            systemPrompt:
                "You are a helpful, respectful and honest assistant. Always answer as helpfully as possible. If a question does not make any sense, or is not factually coherent, explain why instead of answering something incorrectly. If you don't know the answer to a question, don't share false information.",
            modelLevelFlashAttention: true,
            contextLevelFlashAttention: false,
            contextSize: 4096,
            responseSettings: {
                temperature: 0.4,
                maxTokens: 10000,
                minP: 0.2,
                topP: 0.1,
                topK: 0.7,
                seed: 1
            }
        };

        await fs.writeFile("locaiconfig.json", JSON.stringify(configFile, null, 2), "utf-8");
    }

    configFilePath = path.resolve("locaiconfig.json");
} catch (e) {
    const appDataLocAi = path.join(app.getPath("appData"), "LocAi Data");
    const appDataLocAiModels = path.join(appDataLocAi, "models");
    const appDataLocAiChatSessions = path.join(appDataLocAi, "chat_sessions");
    const appDataLocAiPrompts = path.join(appDataLocAi, "prompts");

    await fs.mkdir(appDataLocAi, {recursive: true});
    await fs.mkdir(appDataLocAiModels, {recursive: true});
    await fs.mkdir(appDataLocAiChatSessions, {recursive: true});
    await fs.mkdir(appDataLocAiPrompts, {recursive: true});

    configFilePath = path.join(appDataLocAi, path.resolve("locaiconfig.json"));

    if (
        await fs
            .stat(configFilePath)
            .then(() => true)
            .catch(() => false)
    ) {
        null;
    } else {
        configFile = {
            theme: nativeTheme.shouldUseDarkColors ? "dark" : "light",
            modelsDirectory: appDataLocAiModels,
            chatSessionsDirectory: appDataLocAiChatSessions,
            promptsDirectory: appDataLocAiPrompts,
            systemPrompt:
                "You are a helpful, respectful and honest assistant. Always answer as helpfully as possible. If a question does not make any sense, or is not factually coherent, explain why instead of answering something incorrectly. If you don't know the answer to a question, don't share false information.",
            modelLevelFlashAttention: true,
            contextLevelFlashAttention: false,
            contextSize: 4096,
            responseSettings: {
                temperature: 0.4,
                maxTokens: 10000,
                minP: 0.2,
                topP: 0.1,
                topK: 0.7,
                seed: 1
            }
        };

        await fs.writeFile(configFilePath, JSON.stringify(configFile, null, 2), "utf-8");
    }
}

export {configFile, configFilePath};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── index.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, "..");

export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;

let win: BrowserWindow | null;

function createWindow() {
    win = new BrowserWindow({
        icon: path.join(process.env.VITE_PUBLIC, "LocAi-01.ico"),
        webPreferences: {
            preload: path.join(__dirname, "preload.mjs"),
            devTools: !app.isPackaged,
            nodeIntegration: false
        },
        width: 1280,
        height: 720,
        minWidth: 1280,
        minHeight: 720,
        autoHideMenuBar: true
    });
    win.setAspectRatio(16 / 9);
    win.setTitle("LocAi");
    registerLlmRpc(win);

    // open external links in the default browser
    win.webContents.setWindowOpenHandler(({url}) => {
        if (url.startsWith("file://")) return {action: "allow"};

        void shell.openExternal(url);
        return {action: "deny"};
    });

    // Test active push message to Renderer-process.
    win.webContents.on("did-finish-load", () => {
        win?.webContents.send("main-process-message", new Date().toLocaleString());
    });

    if (VITE_DEV_SERVER_URL) void win.loadURL(VITE_DEV_SERVER_URL);
    else void win.loadFile(path.join(RENDERER_DIST, "index.html"));

    !app.isPackaged ? win.webContents.openDevTools() : null;
}

ipcMain.handle("get-model-files", getModelFiles);
ipcMain.handle("get-chat-sessions", getChatSessions);
ipcMain.handle("create-chat-session-file", createChatSessionFile);
ipcMain.handle("save-chat-session", saveChatSession);
ipcMain.handle("chat-session-exists", chatSessionExists);
ipcMain.handle("delete-chat-session", deleteChatSession);
ipcMain.handle("export-file", exportFile);
ipcMain.handle("get-config", getConfig);
ipcMain.handle("create-prompt-file", createPromptFile);
ipcMain.handle("get-prompts", getPrompts);
ipcMain.handle("prompt-exists", promptExists);
ipcMain.handle("save-prompt", savePrompt);
ipcMain.handle("delete-prompt", deletePrompt);
ipcMain.handle("open-path", openPath);
ipcMain.handle("save-config", saveConfig);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
        win = null;
    }
});

app.on("activate", () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

app.whenReady().then(createWindow);

export {BrowserWindow};
