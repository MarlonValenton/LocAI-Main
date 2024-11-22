import ResponseSettings from "./ResponseSettings";

export default interface ModelResponseSettings {
    modelName: string | undefined,
    systemPrompt: string,
    preloadPrompt: string | undefined,
    modelLevelFlashAttention: boolean,
    responseSettings: ResponseSettings
}
