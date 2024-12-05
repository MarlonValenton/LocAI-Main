/// <reference types="vite-plugin-electron/electron-env" />
/// <reference types="../src/interfaces/ChatSession" />
/// <reference types="../src/interfaces/ChatSessionAndFilename" />
/// <reference types="../src/interfaces/dialog" />
/// <reference types="../src/interfaces/Locaiconfig" />
/// <reference types="../src/interfaces/PromptAndFilename" />
/// <reference types="../src/interfaces/Prompt" />
/// <reference types="../src/interfaces/ResponseSettings" />

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
        createChatSessionFile(
            modelPath: string,
            responseSettings: ResponseSettings,
            systemPrompt: string,
            modelLevelFlashAttention: boolean,
            contextLevelFlashAttention: boolean,
            contextSize: number | "auto"
        ): Promise<ChatSessionAndFilename>,
        createChatSessionFileWithApi(
            modelName: string,
            role: string,
        )
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
        deleteChatSession(filename: string): Promise<void>,
        /**
         * Export file
         */
        exportFile(type: ExportDialogType, item: ChatSession): Promise<void>,
        /**
         * get config file as JSON
         */
        getConfig(): Promise<LocaiConfig>,
        /**
         * create Prompt file
         */
        createPromptFile(name: string, description: string, prompt: string): Promise<PromptAndFilename>,
        /**
         * get prompt files
         */
        getPrompts(): Promise<PromptAndFilename>,
        /**
         * Check if file exists
         */
        promptExists(filename: string): Promise<PromptAndFilename>,
        /**
         * save prompt
         */
        savePrompt(filename: string, prompt: Prompt): Promise<void>,
        /**
         * delete prompt
         */
        deletePrompt(filename: string): Promise<void>,
        /**
         * open path
         */
        openPath(path: string): Promise<void>,
        /**
         * save config file
         */
        saveConfig(config: LocaiConfig): Promise<void>
    }
}
