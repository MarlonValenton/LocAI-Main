import {ipcRenderer, contextBridge} from "electron";
import ChatSession from "../src/interfaces/ChatSession";
import ChatSessionAndFilename from "../src/interfaces/ChatSessionAndFilename";

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
    createChatSessionFile: (modelPath: string): Promise<ChatSessionAndFilename> =>
        ipcRenderer.invoke("create-chat-session-file", modelPath),
    saveChatSession: (filename: string, chatSession: ChatSession): Promise<void> =>
        ipcRenderer.invoke("save-chat-session", filename, chatSession),
    chatSessionExists: (filename: string): Promise<boolean> => ipcRenderer.invoke("chat-session-exists", filename),
    deleteChatSession: (filename: string): Promise<boolean> => ipcRenderer.invoke("delete-chat-session", filename)
});
