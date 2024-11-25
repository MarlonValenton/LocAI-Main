/// <reference types="vite-plugin-svgr/client" />

import {useState} from "react";
import {Button} from "../../shadcncomponents/Button";
import System from "../../../icons/device-desktop-flat.svg?react";
import SystemOff from "../../../icons/device-desktop-off-flat.svg?react";
import {DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose} from "../../shadcncomponents/dialog";
import ChatSessionAndFilename from "../../../interfaces/ChatSessionAndFilename";
import ChatArea from "../Center/ChatArea/ChatArea";
import {IconToggle, IconToggleOffState, IconToggleOnState} from "../misc/IconToggle";
import ExtraInformationDialog from "./ExtraInformationDialog";

interface DeleteChatSessionDialogProps {
    chatSessionAndFilename: ChatSessionAndFilename,
    isDarkMode: boolean,
    deleteItem(): void
}

export function DeleteChatsessionDialog({chatSessionAndFilename, isDarkMode, deleteItem}: DeleteChatSessionDialogProps) {
    const [isShowSystemPrompt, setIsShowSystemPrompt] = useState<boolean>(false);

    let disabled: boolean;
    if (chatSessionAndFilename.chatSession.chatHistory) {
        if (chatSessionAndFilename.chatSession.chatHistory.length) {
            if (chatSessionAndFilename.chatSession.chatHistory[0]!.type !== "system") {
                disabled = true;
            } else disabled = false;
        } else disabled = false;
    } else disabled = false;

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <DialogContent className="max-w-[50%] p-0 m-0 gap-0">
                <DialogHeader className="px-[15px] pt-[15px] pb-[10px] border-border-gray border-b-[1px] h-fit select-none">
                    <DialogTitle>Delete Chat Session</DialogTitle>
                    <DialogDescription>Are you sure you want to delete this chat session?</DialogDescription>
                </DialogHeader>
                <ExtraInformationDialog
                    items={[
                        ["Filename", chatSessionAndFilename.filename],
                        ["Path", chatSessionAndFilename.path],
                        ["Model Name", chatSessionAndFilename.chatSession.modelName],
                        ["Model Path", chatSessionAndFilename.chatSession.modelPath],
                        ["Input Tokens", chatSessionAndFilename.chatSession.inputTokens],
                        ["Output Tokens", chatSessionAndFilename.chatSession.outputTokens]
                    ]}
                    contentClassName="h-fit max-h-[450px]"
                />
                <div className="h-[calc(100vh/2)] overflow-auto">
                    <ChatArea
                        chatHistory={chatSessionAndFilename.chatSession.chatHistory}
                        isShowSystemPrompt={isShowSystemPrompt}
                        isDarkMode={isDarkMode}
                    />
                </div>
                <DialogFooter className="border-border-gray border-t-[1px] px-[15px] py-[10px]">
                    <div className="flex gap-[10px] flex-grow items-center select-none">
                        <IconToggle
                            startState={false}
                            onChangeValue={(value) => setIsShowSystemPrompt(value)}
                            disabled={disabled}
                            cursor={!disabled}
                        >
                            <IconToggleOnState>
                                <System className="size-[24px]" />
                            </IconToggleOnState>
                            <IconToggleOffState>
                                <SystemOff className="size-[24px]" />
                            </IconToggleOffState>
                        </IconToggle>
                        System prompt visibility
                    </div>
                    <DialogClose asChild>
                        <Button className="w-[100px]" variant="transparent_full">
                            Cancel
                        </Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button className="w-[100px]" variant="negative" onClick={() => deleteItem()}>
                            Delete
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </div>
    );
}
