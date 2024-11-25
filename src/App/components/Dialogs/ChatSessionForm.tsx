import {
    ContextLevelFlashAttentionSetting,
    ContextSizeSetting,
    ModelLevelFlashAttentionSetting,
    SystemPromptSetting
} from "../Center/ModelSettings/ModelSettingsSingle";
import LabelAndInput from "../misc/LabelAndInput";

interface ChatSessionFormProps {
    name: string,
    systemPrompt: string,
    contextSize: number | "auto",
    modelLevelFlashAttention: boolean,
    contextLevelFlashAttention: boolean,
    setName: React.Dispatch<React.SetStateAction<string>>,
    setSystemPrompt: React.Dispatch<React.SetStateAction<string>>,
    setContextSize: React.Dispatch<React.SetStateAction<number | "auto">>,
    setModelLevelFlashAttention: React.Dispatch<React.SetStateAction<boolean>>,
    setContextLevelFlashAttention: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ChatSessionForm({
    name,
    systemPrompt,
    contextSize,
    modelLevelFlashAttention,
    contextLevelFlashAttention,
    setName,
    setSystemPrompt,
    setContextSize,
    setModelLevelFlashAttention,
    setContextLevelFlashAttention
}: ChatSessionFormProps) {
    return (
        <div className="flex flex-col gap-[15px] px-[15px] py-[15px]">
            <LabelAndInput type="input" inputType="string" value={name} onValueChange={(text) => setName(text)}>
                Name
            </LabelAndInput>
            <SystemPromptSetting infoIcon systemPromptText={systemPrompt} setSystemPrompText={setSystemPrompt} />
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
        </div>
    );
}
