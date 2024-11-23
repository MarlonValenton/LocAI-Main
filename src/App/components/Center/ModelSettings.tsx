/// <reference types="vite-plugin-svgr/client" />

import {useEffect, useState} from "react";
import Info from "../../../icons/info-circle.svg?react";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "../../shadcncomponents/select";
import {Button} from "../../shadcncomponents/Button";
import {Label} from "../../shadcncomponents/Label";
import {Input} from "../../shadcncomponents/Input";
import {Textarea} from "../../shadcncomponents/textarea";
import {Separator} from "../../shadcncomponents/Separator";
import {Slider} from "../../shadcncomponents/slider";
import {Checkbox} from "../../shadcncomponents/checkbox";
import {cn} from "../../../lib/utils";
import ModelResponseSettings from "../../../interfaces/ModelResponseSettings";
import InfoTooltip from "../Tooltips/InfoTooltip";
import {Tooltip, TooltipProvider, TooltipTrigger} from "../../shadcncomponents/tooltip";

let modelFiles: string[];
window.utils.getModelFiles().then((value) => (modelFiles = value));
interface ModelSettingsProps {
    setModelResponseSettings: React.Dispatch<React.SetStateAction<ModelResponseSettings>>,
    modelResponseSettings: ModelResponseSettings,
    loadModelAndSession(): Promise<void>
}

function ModelSettings({setModelResponseSettings, modelResponseSettings, loadModelAndSession}: ModelSettingsProps): JSX.Element {
    const [modelName, setModelName] = useState<string>(modelResponseSettings.modelName!);
    const [systemPromptText, setSystemPrompText] = useState<string>(modelResponseSettings.systemPrompt);
    const [modelLevelFlashAttention, setModelLevelFlashAttention] = useState<boolean>(modelResponseSettings.modelLevelFlashAttention);
    const [contextSize, setContextSize] = useState<number | "auto">(modelResponseSettings.contextSize);
    const [temperature, setTemperature] = useState<number>(modelResponseSettings.responseSettings.temperature);
    const [maxTokens, setMaxTokens] = useState<number>(modelResponseSettings.responseSettings.maxTokens);
    const [contextLevelFlashAttenion, setContextLevelFlashAttenion] = useState<boolean>(modelResponseSettings.contextLevelFlashAttention);
    const [minP, setMinP] = useState<number>(modelResponseSettings.responseSettings.minP);
    const [topP, setTopP] = useState<number>(modelResponseSettings.responseSettings.topP);
    const [topK, setTopK] = useState<number>(modelResponseSettings.responseSettings.topK);
    const [seed, setSeed] = useState<number>(modelResponseSettings.responseSettings.seed);

    useEffect(() => {
        setModelResponseSettings({
            modelName: modelName,
            systemPrompt: systemPromptText,
            modelLevelFlashAttention: modelLevelFlashAttention,
            contextLevelFlashAttention: contextLevelFlashAttenion,
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
        contextLevelFlashAttenion,
        minP,
        topP,
        topK,
        seed
    ]);

    return (
        <div className="flex flex-col flex-grow justify-center items-center">
            <div className="flex flex-col w-[700px] min-h-[400px] lg:max-h-[448px] 2xl:max-h-[610px] 3xl:max-h-fit border-[1px] border-border-gray rounded-[5px] px-[20px] py-[25px] text-[20px] [&>*:not(:last-child)]:mb-3 overflow-y-auto">
                <LabelAndInput
                    type="select"
                    selectText="Select a model"
                    onValueChange={setModelName}
                    items={modelFiles.map((item) => ({item: item.split("\\").pop()!, value: item}))}
                >
                    Model
                </LabelAndInput>
                <LabelAndInput
                    type="textarea"
                    value={systemPromptText}
                    className="h-[90px]"
                    infoIcon={true}
                    onValueChange={setSystemPrompText}
                >
                    System Prompt
                    <InfoTooltip>
                        <p>A system prompt is a text that guides the model towards the kind of responses we want it to generate.</p>
                        <p>
                            It's recommended to explain to the model how to behave in certain situations you care about, and to tell it to
                            not make up information if it doesn't know something.
                        </p>
                    </InfoTooltip>
                </LabelAndInput>
                <div className="flex flex-row justify-around">
                    <LabelAndInput
                        type="checkbox"
                        infoIcon={true}
                        value={modelLevelFlashAttention}
                        onValueChange={(bool) => setModelLevelFlashAttention(bool)}
                    >
                        Model Level Flash Attention
                        <InfoTooltip>
                            <p>
                                Flash attention is an optimization in the attention mechanism that makes inference faster, more efficient
                                and uses less memory.
                            </p>
                            <p>
                                The support for flash attention is currently experimental and may not always work as expected. Use with
                                caution.
                            </p>
                            <p>This option will be ignored if flash attention is not supported by the model.</p>
                        </InfoTooltip>
                    </LabelAndInput>
                    <LabelAndInput
                        type="checkbox"
                        value={contextLevelFlashAttenion}
                        infoIcon={true}
                        onValueChange={(bool) => setContextLevelFlashAttenion(bool)}
                    >
                        Context Level Flash Attention
                        <InfoTooltip>
                            <p>
                                You can also enable flash attention for an individual context when creating it, but doing that is less
                                optimized as the model may get loaded with less GPU layers since it expected the context to use much more
                                VRAM than it actually does due to flash attention:
                            </p>
                        </InfoTooltip>
                    </LabelAndInput>
                </div>
                <div className="flex gap-[5px] items-center w-full">
                    <Separator className="flex-1" />
                    <Label className="w-fit text-[15px]">Response Settings</Label>
                    <Separator className="flex-1" />
                </div>
                <div className="flex">
                    <div className="flex flex-col w-[50%] gap-[10px]">
                        <LabelAndInput
                            type="slider"
                            value={contextSize === "auto" ? 0 : contextSize}
                            sliderMaxValue={8192}
                            stepValue={1024}
                            setZeroToAuto={true}
                            infoIcon={true}
                            onValueChange={(num) => (num === 0 ? setContextSize("auto") : setContextSize(num))}
                        >
                            Context Size
                            <InfoTooltip>
                                <p>The number of tokens the model can see at once.</p>
                            </InfoTooltip>
                        </LabelAndInput>
                        <LabelAndInput
                            type="slider"
                            value={temperature}
                            sliderMaxValue={1}
                            stepValue={0.1}
                            setZeroToAuto={false}
                            infoIcon={true}
                            onValueChange={setTemperature}
                        >
                            Temperature
                            <InfoTooltip>
                                <p>
                                    Temperature is a hyperparameter that controls the randomness of the generated text. It affects the
                                    probability distribution of the model's output tokens.
                                </p>
                                <p>
                                    A higher temperature (e.g., 1.5) makes the output more random and creative, while a lower temperature
                                    (e.g., 0.5) makes the output more focused, deterministic, and conservative.
                                </p>
                                <p>Set to 0 to disable. Disabled by default (set to 0).</p>
                            </InfoTooltip>
                        </LabelAndInput>
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
                    </div>
                    <Separator orientation="vertical" className="h-full flex-none mx-[20px]" />
                    <div className="flex flex-col w-[50%] gap-[10px]">
                        <LabelAndInput
                            type="slider"
                            value={minP}
                            sliderMaxValue={1}
                            inputMaxValue={1}
                            stepValue={0.1}
                            setZeroToAuto={false}
                            infoIcon={true}
                            onValueChange={setMinP}
                            disabled={temperature === 0 ? true : false}
                        >
                            minP
                            <InfoTooltip>
                                <p>
                                    From the next token candidates, discard the percentage of tokens with the lowest probability. For
                                    example, if set to 0.05, 5% of the lowest probability tokens will be discarded. This is useful for
                                    generating more high-quality results when using a high temperature. Set to a value between 0 and 1 to
                                    enable.
                                </p>
                                <p>Only relevant when temperature is set to a value greater than 0. Disabled by default.</p>
                            </InfoTooltip>
                        </LabelAndInput>
                        <LabelAndInput
                            type="slider"
                            value={topP}
                            sliderMaxValue={1}
                            inputMaxValue={1}
                            stepValue={0.1}
                            setZeroToAuto={false}
                            infoIcon={true}
                            onValueChange={setTopP}
                            disabled={temperature === 0 ? true : false}
                        >
                            topP
                            <InfoTooltip>
                                <p>
                                    Dynamically selects the smallest set of tokens whose cumulative probability exceeds the threshold P, and
                                    samples the next token only from this set. A float number between 0 and 1. Set to 1 to disable.
                                </p>
                                <p>Only relevant when temperature is set to a value greater than 0.</p>
                            </InfoTooltip>
                        </LabelAndInput>
                        <LabelAndInput
                            type="input"
                            inputType="float"
                            value={topK ? topK.toString() : ""}
                            infoIcon={true}
                            onValueChange={(num) => setTopK(Number(num))}
                            disabled={temperature === 0 ? true : false}
                        >
                            topK
                            <InfoTooltip>
                                <p>
                                    Limits the model to consider only the K most likely next tokens for sampling at each step of sequence
                                    generation. An integer number between 1 and the size of the vocabulary. Set to 0 to disable (which uses
                                    the full vocabulary).
                                </p>
                                <p>Only relevant when temperature is set to a value greater than 0.</p>
                            </InfoTooltip>
                        </LabelAndInput>
                        <LabelAndInput
                            type="input"
                            inputType="int"
                            value={seed ? seed.toString() : ""}
                            infoIcon={true}
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
            </div>
        </div>
    );
}

type LabelAndSelectProps = {
    type: "select",
    children?: string | [string, JSX.Element?],
    infoIcon?: boolean,
    selectText: string,
    items?: {item: string, value: string}[],
    onValueChange?: React.Dispatch<React.SetStateAction<string>>
};

type LabelAndTextAreaProps = {
    type: "textarea",
    children?: string | [string, JSX.Element?],
    infoIcon?: boolean,
    value: string,
    className?: string,
    onValueChange?: React.Dispatch<React.SetStateAction<string>>
};

type LavelAndPrimitiveInputProps = {
    type: "input",
    inputType?: "int" | "float" | "string",
    children?: string | [string, JSX.Element?],
    infoIcon?: boolean,
    value: string,
    placeholder?: string,
    disabled?: boolean,
    onValueChange?: React.Dispatch<React.SetStateAction<string>>
};

type LabelAndSliderProps = {
    type: "slider",
    children?: string | [string, JSX.Element?],
    infoIcon?: boolean,
    value: number,
    sliderMaxValue: number,
    inputMaxValue?: number,
    stepValue: number,
    setZeroToAuto: boolean,
    disabled?: boolean,
    onValueChange?: React.Dispatch<React.SetStateAction<any>>
};

type LabelAndCheckboxProps = {
    type: "checkbox",
    children?: string | [string, JSX.Element?],
    infoIcon?: boolean,
    value: boolean,
    onValueChange?: React.Dispatch<React.SetStateAction<boolean>>
};

type LabelAndInputProps =
    | LabelAndSelectProps
    | LabelAndTextAreaProps
    | LavelAndPrimitiveInputProps
    | LabelAndSliderProps
    | LabelAndCheckboxProps;

function LabelAndInput(labelAndInput: LabelAndInputProps) {
    return (
        <div
            className={cn(
                "flex items-center flex-row",
                labelAndInput.type === "slider" ? "flex-col" : labelAndInput.type === "textarea" ? "items-start" : ""
            )}
        >
            <span className={cn("flex flex-none items-center", labelAndInput.type === "slider" ? "w-full" : "w-fit")}>
                {labelAndInput.type === "checkbox" ? (
                    <Checkbox
                        checked={labelAndInput.value}
                        onCheckedChange={(bool) => labelAndInput.onValueChange!(Boolean(bool))}
                        className="mr-[10px]"
                    />
                ) : (
                    ""
                )}
                <Label className="text-[15px] whitespace-nowrap">
                    {labelAndInput.children?.length === 2 ? labelAndInput.children![0] : labelAndInput.children}
                </Label>
                {labelAndInput.infoIcon ? (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger className="cursor-default">
                                <Info className="text-icon-gray size-[20px] mx-[5px]" />
                            </TooltipTrigger>
                            {labelAndInput.children![1]}
                        </Tooltip>
                    </TooltipProvider>
                ) : (
                    ""
                )}
            </span>
            {labelAndInput.type === "select" ? (
                <Select onValueChange={labelAndInput.onValueChange}>
                    <SelectTrigger className={cn("h-[35px] ml-[10px]", labelAndInput.infoIcon ? "ml-0" : "")}>
                        <SelectValue placeholder={labelAndInput.selectText} />
                    </SelectTrigger>
                    <SelectContent className="max-h-[250px]">
                        <SelectGroup>
                            {labelAndInput.items!.map((item, index) => {
                                return (
                                    <SelectItem value={item.value} key={index}>
                                        {item.item}
                                    </SelectItem>
                                );
                            })}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            ) : labelAndInput.type === "textarea" ? (
                <Textarea
                    className={cn("max-h-[200px] resize-none", labelAndInput.className, !labelAndInput.infoIcon ? "ml-[10px]" : "")}
                    value={labelAndInput.value}
                    onChange={(e) => {
                        labelAndInput.onValueChange!(e.target.value);
                    }}
                />
            ) : labelAndInput.type === "input" ? (
                <Input
                    outerClassName={cn("h-fit", !labelAndInput.infoIcon ? "ml-[10px]" : "")}
                    className="h-[30px]"
                    value={labelAndInput.value}
                    onChange={(e) => labelAndInput.onValueChange!(e.target.value)}
                    placeholder={labelAndInput.placeholder ? labelAndInput.placeholder : ""}
                    type={labelAndInput.inputType === "float" || labelAndInput.inputType === "int" ? "number" : "text"}
                    step={labelAndInput.inputType === "int" ? 1 : labelAndInput.inputType === "float" ? 0.1 : ""}
                    min={labelAndInput.inputType === "float" || labelAndInput.inputType === "int" ? "0" : ""}
                    disabled={labelAndInput.disabled ? labelAndInput.disabled : false}
                />
            ) : labelAndInput.type === "slider" ? (
                <div className="flex gap-[10px] w-full items-center">
                    <Slider
                        value={[labelAndInput.value]}
                        max={labelAndInput.sliderMaxValue}
                        onValueChange={(e) => labelAndInput.onValueChange!(e.pop()!)}
                        step={labelAndInput.stepValue}
                        disabled={labelAndInput.disabled ? labelAndInput.disabled : false}
                    />
                    <Input
                        onChange={(e) => labelAndInput.onValueChange!(Number(e.target.value))}
                        outerClassName="w-[100px] h-fit"
                        className="h-[30px]"
                        value={labelAndInput.value === 0 && labelAndInput.setZeroToAuto ? "" : labelAndInput.value}
                        placeholder={labelAndInput.value === 0 && labelAndInput.setZeroToAuto ? "Auto" : ""}
                        type="number"
                        min="0"
                        step={labelAndInput.stepValue <= 1 ? 0.1 : 1}
                        max={labelAndInput.inputMaxValue ? labelAndInput.inputMaxValue : "none"}
                        disabled={labelAndInput.disabled ? labelAndInput.disabled : false}
                    />
                </div>
            ) : (
                ""
            )}
        </div>
    );
}
export default ModelSettings;
