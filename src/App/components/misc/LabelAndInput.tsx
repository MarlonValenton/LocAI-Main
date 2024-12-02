/// <reference types="vite-plugin-svgr/client" />

import {cn} from "../../../lib/utils";
import {Checkbox} from "../../shadcncomponents/checkbox";
import {Input} from "../../shadcncomponents/Input";
import {Label} from "../../shadcncomponents/Label";
import {Slider} from "../../shadcncomponents/slider";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "../../shadcncomponents/select";
import {Textarea} from "../../shadcncomponents/textarea";
import {Tooltip, TooltipProvider, TooltipTrigger} from "../../shadcncomponents/tooltip";
import Info from "../../../icons/info-circle.svg?react";

type LabelAndSelectProps = {
    type: "select",
    children?: string | [string, JSX.Element?],
    infoIcon?: boolean,
    selectText: string,
    items?: {item: string, value: string}[],
    value?: string,
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
                <Select onValueChange={labelAndInput.onValueChange} value={labelAndInput.value}>
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

export default LabelAndInput;
