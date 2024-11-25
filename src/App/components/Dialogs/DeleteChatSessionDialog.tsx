import {DialogClose} from "@radix-ui/react-dialog";
import {useState} from "react";
import {Button} from "../../shadcncomponents//Button";
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "../../shadcncomponents/dialog";
import ChatSessionAndFilename from "../../../interfaces/ChatSessionAndFilename";
import {Switch} from "../../shadcncomponents/switch";
import ChatArea from "../Center/ChatArea/ChatArea";
import ExtraInformationDialog from "./ExtraInformationDialog";

interface DeleteDialogProps {
    chatSessionAndFilename: ChatSessionAndFilename,
    isDarkMode: boolean,
    children?: JSX.Element,
    deleteItem(): void
}

export function DeleteChatSessionDialog({chatSessionAndFilename, isDarkMode, children, deleteItem}: DeleteDialogProps) {
    const [isShowSystemPrompt, setIsShowSystemPrompt] = useState<boolean>(false);

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <Dialog>
                {children}
                <DialogContent className="max-w-[50%] p-0 m-0 gap-0">
                    <DialogHeader className="px-[15px] pt-[15px] pb-[10px] border-border-gray border-b-[1px] h-fit">
                        <DialogTitle>Delete Item</DialogTitle>
                        <DialogDescription>Are you sure you want to delete this item?</DialogDescription>
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
                        <div className="flex gap-[10px] flex-grow items-center">
                            <Switch
                                checked={isShowSystemPrompt}
                                onCheckedChange={() => setIsShowSystemPrompt((value) => !value)}
                                disabled={
                                    chatSessionAndFilename.chatSession.chatHistory
                                        ? chatSessionAndFilename.chatSession.chatHistory.length
                                            ? chatSessionAndFilename.chatSession.chatHistory[0]!.type !== "system"
                                                ? true
                                                : false
                                            : true
                                        : true
                                }
                            />
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
            </Dialog>
        </div>
    );
}
