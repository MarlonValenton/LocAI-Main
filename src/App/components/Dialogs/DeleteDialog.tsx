import {DialogClose} from "@radix-ui/react-dialog";
import {Button} from "../../shadcncomponents//Button";
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "../../shadcncomponents/dialog";
import ChatSingle from "../Center/ChatArea/ChatSingle";
import ChatSessionAndFilename from "../../../interfaces/ChatSessionAndFilename";

interface DeleteDialogProps {
    ChatSessionAndFilename: ChatSessionAndFilename,
    children?: JSX.Element,
    onDelete(): void
}

export function DeleteDialog({ChatSessionAndFilename, children, onDelete}: DeleteDialogProps) {
    return (
        <div onClick={(e) => e.stopPropagation()}>
            <Dialog>
                {children}
                <DialogContent className="max-w-[50%] p-0 m-0 gap-0">
                    <DialogHeader className="px-[15px] pt-[15px] pb-[10px] border-border-gray border-b-[1px] h-fit">
                        <DialogTitle>Delete Item</DialogTitle>
                        <DialogDescription>Are you sure you want to delete this item?</DialogDescription>
                    </DialogHeader>
                    <div className="h-[calc(100vh/2)] overflow-auto">
                        <ExtraInformationDialog
                            filename={ChatSessionAndFilename.filename}
                            modelName={ChatSessionAndFilename.chatSession.modelName}
                            inputTokens={ChatSessionAndFilename.chatSession.inputTokens}
                            outputTokens={ChatSessionAndFilename.chatSession.outputTokens}
                        />
                        <div>
                            {ChatSessionAndFilename.chatSession.chatHistory!.map((item, index) => (
                                <ChatSingle index={index} type={item.type}>
                                    {item.type === "model" ? item.response[0]!.toString() : item.text.toString()}
                                </ChatSingle>
                            ))}
                        </div>
                    </div>
                    <DialogFooter className="border-border-gray border-t-[1px] px-[15px] py-[10px]">
                        <DialogClose asChild>
                            <Button className="w-[100px]" variant="transparent_full">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button className="w-[100px]" variant="negative" onClick={() => onDelete()}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

interface ExtraInformationDialogProps {
    filename: string,
    modelName: string,
    inputTokens: number,
    outputTokens: number
}
function ExtraInformationDialog({filename, modelName, inputTokens, outputTokens}: ExtraInformationDialogProps) {
    return (
        <div className="w-[40%] absolute top-[0%] left-[-45%] bg-background rounded-[10px] h-fit">
            <div className="font-semibold text-lg border-b-[1px] border-b-border-gray px-[15px] pt-[15px] pb-[10px]">File Information:</div>
            <div className="flex flex-col gap-[10px] px-[15px] pt-[10px] pb-[15px] break-words">
                {[
                    ["Filename:", filename],
                    ["Model Name:", modelName],
                    ["Input Tokens:", inputTokens],
                    ["Output Tokens:", outputTokens]
                ].map((value) => (
                    <div className="flex flex-col leading-tight">
                        <span className="font-semibold">{value[0]}</span> {value[1]}
                    </div>
                ))}
            </div>
        </div>
    );
}
