/// <reference types="vite-plugin-svgr/client" />

import React, {useRef, useState} from "react";
import {DialogTrigger} from "@radix-ui/react-dialog";
import Chat from "../../../icons/message.svg?react";
import Dots from "../../../icons/dots.svg?react";
import {DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem} from "../../shadcncomponents/dropdown-menu";
import {Input} from "../../shadcncomponents/Input";
import useClickOutside from "../../../hooks/useClickOutside";
import {DeleteDialog} from "../Dialogs/DeleteDialog";
import ChatSessionAndFilename from "../../../interfaces/ChatSessionAndFilename";

interface SpecialButtonProps {
    item: ChatSessionAndFilename,
    index: number,
    onClick(index: number): void,
    onEnter(event: React.KeyboardEvent, index: number, chatSession: string, callback: () => void): void,
    onDelete(index: number): void,
    exportItem(): void
}

function SpecialButton({item, index, onClick, onEnter, onDelete, exportItem}: SpecialButtonProps): JSX.Element {
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>("");
    const ref = useRef<HTMLInputElement>(null);
    useClickOutside(ref, () => setIsEditMode(false));

    return (
        <div
            onClick={() => onClick(index)}
            onKeyDownCapture={(e) => onEnter(e, index, inputValue, () => setIsEditMode(false))}
            className="flex items-center h-[40px] w-full px-[10px] rounded-[5px] text-cblack dark:text-cwhite bg-foreground-dark
      dark:bg-background-light text-[15px] select-none hover:bg-foreground-dark/60 hover:dark:bg-white/20
      active:bg-foreground-dark/40 active:dark:bg-white/30 cursor-pointer"
        >
            <Chat className="mr-[6px] size-[20px] text-primary overflow-visible" />
            {isEditMode ? (
                <Input
                    ref={ref}
                    className="h-fit"
                    placeholder={item.chatSession.name}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => setInputValue(e.target.value)}
                />
            ) : (
                <span className="truncate">{item.chatSession.name}</span>
            )}
            {!isEditMode ? (
                <div className="flex flex-1 justify-end items-center">
                    <DeleteDialog onDelete={() => onDelete(index)} chatHistory={item.chatSession.chatHistory!}>
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
                    </DeleteDialog>
                </div>
            ) : (
                ""
            )}
        </div>
    );
}

export default SpecialButton;
