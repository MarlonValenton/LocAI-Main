/// <reference types="vite-plugin-electron/electron-env" />
/// <reference types="../src/interfaces/ChatSession" />
/// <reference types="../src/interfaces/ChatSessionAndFilename" />
/// <reference types="../src/interfaces/dialog" />

declare namespace NodeJS {
    interface ProcessEnv {
        /**
         * The built directory structure
         *
         * ```tree
         * ├─┬─┬ dist
         * │ │ └── index.html
         * │ │
         * │ ├─┬ dist-electron
         * │ │ ├── index.js
         * │ │ └── preload.mjs
         * │
         * ```
         */
        APP_ROOT: string,
        /** /dist/ or /public/ */
        VITE_PUBLIC: string
    }
}

// Used in Renderer process, expose in `preload.ts`
interface Window {
    ipcRenderer: import("electron").IpcRenderer,
    utils: {
        /**
         * Get models in `models` folder
         */
        getModelFiles(): Promise<string[]>,
        /**
         * Get chat sessions in `chat_sessions` folder
         */
        getChatSessions(): Promise<ChatSessionAndFilename[]>,
        /**
         * Create a chat session file
         */
        createChatSessionFile(modelPath: string): Promise<ChatSessionAndFilename>,
        /**
         * Save chat session to file
         */
        saveChatSession(filename: string, chatSessionFile: ChatSession): Promise<void>,
        /**
         * Check if file exists
         */
        chatSessionExists(filename: string): Promise<boolean>,
        /**
         * PERMANENTLY delete a file
         */
        deleteChatSession(filename: string): Promise<boolean>,
        /**
         * Export file
         */
        exportFile(type: ExportDialogType, item: ChatSession): Promise<void>
    }
}
