/// <reference types="vite-plugin-svgr/client" />

import {useRef, useState} from "react";
import {DialogTrigger} from "@radix-ui/react-dialog";
import Chat from "../../../icons/message.svg?react";
import Dots from "../../../icons/dots.svg?react";
import {DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem} from "../../shadcncomponents/dropdown-menu";
import {Input} from "../../shadcncomponents/Input";
import useClickOutside from "../../../hooks/useClickOutside";
import ChatSessionAndFilename from "../../../interfaces/ChatSessionAndFilename";
import {cn} from "../../../lib/utils";
import PromptAndFilename from "../../../interfaces/PromptAndFilename";
import {DeletePromptDialog} from "../Dialogs/DeletePromptDialog";
import {Dialog} from "../../shadcncomponents/dialog";
import {EditPromptDialog} from "../Dialogs/EditPromptDialog";
import {EditItemValues} from "../../../interfaces/EditItemValues";
import {DeleteChatsessionDialog} from "../Dialogs/DeleteChatSessionDialog2";
import {EditChatSessionDialog} from "../Dialogs/EditChatSessionDialog";

interface SpecialButtonProps {
    item: ChatSessionAndFilename | PromptAndFilename,
    index: number,
    disabled?: boolean,
    isDarkMode: boolean,
    onClick(): void,
    renameItem(index: number, values: EditItemValues): void,
    editItem(index: number, values: EditItemValues): void,
    deleteItem(index: number): void,
    exportItem(): void
}

function SpecialButton({
    item,
    index,
    disabled,
    isDarkMode,
    onClick,
    renameItem,
    editItem,
    deleteItem,
    exportItem
}: SpecialButtonProps): JSX.Element {
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>("");
    const [dialogType, setDialogType] = useState<"delete" | "edit">();
    const ref = useRef<HTMLInputElement>(null);
    useClickOutside(ref, () => setIsEditMode(false));

    let dropdownLabel: string;

    if ("chatSession" in item) {
        dropdownLabel = "Edit Chat Session";
    } else dropdownLabel = "Edit Prompt";

    return (
        <div
            onClick={() => (disabled !== undefined ? (!disabled ? onClick() : "") : onClick())}
            onKeyDownCapture={(e) => {
                if (e.key === "Escape") {
                    console.log("Escape key entered. Removing input element");
                    setIsEditMode(false);
                } else if (e.key === "Tab") {
                    console.log("Tab key entered. Resetting input element");
                    e.preventDefault();
                    setInputValue("chatSession" in item ? item.chatSession.name : item.prompt.name);
                } else if (e.key === "Enter") {
                    renameItem(
                        index,
                        "chatSession" in item
                            ? {
                                name: inputValue,
                                systemPrompt: item.chatSession.systemPrompt,
                                contextSize: item.chatSession.contextSize,
                                modelLevelFlashAttention: item.chatSession.modelLevelFlashAttention,
                                contextLevelFlashAttention: item.chatSession.contextLevelFlashAttention
                            }
                            : {name: inputValue, description: item.prompt.description, prompt: item.prompt.prompt}
                    );
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
                    <Dialog>
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger className="flex items-center" onClick={(e) => e.stopPropagation()}>
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
                                        setInputValue("chatSession" in item ? item.chatSession.name : item.prompt.name);
                                        setIsEditMode(true);
                                        // setInputValue("chatSession" in item ? item.chatSession.name : item.prompt.name);
                                    }}
                                >
                                    Rename
                                </DropdownMenuItem>
                                <DialogTrigger
                                    asChild
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setDialogType("edit");
                                    }}
                                >
                                    <DropdownMenuItem
                                        onClick={(e) => {
                                            e.stopPropagation();
                                        }}
                                    >
                                        {dropdownLabel}
                                    </DropdownMenuItem>
                                </DialogTrigger>
                                <DialogTrigger
                                    asChild
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setDialogType("delete");
                                    }}
                                >
                                    <DropdownMenuItem
                                        onClick={(e) => e.stopPropagation()}
                                        className="text-negative font-semibold focus:bg-negative/50 dark:focus:bg-negative/30 focus:text-negative"
                                    >
                                        Delete
                                    </DropdownMenuItem>
                                </DialogTrigger>
                            </DropdownMenuContent>
                            {dialogType === "edit" ? (
                                "chatSession" in item ? (
                                    <EditChatSessionDialog index={index} chatSessionAndFilename={item} editItem={editItem} />
                                ) : (
                                    <EditPromptDialog index={index} prompt={item} editItem={editItem}></EditPromptDialog>
                                )
                            ) : "chatSession" in item ? (
                                <DeleteChatsessionDialog
                                    chatSessionAndFilename={item}
                                    isDarkMode={isDarkMode}
                                    deleteItem={() => deleteItem(index)}
                                />
                            ) : (
                                <DeletePromptDialog prompt={item} deleteItem={() => deleteItem(index)} />
                            )}
                        </DropdownMenu>
                    </Dialog>
                </div>
            ) : (
                ""
            )}
        </div>
    );
}

export default SpecialButton;
