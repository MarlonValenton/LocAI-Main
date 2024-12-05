import ResponseSettings from "./ResponseSettings";

// type ModelResponseSettingsOnline {
//     type: "online"
//     //
// }

export default interface ModelResponseSettings {
    isApiModel: any;
    modelName: string | undefined,
    systemPrompt: string,
    modelLevelFlashAttention: boolean,
    contextLevelFlashAttention: boolean,
    contextSize: number | "auto",
    responseSettings: ResponseSettings
}

// export default interface ModelResponseSettingsOffline {
//     type: "offline"
//     modelName: string | undefined,
//     systemPrompt: string,
//     modelLevelFlashAttention: boolean,
//     contextLevelFlashAttention: boolean,
//     contextSize: number | "auto",
//     responseSettings: ResponseSettings
// }