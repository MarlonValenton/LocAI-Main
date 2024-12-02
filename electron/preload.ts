import {ipcRenderer, contextBridge} from "electron";
import ChatSession from "../src/interfaces/ChatSession";
import ChatSessionAndFilename from "../src/interfaces/ChatSessionAndFilename";
import {ExportDialogType} from "../src/interfaces/dialog";
import LocaiConfig from "../src/interfaces/locaiconfig";
import PromptAndFilename from "../src/interfaces/PromptAndFilename";
import Prompt from "../src/interfaces/Prompt";
import ResponseSettings from "../src/interfaces/ResponseSettings";

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld("ipcRenderer", {
    on(...args: Parameters<typeof ipcRenderer.on>) {
        const [channel, listener] = args;
        return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args));
    },
    off(...args: Parameters<typeof ipcRenderer.off>) {
        const [channel, ...omit] = args;
        return ipcRenderer.off(channel, ...omit);
    },
    send(...args: Parameters<typeof ipcRenderer.send>) {
        const [channel, ...omit] = args;
        return ipcRenderer.send(channel, ...omit);
    },
    invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
        const [channel, ...omit] = args;
        return ipcRenderer.invoke(channel, ...omit);
    }

    // You can expose other APIs you need here
    // ...
});

contextBridge.exposeInMainWorld("utils", {
    getModelFiles: (): Promise<string[]> => ipcRenderer.invoke("get-model-files"),
    getChatSessions: (): Promise<ChatSessionAndFilename[]> => ipcRenderer.invoke("get-chat-sessions"),
    createChatSessionFile: (
        modelPath: string,
        responseSettings: ResponseSettings,
        systemPrompt: string,
        modelLevelFlashAttention: boolean,
        contextLevelFlashAttention: boolean,
        contextSize: number | "auto"
    ): Promise<ChatSessionAndFilename> =>
        ipcRenderer.invoke(
            "create-chat-session-file",
            modelPath,
            responseSettings,
            systemPrompt,
            modelLevelFlashAttention,
            contextLevelFlashAttention,
            contextSize
        ),
    saveChatSession: (filename: string, chatSession: ChatSession): Promise<void> =>
        ipcRenderer.invoke("save-chat-session", filename, chatSession),
    chatSessionExists: (filename: string): Promise<boolean> => ipcRenderer.invoke("chat-session-exists", filename),
    deleteChatSession: (filename: string): Promise<void> => ipcRenderer.invoke("delete-chat-session", filename),
    exportFile: (type: ExportDialogType, item: ChatSession): Promise<void> => ipcRenderer.invoke("export-file", type, item),
    getConfig: (): Promise<LocaiConfig> => ipcRenderer.invoke("get-config"),
    createPromptFile: (name: string, description: string, prompt: string): Promise<PromptAndFilename> =>
        ipcRenderer.invoke("create-prompt-file", name, description, prompt),
    getPrompts: (): Promise<PromptAndFilename> => ipcRenderer.invoke("get-prompts"),
    promptExists: (filename: string): Promise<boolean> => ipcRenderer.invoke("prompt-exists", filename),
    savePrompt: (filename: string, prompt: Prompt): Promise<boolean> => ipcRenderer.invoke("save-prompt", filename, prompt),
    deletePrompt: (filename: string): Promise<void> => ipcRenderer.invoke("delete-prompt", filename),
    openPath: (path: string): Promise<void> => ipcRenderer.invoke("open-path", path),
    saveConfig: (config: LocaiConfig): Promise<void> => ipcRenderer.invoke("save-config", config)
});
