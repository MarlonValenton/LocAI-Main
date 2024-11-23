import ResponseSettings from "./ResponseSettings";

export default interface LocaiConfig {
    modelsDirectory: string,
    chatSessionsDirectory: string,
    promptsDirectory: string,
    systemPrompt: string,
    modelLevelFlashAttention: false,
    contextLevelFlashAttention: false,
    contextSize: number | "auto",
    responseSettings: ResponseSettings
}
