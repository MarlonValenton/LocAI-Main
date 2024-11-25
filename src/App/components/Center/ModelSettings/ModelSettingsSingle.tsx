import {useEffect, useState} from "react";
import LabelAndInput from "../../misc/LabelAndInput";
import InfoTooltip from "../../Tooltips/InfoTooltip";

interface ModelNameSettingProps {
    setModelName: React.Dispatch<React.SetStateAction<string>>
}
function ModelNameSetting({setModelName}: ModelNameSettingProps) {
    const [modelFiles, setModelFiles] = useState<string[]>();

    useEffect(() => {
        window.utils.getModelFiles().then((value) => setModelFiles(value));
    }, []);

    return (
        <LabelAndInput
            type="select"
            selectText="Select a model"
            onValueChange={setModelName}
            items={modelFiles ? modelFiles.map((item) => ({item: item.split("\\").pop()!, value: item})) : []}
        >
            Model
        </LabelAndInput>
    );
}

interface SystemPromptSettingProps {
    systemPromptText: string,
    infoIcon?: boolean,
    setSystemPrompText: React.Dispatch<React.SetStateAction<string>>
}
function SystemPromptSetting({infoIcon = false, systemPromptText, setSystemPrompText}: SystemPromptSettingProps) {
    return (
        <LabelAndInput type="textarea" value={systemPromptText} className="h-[90px]" infoIcon={infoIcon} onValueChange={setSystemPrompText}>
            System Prompt
            <InfoTooltip>
                <p>A system prompt is a text that guides the model towards the kind of responses we want it to generate.</p>
                <p>
                    It's recommended to explain to the model how to behave in certain situations you care about, and to tell it to not make
                    up information if it doesn't know something.
                </p>
            </InfoTooltip>
        </LabelAndInput>
    );
}

interface ModelLevelFlashAttentionSettingProps {
    infoIcon?: boolean,
    modelLevelFlashAttention: boolean,
    setModelLevelFlashAttention: React.Dispatch<React.SetStateAction<boolean>>
}
function ModelLevelFlashAttentionSetting({
    infoIcon = false,
    modelLevelFlashAttention,
    setModelLevelFlashAttention
}: ModelLevelFlashAttentionSettingProps) {
    return (
        <LabelAndInput
            type="checkbox"
            infoIcon={infoIcon}
            value={modelLevelFlashAttention}
            onValueChange={(bool) => setModelLevelFlashAttention(bool)}
        >
            Model Level Flash Attention
            <InfoTooltip>
                <p>
                    Flash attention is an optimization in the attention mechanism that makes inference faster, more efficient and uses less
                    memory.
                </p>
                <p>The support for flash attention is currently experimental and may not always work as expected. Use with caution.</p>
                <p>This option will be ignored if flash attention is not supported by the model.</p>
            </InfoTooltip>
        </LabelAndInput>
    );
}

interface ContextLevelFlashAttentionSettingProps {
    infoIcon?: boolean,
    contextLevelFlashAttention: boolean,
    setContextLevelFlashAttention: React.Dispatch<React.SetStateAction<boolean>>
}

function ContextLevelFlashAttentionSetting({
    infoIcon = false,
    contextLevelFlashAttention,
    setContextLevelFlashAttention
}: ContextLevelFlashAttentionSettingProps) {
    return (
        <LabelAndInput
            type="checkbox"
            value={contextLevelFlashAttention}
            infoIcon={infoIcon}
            onValueChange={(bool) => setContextLevelFlashAttention(bool)}
        >
            Context Level Flash Attention
            <InfoTooltip>
                <p>
                    You can also enable flash attention for an individual context when creating it, but doing that is less optimized as the
                    model may get loaded with less GPU layers since it expected the context to use much more VRAM than it actually does due
                    to flash attention:
                </p>
            </InfoTooltip>
        </LabelAndInput>
    );
}

interface ContextSizeSettingProps {
    infoIcon?: boolean,
    contextSize: number | "auto",
    setContextSize: React.Dispatch<React.SetStateAction<number | "auto">>
}
function ContextSizeSetting({infoIcon = false, contextSize, setContextSize}: ContextSizeSettingProps) {
    return (
        <LabelAndInput
            type="slider"
            value={contextSize === "auto" ? 0 : contextSize}
            sliderMaxValue={8192}
            stepValue={1024}
            setZeroToAuto={true}
            infoIcon={infoIcon}
            onValueChange={(num) => (num === 0 ? setContextSize("auto") : setContextSize(num))}
        >
            Context Size
            <InfoTooltip>
                <p>The number of tokens the model can see at once.</p>
            </InfoTooltip>
        </LabelAndInput>
    );
}

interface TemperatureSettingProps {
    infoIcon?: boolean,
    temperature: number,
    setTemperature: React.Dispatch<React.SetStateAction<number>>
}
function TemperatureSetting({infoIcon = false, temperature, setTemperature}: TemperatureSettingProps) {
    return (
        <LabelAndInput
            type="slider"
            value={temperature}
            sliderMaxValue={1}
            stepValue={0.1}
            setZeroToAuto={false}
            infoIcon={infoIcon}
            onValueChange={setTemperature}
        >
            Temperature
            <InfoTooltip>
                <p>
                    Temperature is a hyperparameter that controls the randomness of the generated text. It affects the probability
                    distribution of the model's output tokens.
                </p>
                <p>
                    A higher temperature (e.g., 1.5) makes the output more random and creative, while a lower temperature (e.g., 0.5) makes
                    the output more focused, deterministic, and conservative.
                </p>
                <p>Set to 0 to disable. Disabled by default (set to 0).</p>
            </InfoTooltip>
        </LabelAndInput>
    );
}

interface MaxTokensSettingProps {
    maxTokens: number,
    setMaxTokens: React.Dispatch<React.SetStateAction<number>>
}
function MaxTokensSetting({maxTokens, setMaxTokens}: MaxTokensSettingProps) {
    return (
        <LabelAndInput
            type="input"
            inputType="int"
            placeholder="Optional"
            value={maxTokens ? maxTokens.toString() : ""}
            infoIcon={false}
            onValueChange={(num) => setMaxTokens(Math.floor(Number(num)))}
        >
            Max Tokens
        </LabelAndInput>
    );
}

interface minPSettingProps {
    infoIcon?: boolean,
    minP: number,
    temperature: number,
    setMinP: React.Dispatch<React.SetStateAction<number>>
}
function MinPSetting({infoIcon = false, minP, temperature, setMinP}: minPSettingProps) {
    return (
        <LabelAndInput
            type="slider"
            value={minP}
            sliderMaxValue={1}
            inputMaxValue={1}
            stepValue={0.1}
            setZeroToAuto={false}
            infoIcon={infoIcon}
            onValueChange={setMinP}
            disabled={temperature === 0 ? true : false}
        >
            minP
            <InfoTooltip>
                <p>
                    From the next token candidates, discard the percentage of tokens with the lowest probability. For example, if set to
                    0.05, 5% of the lowest probability tokens will be discarded. This is useful for generating more high-quality results
                    when using a high temperature. Set to a value between 0 and 1 to enable.
                </p>
                <p>Only relevant when temperature is set to a value greater than 0. Disabled by default.</p>
            </InfoTooltip>
        </LabelAndInput>
    );
}

interface TopPSettingProps {
    infoIcon?: boolean,
    topP: number,
    temperature: number,
    setTopP: React.Dispatch<React.SetStateAction<number>>
}
function TopPSetting({infoIcon = false, topP, temperature, setTopP}: TopPSettingProps) {
    return (
        <LabelAndInput
            type="slider"
            value={topP}
            sliderMaxValue={1}
            inputMaxValue={1}
            stepValue={0.1}
            setZeroToAuto={false}
            infoIcon={infoIcon}
            onValueChange={setTopP}
            disabled={temperature === 0 ? true : false}
        >
            topP
            <InfoTooltip>
                <p>
                    Dynamically selects the smallest set of tokens whose cumulative probability exceeds the threshold P, and samples the
                    next token only from this set. A float number between 0 and 1. Set to 1 to disable.
                </p>
                <p>Only relevant when temperature is set to a value greater than 0.</p>
            </InfoTooltip>
        </LabelAndInput>
    );
}

interface TopKFunctionProps {
    infoIcon?: boolean,
    topK: number,
    temperature: number,
    setTopK: React.Dispatch<React.SetStateAction<number>>
}
function TopKSetting({infoIcon = false, topK, temperature, setTopK}: TopKFunctionProps) {
    return (
        <LabelAndInput
            type="input"
            inputType="float"
            value={topK ? topK.toString() : ""}
            infoIcon={infoIcon}
            onValueChange={(num) => setTopK(Number(num))}
            disabled={temperature === 0 ? true : false}
        >
            topK
            <InfoTooltip>
                <p>
                    Limits the model to consider only the K most likely next tokens for sampling at each step of sequence generation. An
                    integer number between 1 and the size of the vocabulary. Set to 0 to disable (which uses the full vocabulary).
                </p>
                <p>Only relevant when temperature is set to a value greater than 0.</p>
            </InfoTooltip>
        </LabelAndInput>
    );
}

interface SeedSettingProps {
    infoIcon?: boolean,
    seed: number,
    temperature: number,
    setSeed: React.Dispatch<React.SetStateAction<number>>
}
function SeedSetting({infoIcon = false, seed, temperature, setSeed}: SeedSettingProps) {
    return (
        <LabelAndInput
            type="input"
            inputType="int"
            value={seed ? seed.toString() : ""}
            infoIcon={infoIcon}
            onValueChange={(num) => setSeed(Math.floor(Number(num)))}
            disabled={temperature === 0 ? true : false}
        >
            seed
            <InfoTooltip>
                <p>Used to control the randomness of the generated text.</p>
                <p>Change the seed to get different results.</p>
                <p>Only relevant when using temperature.</p>
            </InfoTooltip>
        </LabelAndInput>
    );
}
export {
    ModelNameSetting,
    SystemPromptSetting,
    ModelLevelFlashAttentionSetting,
    ContextLevelFlashAttentionSetting,
    ContextSizeSetting,
    TemperatureSetting,
    MaxTokensSetting,
    MinPSetting,
    TopPSetting,
    TopKSetting,
    SeedSetting
};
