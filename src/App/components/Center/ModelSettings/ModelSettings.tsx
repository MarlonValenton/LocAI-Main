import {useEffect, useState} from "react";
import {Button} from "../../../shadcncomponents/Button";
import {Label} from "../../../shadcncomponents/Label";
import {Separator} from "../../../shadcncomponents/Separator";
import ModelResponseSettings from "../../../../interfaces/ModelResponseSettings";
import { getModelFiles } from "../../../../../electron/utils/getModelFiles";
import {fetchGroqModels} from "../../../../lib/apiUtils";  // Import fetchGroqModels function
import {
    ContextLevelFlashAttentionSetting,
    ContextSizeSetting,
    MaxTokensSetting,
    ModelLevelFlashAttentionSetting,
    ModelNameSetting,
    SystemPromptSetting,
    TemperatureSetting,
    MinPSetting,
    TopPSetting,
    TopKSetting,
    SeedSetting
} from "./ModelSettingsSingle";

interface ModelSettingsProps {
    modelResponseSettings: ModelResponseSettings,
    loaded: boolean,
    setModelResponseSettings: React.Dispatch<React.SetStateAction<ModelResponseSettings>>,
    loadModelAndSession(): Promise<void>
}
function ModelSettings({setModelResponseSettings, modelResponseSettings, loaded, loadModelAndSession}: ModelSettingsProps): JSX.Element {
    // offline
    const [modelName, setModelName] = useState<string>(modelResponseSettings.modelName!);
    const [systemPromptText, setSystemPrompText] = useState<string>(modelResponseSettings.systemPrompt);
    const [modelLevelFlashAttention, setModelLevelFlashAttention] = useState<boolean>(modelResponseSettings.modelLevelFlashAttention);
    const [contextSize, setContextSize] = useState<number | "auto">(modelResponseSettings.contextSize);
    const [temperature, setTemperature] = useState<number>(modelResponseSettings.responseSettings.temperature);
    const [maxTokens, setMaxTokens] = useState<number>(modelResponseSettings.responseSettings.maxTokens);
    const [contextLevelFlashAttention, setContextLevelFlashAttention] = useState<boolean>(modelResponseSettings.contextLevelFlashAttention);
    const [minP, setMinP] = useState<number>(modelResponseSettings.responseSettings.minP);
    const [topP, setTopP] = useState<number>(modelResponseSettings.responseSettings.topP);
    const [topK, setTopK] = useState<number>(modelResponseSettings.responseSettings.topK);
    const [seed, setSeed] = useState<number>(modelResponseSettings.responseSettings.seed);
    
    //online
    const [useLocalModels, setUseLocalModels] = useState<boolean>(true); // State to toggle between local and API models
    const [availableModels, setAvailableModels] = useState<string[]>([]); // State to store fetched models
    
    // Fetch models on component mount or when the mode changes
    useEffect(() => {
        const fetchModels = async () => {
            try {
                const models = await fetchGroqModels(); // Fetch from Groq API
                if (models) {
                    setAvailableModels(models.map(model => model.id)); // Assuming the response contains 'name'
                } else {
                    console.log("No models found from the Groq API");
                }
            } catch (error) {
                console.error("Error fetching models from Groq API:", error);
            }
        };

        if (!useLocalModels) { // Only fetch models when using API models
            fetchModels();
        } else {
            setAvailableModels([]); // Clear available models when switching to local models
        }
    }, [useLocalModels]); // Re-fetch when toggling between local and API models


    useEffect(() => {
        console.log("modelResponseSettings object updated in ModelSettings.tsx");

        setModelResponseSettings({
            modelName: modelName,
            systemPrompt: systemPromptText,
            modelLevelFlashAttention: modelLevelFlashAttention,
            contextLevelFlashAttention: contextLevelFlashAttention,
            contextSize: contextSize,
            responseSettings: {
                temperature: temperature,
                maxTokens: maxTokens,
                minP: minP,
                topP: topP,
                topK: topK,
                seed: seed
            }
        });
    }, [
        modelName,
        systemPromptText,
        modelLevelFlashAttention,
        contextSize,
        temperature,
        maxTokens,
        contextLevelFlashAttention,
        minP,
        topP,
        topK,
        seed
    ]);

    useEffect(() => {
        if (!loaded) {
            console.log("local model response settings updated in ModelSettings.tsx");

            setModelName(modelResponseSettings.modelName!);
            setSystemPrompText(modelResponseSettings.systemPrompt);
            setModelLevelFlashAttention(modelResponseSettings.modelLevelFlashAttention);
            setContextLevelFlashAttention(modelResponseSettings.contextLevelFlashAttention);
            setContextSize(modelResponseSettings.contextSize);
            setTemperature(modelResponseSettings.responseSettings.temperature);
            setMaxTokens(modelResponseSettings.responseSettings.maxTokens);
            setMinP(modelResponseSettings.responseSettings.minP);
            setTopP(modelResponseSettings.responseSettings.topP);
            setTopK(modelResponseSettings.responseSettings.topK);
            setSeed(modelResponseSettings.responseSettings.seed);
        }
    }, [loaded]);

    return (
        <div className="flex flex-col flex-grow justify-center items-center">
            <div className="flex flex-col w-[700px] min-h-[400px] lg:max-h-[448px] 2xl:max-h-[610px] 3xl:max-h-fit border-[1px] border-border-gray rounded-[5px] px-[20px] py-[25px] text-[20px] [&>*:not(:last-child)]:mb-3 overflow-y-auto">
                
                    
                <Button
                    variant="secondary"
                    onClick={() => setUseLocalModels(!useLocalModels)}
                >
                    {useLocalModels ? "Switch to API Models" : "Switch to Local Models"}
                </Button>
                {useLocalModels && (
                    <>
                        <ModelNameSetting setModelName={setModelName} />
                        <SystemPromptSetting infoIcon systemPromptText={systemPromptText} setSystemPrompText={setSystemPrompText} />
                        <ContextSizeSetting infoIcon contextSize={contextSize} setContextSize={setContextSize} />
                        <div className="flex flex-row justify-around">
                            <ModelLevelFlashAttentionSetting
                                infoIcon
                                modelLevelFlashAttention={modelLevelFlashAttention}
                                setModelLevelFlashAttention={setModelLevelFlashAttention}
                            />
                            <ContextLevelFlashAttentionSetting
                                infoIcon
                                contextLevelFlashAttention={contextLevelFlashAttention}
                                setContextLevelFlashAttention={setContextLevelFlashAttention}
                            />
                        </div>
                        <div className="flex gap-[5px] items-center w-full">
                            <Separator className="flex-1" />
                            <Label className="w-fit text-[15px]">Response Settings</Label>
                            <Separator className="flex-1" />
                        </div>
                        <div className="flex">
                            <div className="flex flex-col w-[50%] gap-[10px]">
                                <TemperatureSetting infoIcon temperature={temperature} setTemperature={setTemperature} />
                                <MaxTokensSetting maxTokens={maxTokens} setMaxTokens={setMaxTokens} />
                                <SeedSetting infoIcon temperature={temperature} seed={seed} setSeed={setSeed} />
                            </div>
                            <Separator orientation="vertical" className="h-full flex-none mx-[20px]" />
                            <div className="flex flex-col w-[50%] gap-[10px]">
                                <MinPSetting infoIcon temperature={temperature} minP={minP} setMinP={setMinP} />
                                <TopPSetting infoIcon temperature={temperature} topP={topP} setTopP={setTopP} />
                                <TopKSetting infoIcon temperature={temperature} topK={topK} setTopK={setTopK} />
                            </div>
                        </div>

                        <Button
                            onClick={() => {
                                loadModelAndSession();
                            }}
                            disabled={modelName === "" || modelName === undefined}
                        >
                    Load Model
                        </Button>
                    </>
            
                )}

                {!useLocalModels && (
                    <div className="mt-4">
                        <Label>Available Models:</Label>
                        {availableModels.length > 0 ? (
                            <>
                                <ul className="border rounded p-2 mt-2 max-h-[200px] overflow-y-auto">
                                    {availableModels.map((model, index) => (
                                        <li
                                            key={index}
                                            className={`cursor-pointer p-2 rounded ${
                                                modelName === model
                                                    ? "bg-blue-500 text-white"
                                                    : "hover:bg-gray-200"
                                            }`}
                                            onClick={() => {
                                                setModelName(model); setModelResponseSettings({
                                                    ...modelResponseSettings,
                                                    modelName: model,
                                                    isApiModel: !useLocalModels, // Set flag based on toggle
                                                })
                                            }}
                                        >
                                            {model}
                                        </li>
                                    ))}
                                </ul>
                                
                                <Button
                                    onClick={() => {
                                        if (modelName) {
                                            loadModelAndSession();
                                        }
                                    }}
                                    disabled={!modelName || modelName === ""}
                                    className="mt-4"
                                >
                                    Load Model
                                </Button>
                            </>
                        ) : (
                            <p className="text-gray-500 mt-2">No models available</p>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}
export default ModelSettings;
