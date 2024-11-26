import ModelResponseSettings from "../interfaces/ModelResponseSettings";

export default async function loadConfigSettings(setModelResponseSettings: React.Dispatch<React.SetStateAction<ModelResponseSettings>>) {
    console.log("Loading config settings");
    const settings = await window.utils.getConfig();

    setModelResponseSettings({
        modelName: undefined,
        systemPrompt: settings.systemPrompt,
        modelLevelFlashAttention: settings.modelLevelFlashAttention,
        contextLevelFlashAttention: settings.contextLevelFlashAttention,
        contextSize: settings.contextSize,
        responseSettings: {
            ...settings.responseSettings
        }
    });
}
