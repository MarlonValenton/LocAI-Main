import ResponseSettings from "./ResponseSettings";

export default interface ModelResponseSettings {
    modelName: string | undefined,
    systemPrompt: string,
    modelLevelFlashAttention: boolean,
    contextLevelFlashAttention: boolean,
    contextSize: number | "auto",
    responseSettings: ResponseSettings
}
