import {DialogClose} from "@radix-ui/react-dialog";
import {useState} from "react";
import {Button} from "../../shadcncomponents//Button";
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "../../shadcncomponents/dialog";
import ChatSessionAndFilename from "../../../interfaces/ChatSessionAndFilename";
import {Switch} from "../../shadcncomponents/switch";
import ChatArea from "../Center/ChatArea/ChatArea";
import ExtraInformationDialog from "./ExtraInformationDialog";

interface DeleteDialogProps {
    ChatSessionAndFilename: ChatSessionAndFilename,
    children?: JSX.Element,
    deleteItem(): void
}

export function DeleteChatSessionDialog({ChatSessionAndFilename, children, deleteItem}: DeleteDialogProps) {
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
                    {/* <ExtraInformationDialog
                        filename={ChatSessionAndFilename.filename}
                        modelName={ChatSessionAndFilename.chatSession.modelName}
                        inputTokens={ChatSessionAndFilename.chatSession.inputTokens}
                        outputTokens={ChatSessionAndFilename.chatSession.outputTokens}
                    /> */}
                    <ExtraInformationDialog
                        items={[
                            ["Filename", ChatSessionAndFilename.filename],
                            ["Path", ChatSessionAndFilename.path],
                            ["Model Name", ChatSessionAndFilename.chatSession.modelName],
                            ["Model Path", ChatSessionAndFilename.chatSession.modelPath],
                            ["Input Tokens", ChatSessionAndFilename.chatSession.inputTokens],
                            ["Output Tokens", ChatSessionAndFilename.chatSession.outputTokens]
                        ]}
                        contentClassName="h-fit max-h-[450px]"
                    />
                    <div className="h-[calc(100vh/2)] overflow-auto">
                        <ChatArea chatHistory={ChatSessionAndFilename.chatSession.chatHistory} isShowSystemPrompt={isShowSystemPrompt} />
                    </div>
                    <DialogFooter className="border-border-gray border-t-[1px] px-[15px] py-[10px]">
                        <div className="flex gap-[10px] flex-grow items-center">
                            <Switch checked={isShowSystemPrompt} onCheckedChange={() => setIsShowSystemPrompt((value) => !value)} />
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
