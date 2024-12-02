import ResponseSettings from "./ResponseSettings";

export default interface LocaiConfig {
    modelsDirectory: string,
    chatSessionsDirectory: string,
    promptsDirectory: string,
    systemPrompt: string,
    modelLevelFlashAttention: boolean,
    contextLevelFlashAttention: boolean,
    contextSize: number | "auto",
    responseSettings: ResponseSettings
}
