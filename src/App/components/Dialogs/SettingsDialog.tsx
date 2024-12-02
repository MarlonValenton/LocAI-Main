/// <reference types="vite-plugin-svgr/client" />

import {DialogClose} from "@radix-ui/react-dialog";
import {useEffect} from "react";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from "../../shadcncomponents/dialog";
import {Button} from "../../shadcncomponents/Button";
import LabelAndInput from "../misc/LabelAndInput";
import {Label} from "../../shadcncomponents/Label";
import LocaiConfig from "../../../interfaces/locaiconfig";
import FolderOpen from "../../../icons/folder-open.svg?react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "../../shadcncomponents/tooltip";
import {openPath, saveConfig} from "../../../lib/miscUtils";

const initSettings: LocaiConfig = await window.utils.getConfig();
const openables = [
    {display: "Models Directory", value: initSettings.modelsDirectory},
    {display: "Chat Sessions Directory", value: initSettings.chatSessionsDirectory},
    {display: "Prompts Directory", value: initSettings.promptsDirectory}
];

interface SettingsDialogProps {
    isDarkMode: boolean,
    setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>,
    children: JSX.Element | JSX.Element[]
}
export default function SettingsDialog({isDarkMode, setIsDarkMode, children}: SettingsDialogProps) {
    useEffect(() => {
        saveConfig({
            ...initSettings,
            theme: isDarkMode ? "dark" : "light"
        });
    }, [isDarkMode]);

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-[50%] p-0 m-0 gap-0">
                <DialogHeader className="px-[15px] pt-[15px] pb-[10px] border-border-gray border-b-[1px] h-fit select-none">
                    <DialogTitle>Settings</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-[20px] p-[15px]">
                    <LabelAndInput
                        type="select"
                        selectText="Select a theme"
                        items={[
                            {item: "Light Mode", value: "Light Mode"},
                            {item: "Dark Mode", value: "Dark Mode"}
                        ]}
                        value={isDarkMode ? "Dark Mode" : "Light Mode"}
                        onValueChange={(value) => (value === "Light Mode" ? setIsDarkMode(false) : setIsDarkMode(true))}
                    >
                        Theme
                    </LabelAndInput>
                    {openables.map((value, index) => (
                        <div className="flex flex-col gap-[5px]" key={index}>
                            <Label className="flex items-center gap-[10px]">
                                {value.display}
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <FolderOpen className="size-[20px]" onClick={() => openPath(value.value)} />
                                        </TooltipTrigger>
                                        <TooltipContent className="p-[5px]">Open in file explorer</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </Label>
                            <p>{value.value}</p>
                        </div>
                    ))}
                </div>
                <DialogFooter className="border-border-gray border-t-[1px] px-[15px] py-[10px]">
                    <DialogClose asChild>
                        <Button variant="transparent_full" className="w-[100px]">
                            Cancel
                        </Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button className="w-[100px]">Save</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
