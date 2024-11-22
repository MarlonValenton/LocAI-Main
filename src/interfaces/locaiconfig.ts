import ResponseSettings from "./ResponseSettings";

export default interface LocaiConfig {
    modelsDirectory: string,
    chatSessionsDirectory: string,
    promptsDirectory: string,
    systemPrompt: string,
    preloadPrompt: string | undefined,
    modelLevelFlashAttention: false,
    responseSettings: ResponseSettings
}
