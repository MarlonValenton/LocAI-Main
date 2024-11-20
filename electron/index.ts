import {fileURLToPath} from "node:url";
import path from "node:path";
import {app, shell, BrowserWindow, ipcMain} from "electron";
import {registerLlmRpc} from "./rpc/llmRpc.ts";
import {getModelFiles} from "./utils/getModelFiles.ts";
import {getChatSessions} from "./utils/getChatSessions.ts";
import {createChatSessionFile} from "./utils/createChatSessionFile.ts";
import {saveChatSession} from "./utils/saveChatSession.ts";
import {chatSessionExists} from "./utils/chatSessionExists.ts";
import {deleteChatSession} from "./utils/deleteChatSession.ts";
import {exportFile} from "./utils/exportFile.ts";
import {getConfig} from "./utils/getConfig.ts";

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
        icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
        webPreferences: {
            preload: path.join(__dirname, "preload.mjs")
        },
        width: 1280,
        height: 720,
        minWidth: 1280,
        minHeight: 720,
        autoHideMenuBar: true
    });
    win.setAspectRatio(16 / 9);
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
}

ipcMain.handle("get-model-files", getModelFiles);
ipcMain.handle("get-chat-sessions", getChatSessions);
ipcMain.handle("create-chat-session-file", createChatSessionFile);
ipcMain.handle("save-chat-session", saveChatSession);
ipcMain.handle("chat-session-exists", chatSessionExists);
ipcMain.handle("delete-chat-session", deleteChatSession);
ipcMain.handle("export-file", exportFile);
ipcMain.handle("get-config", getConfig);

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
