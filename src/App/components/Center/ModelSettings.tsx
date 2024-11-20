/// <reference types="vite-plugin-svgr/client" />

import {useCallback, useEffect, useState} from "react";
import Info from "../../../icons/info-circle.svg?react";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "../../shadcncomponents/select";
import {Button} from "../../shadcncomponents/Button";
import {Label} from "../../shadcncomponents/Label";
import {Input} from "../../shadcncomponents/Input";
import {Textarea} from "../../shadcncomponents/textarea";
import {Separator} from "../../shadcncomponents/Separator";
import {Slider} from "../../shadcncomponents/slider";
import {Checkbox} from "../../shadcncomponents/checkbox";

interface ModelSettingsProps {
    setSelectedModel: React.Dispatch<React.SetStateAction<string>>,
    selectedModel: string,
    loadModelAndSession(): Promise<void>
}

function ModelSettings({setSelectedModel, selectedModel, loadModelAndSession}: ModelSettingsProps): JSX.Element {
    const [modelFiles, setModelFiles] = useState<string[]>([]);

    if (modelFiles.length == 0) {
        window.utils.getModelFiles().then((value) => setModelFiles(value));
    }

    return (
        <div className="flex flex-col flex-grow justify-center items-center">
            <div className="flex flex-col w-[650px] min-h-[400px] lg:max-h-[448px] 2xl:max-h-fit border-[1px] border-border-gray rounded-[5px] px-[20px] py-[25px] text-[20px] [&>*:not(:last-child)]:mb-3 overflow-y-auto">
                <LabelAndInput
                    type="select"
                    label="Model"
                    selectOptions={{selectText: "Select a model"}}
                    onValueChange={setSelectedModel}
                    items={modelFiles.map((item) => ({item: item.split("\\").pop()!, value: item}))}
                />
                <LabelAndInput type="textarea" label="System Prompt" infoIcon={true} onValueChange={setSelectedModel} />
                <LabelAndInput
                    type="select"
                    label="Preload Prompt"
                    selectOptions={{selectText: "Select Preload prompt"}}
                    infoIcon={true}
                    onValueChange={() => console.log("preload prompt value change")}
                    items={[
                        {item: "User defined prompt", value: "User defined prompt1"},
                        {item: "User defined prompt", value: "User defined prompt2"},
                        {item: "User defined prompt", value: "User defined prompt3"}
                    ]}
                />
                <LabelAndInput type="textarea" label="Preload prompt preview" infoIcon={true} />
                <div className="flex gap-[5px] items-center w-full">
                    <Separator className="flex-1" />
                    <Label className="w-fit text-[15px]">Response Settings</Label>
                    <Separator className="flex-1" />
                </div>
                <div className="flex">
                    <div className="flex flex-col w-[50%] gap-[10px]">
                        <LabelAndInput
                            type="slider"
                            sliderOptions={{defaultValue: 4096, maxValue: 8192, stepValue: 1024, setZeroToAuto: true}}
                            label="Context Size"
                            infoIcon={true}
                        />
                        <LabelAndInput
                            type="slider"
                            sliderOptions={{defaultValue: 0, maxValue: 1, stepValue: 0.1, setZeroToAuto: false}}
                            label="Temperature"
                            infoIcon={true}
                        />
                        <LabelAndInput type="input" label="Max tokens" infoIcon={true} />
                        <div className="flex gap-[10px] items-center h-full">
                            <Checkbox />
                            <Label className="text-[15px]">Flash Attention</Label>
                            <Info className="text-icon-gray size-[20px]" />
                        </div>
                    </div>
                    <Separator orientation="vertical" className="h-full flex-none mx-[20px]" />
                    <div className="flex flex-col w-[50%] gap-[10px]">
                        <LabelAndInput
                            type="slider"
                            sliderOptions={{defaultValue: 0, maxValue: 1, stepValue: 0.1, setZeroToAuto: false}}
                            label="minP"
                            infoIcon={true}
                        />
                        <LabelAndInput
                            type="slider"
                            sliderOptions={{defaultValue: 0, maxValue: 1, stepValue: 0.1, setZeroToAuto: false}}
                            label="topP"
                            infoIcon={true}
                        />
                        <LabelAndInput type="input" label="topK" infoIcon={true} />
                        <LabelAndInput type="input" label="seed" infoIcon={true} />
                    </div>
                </div>

                <Button onClick={() => loadModelAndSession()} disabled={selectedModel === ""}>
                    Load Model
                </Button>
            </div>
        </div>
    );
}

interface LabelAndSelectProps {
    type: "select" | "textarea" | "input" | "slider",
    infoIcon?: boolean,
    selectOptions?: {selectText?: string},
    sliderOptions?: {defaultValue: number, maxValue: number, stepValue: number, setZeroToAuto: boolean},
    inputOptions?: {placeholder: string},
    label: string,
    items?: {item: string, value: string}[],
    onValueChange?: React.Dispatch<React.SetStateAction<string>>
}
function LabelAndInput({type, infoIcon, label, selectOptions, sliderOptions, inputOptions, items, onValueChange}: LabelAndSelectProps) {
    const [sliderValue, setSliderValue] = useState<number>(0);

    const onInputKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            e.preventDefault();

            if (e.key === "ArrowUp") {
                if (sliderOptions!.maxValue <= 1) {
                    setSliderValue((value) => Number((value + 0.1).toFixed(1)));
                } else setSliderValue((value) => value + 1);
            } else if (e.key === "ArrowDown" && sliderValue > 0) {
                if (sliderOptions!.maxValue <= 1) {
                    setSliderValue((value) => Number((value - 0.1).toFixed(1)));
                } else setSliderValue((value) => value - 1);
            } else if (e.key === "Backspace") {
                setSliderValue((value) => Number(value.toString().slice(0, -1)));
            }

            if ("0123456789".includes(e.key) && sliderOptions!.stepValue <= 1) {
                setSliderValue((value) => Number(value.toString() + e.key));
            }
        },
        [sliderValue]
    );

    useEffect(() => {
        if (type === "slider" && sliderOptions) {
            setSliderValue(sliderOptions!.defaultValue);
        }
    }, []);

    let labelStyle = "items-center";
    let selectStyle = "ml-[10px]";
    let flexStyle = "flex-row";
    let labelPositionStyle = "w-fit";
    if (type === "textarea") {
        labelStyle = "items-start";
    }

    if (infoIcon && type === "select") {
        selectStyle = "ml-0";
    }

    if (type === "slider") {
        flexStyle = "flex-col";
    }

    if (type === "slider") {
        labelPositionStyle = "w-full";
    }

    return (
        <div className={`flex ${flexStyle} ${labelStyle}`}>
            <span className={`flex flex-none items-center ${labelPositionStyle}`}>
                <Label className="text-[15px] whitespace-nowrap">{label}</Label>
                {infoIcon ? <Info className="text-icon-gray size-[20px] mx-[5px]" /> : ""}
            </span>
            {type === "select" ? (
                <Select onValueChange={onValueChange}>
                    <SelectTrigger className={`h-[35px] ${selectStyle}`}>
                        <SelectValue placeholder={selectOptions?.selectText} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {items!.map((item, index) => {
                                return (
                                    <SelectItem value={item.value} key={index}>
                                        {item.item}
                                    </SelectItem>
                                );
                            })}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            ) : type === "textarea" ? (
                <Textarea className="h-full max-h-[200px]" />
            ) : type === "input" ? (
                <Input outerClassName="h-fit" className="h-[30px]" placeholder={inputOptions?.placeholder} />
            ) : type === "slider" && sliderOptions ? (
                <div className="flex gap-[10px] w-full items-center">
                    <Slider
                        defaultValue={[sliderOptions.defaultValue]}
                        value={[sliderValue]}
                        max={sliderOptions.maxValue}
                        onValueChange={(e) => setSliderValue(e.pop()!)}
                        step={sliderOptions.stepValue}
                        className="my-[0px]"
                    />
                    <Input
                        onKeyDownCapture={onInputKeyDown}
                        onInput={(e) => console.log(e.currentTarget.value)}
                        outerClassName="w-[100px] h-fit"
                        className="h-[30px]"
                        value={sliderValue === 0 && sliderOptions.setZeroToAuto ? "Auto" : sliderValue}
                        // onChange={(e) => console.log(e.target.value)}
                    />
                </div>
            ) : (
                ""
            )}
        </div>
    );
}
export default ModelSettings;
