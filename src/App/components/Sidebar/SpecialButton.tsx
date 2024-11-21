/// <reference types="vite-plugin-svgr/client" />

import React, {useRef, useState} from "react";
import {DialogTrigger} from "@radix-ui/react-dialog";
import Chat from "../../../icons/message.svg?react";
import Dots from "../../../icons/dots.svg?react";
import {DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem} from "../../shadcncomponents/dropdown-menu";
import {Input} from "../../shadcncomponents/Input";
import useClickOutside from "../../../hooks/useClickOutside";
import ChatSessionAndFilename from "../../../interfaces/ChatSessionAndFilename";
import {cn} from "../../../lib/utils";
import PromptAndFilename from "../../../interfaces/PromptAndFilename";
import {DeleteChatSessionDialog} from "../Dialogs/DeleteChatSessionDialog";
import {DeletePromptDialog} from "../Dialogs/DeletePromptDialog";

interface SpecialButtonProps {
    item: ChatSessionAndFilename | PromptAndFilename,
    index: number,
    disabled: boolean,
    onClick(): void,
    renameItem(event: React.KeyboardEvent, index: number, itemName: string): void,
    deleteItem(index: number): void,
    exportItem(): void
}

function SpecialButton({item, index, disabled, onClick, renameItem, deleteItem, exportItem}: SpecialButtonProps): JSX.Element {
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>("");
    const ref = useRef<HTMLInputElement>(null);
    useClickOutside(ref, () => setIsEditMode(false));

    return (
        <div
            onClick={() => (!disabled ? onClick() : "")}
            onKeyDownCapture={(e) => {
                if (e.key === "Escape") {
                    console.log("Escape key entered. Removing input element");
                    setIsEditMode(false);
                } else if (e.key === "Tab") {
                    console.log("Tab key entered. Resetting input element");
                    e.preventDefault();
                    setInputValue("chatSession" in item ? item.chatSession.name : item.prompt.name);
                } else if (e.key === "Enter") {
                    renameItem(e, index, inputValue);
                    setIsEditMode(false);
                }
            }}
            className={cn(
                `flex flex-none items-center h-[40px] w-full px-[10px] rounded-[5px] text-cblack dark:text-cwhite bg-foreground-dark
      dark:bg-background-light text-[15px] select-none hover:bg-foreground-dark/60 hover:dark:bg-white/20
      active:bg-foreground-dark/40 active:dark:bg-white/30 cursor-pointer `,
                disabled && "chatSession" in item
                    ? "bg-primary/20 dark:bg-primary/20 hover:bg-primary/30 hover:dark:bg-primary/30 active:bg-primary/40 active:dark:bg-primary/40"
                    : ""
            )}
        >
            <Chat className="mr-[6px] size-[20px] text-primary overflow-visible" />
            {isEditMode ? (
                <Input
                    ref={ref}
                    className="h-fit"
                    placeholder={"chatSession" in item ? item.chatSession.name : item.prompt.name}
                    // defaultValue={"chatSession" in item ? item.chatSession.name : item.prompt.name}
                    value={inputValue}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => setInputValue(e.target.value)}
                    autoFocus={true}
                />
            ) : (
                <span className={cn("truncate", disabled && "chatSession" in item ? "font-semibold" : "font-normal")}>
                    {"chatSession" in item ? item.chatSession.name : item.prompt.name}
                </span>
            )}
            {!isEditMode ? (
                <div className="flex flex-1 justify-end items-center">
                    {"chatSession" in item ? (
                        <DeleteChatSessionDialog deleteItem={() => deleteItem(index)} ChatSessionAndFilename={item}>
                            <DropdownMenu>
                                <DropdownMenuTrigger className="flex items-center">
                                    <Dots className="text-icon-gray size-[20px]" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            exportItem();
                                        }}
                                    >
                                        Export
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setInputValue(item.chatSession.name);
                                            setIsEditMode(true);
                                            // setInputValue("chatSession" in item ? item.chatSession.name : item.prompt.name);
                                        }}
                                    >
                                        Edit
                                    </DropdownMenuItem>
                                    <DialogTrigger asChild>
                                        <DropdownMenuItem
                                            onClick={(e) => e.stopPropagation()}
                                            className="text-negative font-semibold focus:bg-negative/50 dark:focus:bg-negative/30 focus:text-negative"
                                        >
                                            Delete
                                        </DropdownMenuItem>
                                    </DialogTrigger>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </DeleteChatSessionDialog>
                    ) : (
                        <DeletePromptDialog prompt={item} deleteItem={() => deleteItem(index)}>
                            <DropdownMenu>
                                <DropdownMenuTrigger className="flex items-center">
                                    <Dots className="text-icon-gray size-[20px]" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            exportItem();
                                        }}
                                    >
                                        Export
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setInputValue(item.prompt.name);
                                            setIsEditMode(true);
                                        }}
                                    >
                                        Edit
                                    </DropdownMenuItem>
                                    <DialogTrigger asChild>
                                        <DropdownMenuItem
                                            onClick={(e) => e.stopPropagation()}
                                            className="text-negative font-semibold focus:bg-negative/50 dark:focus:bg-negative/30 focus:text-negative"
                                        >
                                            Delete
                                        </DropdownMenuItem>
                                    </DialogTrigger>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </DeletePromptDialog>
                    )}
                </div>
            ) : (
                ""
            )}
        </div>
    );
}

export default SpecialButton;
