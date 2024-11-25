/// <reference types="vite-plugin-svgr/client" />

import {useEffect, useState} from "react";
import ChatSession from "../../../../interfaces/ChatSession";
import ModelResponseSettings from "../../../../interfaces/ModelResponseSettings";
import {cn} from "../../../../lib/utils";
import {TooltipProvider, Tooltip, TooltipTrigger, TooltipContent} from "../../../shadcncomponents/tooltip";
import {IconToggle, IconToggleOnState, IconToggleOffState} from "../../misc/IconToggle";
import System from "../../../../icons/device-desktop-flat.svg?react";
import SystemOff from "../../../../icons/device-desktop-off-flat.svg?react";
import {Popover, PopoverTrigger, PopoverContent} from "../../../shadcncomponents/popover";
import {
    MaxTokensSetting,
    MinPSetting,
    SeedSetting,
    TemperatureSetting,
    TopKSetting,
    TopPSetting
} from "../ModelSettings/ModelSettingsSingle";
import {Separator} from "../../../shadcncomponents/Separator";

interface Iqb {
    icon: string,
    label: "Temperature" | "Max Tokens" | "minP" | "topP" | "topK" | "seed"
}
const qb: Iqb[] = [
    {icon: "T", label: "Temperature"},
    {icon: "MT", label: "Max Tokens"},
    {icon: "mP", label: "minP"},
    {icon: "tP", label: "topP"},
    {icon: "tK", label: "topK"},
    {icon: "s", label: "seed"}
];

interface QuickSettingsProps {
    modelResponseSettings: ModelResponseSettings,
    selectedChatSession?: ChatSession,
    isSystemPrompt: boolean,
    isShowSystemPrompt: boolean,
    setModelResponseSettings: React.Dispatch<React.SetStateAction<ModelResponseSettings>>,
    setIsShowSystemPrompt(value: React.SetStateAction<boolean>): void
}
export default function QuickSettings({
    modelResponseSettings,
    selectedChatSession,
    isSystemPrompt,
    isShowSystemPrompt,
    setIsShowSystemPrompt,
    setModelResponseSettings
}: QuickSettingsProps): JSX.Element {
    const [minP, setMinP] = useState<number>(modelResponseSettings.responseSettings.minP);
    const [topP, setTopP] = useState<number>(modelResponseSettings.responseSettings.topP);
    const [topK, setTopK] = useState<number>(modelResponseSettings.responseSettings.topK);
    const [seed, setSeed] = useState<number>(modelResponseSettings.responseSettings.seed);
    const [maxTokens, setMaxTokens] = useState<number>(modelResponseSettings.responseSettings.maxTokens);
    const [temperature, setTemperature] = useState<number>(modelResponseSettings.responseSettings.temperature);

    useEffect(() => {
        if (selectedChatSession !== undefined) {
            console.log("modelResponseSettings object updated in QuickSettings.tsx");
            setModelResponseSettings((mrs) => ({
                ...mrs,
                responseSettings: {
                    temperature: temperature,
                    maxTokens: maxTokens,
                    minP: minP,
                    topP: topP,
                    topK: topK,
                    seed: seed
                }
            }));
        }
    }, [temperature, maxTokens, minP, topP, topK, seed]);

    useEffect(() => {
        if (selectedChatSession === undefined) {
            console.log("response settings updated in QuickSettings.tsx as a result of change in ModelSettings.tsx");

            setMinP(modelResponseSettings.responseSettings.minP);
            setTopP(modelResponseSettings.responseSettings.topP);
            setTopK(modelResponseSettings.responseSettings.topK);
            setSeed(modelResponseSettings.responseSettings.seed);
            setMaxTokens(modelResponseSettings.responseSettings.maxTokens);
            setTemperature(modelResponseSettings.responseSettings.temperature);
        }
    }, [
        modelResponseSettings.responseSettings.minP,
        modelResponseSettings.responseSettings.topP,
        modelResponseSettings.responseSettings.topK,
        modelResponseSettings.responseSettings.seed,
        modelResponseSettings.responseSettings.maxTokens,
        modelResponseSettings.responseSettings.temperature
    ]);

    useEffect(() => {
        console.log("response settings updated in QuickSettings.tsx as a result of chat session change");

        setMinP(modelResponseSettings.responseSettings.minP);
        setTopP(modelResponseSettings.responseSettings.topP);
        setTopK(modelResponseSettings.responseSettings.topK);
        setSeed(modelResponseSettings.responseSettings.seed);
        setMaxTokens(modelResponseSettings.responseSettings.maxTokens);
        setTemperature(modelResponseSettings.responseSettings.temperature);
    }, [selectedChatSession]);

    return (
        <>
            <div className="flex flex-row items-center justify-center w-fit bg-foreground h-[40px] rounded-[5px] gap-[20px] px-[20px]">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger
                            className={cn(
                                "flex flex-col items-center ",
                                !isSystemPrompt || selectedChatSession === undefined ? "cursor-default" : ""
                            )}
                        >
                            <IconToggle
                                startState={isShowSystemPrompt}
                                onChangeValue={(value) => setIsShowSystemPrompt(value)}
                                disabled={!isSystemPrompt || selectedChatSession === undefined}
                            >
                                <IconToggleOnState>
                                    <System className="size-[24px]" />
                                </IconToggleOnState>
                                <IconToggleOffState>
                                    <SystemOff className="size-[24px]" />
                                </IconToggleOffState>
                            </IconToggle>
                        </TooltipTrigger>
                        <TooltipContent className="px-3 py-1" side="top" sideOffset={15}>
                            <p>Show System Prompt</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <div className="h-full py-[10px]">
                    <Separator orientation="vertical" />
                </div>
                {qb.map((value, index) => (
                    <TooltipProvider key={index}>
                        <Popover>
                            <Tooltip>
                                <PopoverTrigger
                                    asChild
                                    disabled={selectedChatSession === undefined ? true : false}
                                    className="flex justify-center size-[24px]"
                                >
                                    <TooltipTrigger className="flex flex-col items-center">
                                        <div
                                            className={cn(
                                                "cursor-pointer text-cblack dark:text-primary line-clamp-none leading-none text-[20px]",
                                                selectedChatSession === undefined
                                                    ? "cursor-default text-cblack/40 dark:text-primary/40"
                                                    : ""
                                            )}
                                        >
                                            {value.icon}
                                        </div>
                                    </TooltipTrigger>
                                </PopoverTrigger>
                                <TooltipContent className="px-3 py-1" side="top" sideOffset={15}>
                                    <p>{value.label}</p>
                                </TooltipContent>
                                <PopoverContent side="top" sideOffset={10} className="px-5 py-3 text-[15px]">
                                    {value.label === "Temperature" ? (
                                        <TemperatureSetting temperature={temperature} setTemperature={setTemperature} />
                                    ) : value.label === "Max Tokens" ? (
                                        <MaxTokensSetting maxTokens={maxTokens} setMaxTokens={setMaxTokens} />
                                    ) : value.label === "minP" ? (
                                        <MinPSetting temperature={temperature} minP={minP} setMinP={setMinP} />
                                    ) : value.label === "topP" ? (
                                        <TopPSetting temperature={temperature} topP={topP} setTopP={setTopP} />
                                    ) : value.label === "topK" ? (
                                        <TopKSetting temperature={temperature} topK={topK} setTopK={setTopK} />
                                    ) : value.label === "seed" ? (
                                        <SeedSetting temperature={temperature} seed={seed} setSeed={setSeed} />
                                    ) : (
                                        ""
                                    )}
                                </PopoverContent>
                            </Tooltip>
                        </Popover>
                    </TooltipProvider>
                ))}
            </div>
        </>
    );
}
