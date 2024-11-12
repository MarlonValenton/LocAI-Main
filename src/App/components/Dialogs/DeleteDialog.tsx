import {DialogClose} from "@radix-ui/react-dialog";
import {ChatHistoryItem} from "node-llama-cpp";
import {Button} from "../../shadcncomponents//Button";
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "../../shadcncomponents/dialog";
import ChatSingle from "../Center/ChatArea/ChatSingle";

interface DeleteDialogProps {
    chatHistory: ChatHistoryItem[],
    children?: JSX.Element,
    onDelete(): void
}

export function DeleteDialog({chatHistory, children, onDelete}: DeleteDialogProps) {
    return (
        <div onClick={(e) => e.stopPropagation()}>
            <Dialog>
                {children}
                <DialogContent className="max-w-[50%] p-0 m-0">
                    <DialogHeader className="px-[15px] pt-[15px] pb-[10px] border-border-gray border-b-[1px] h-fit">
                        <DialogTitle>Delete Item</DialogTitle>
                        <DialogDescription>Are you sure you want to delete this item?</DialogDescription>
                    </DialogHeader>
                    <div className="h-[calc(100vh/2)] overflow-auto">
                        {chatHistory.map((item, index) => (
                            <ChatSingle index={index} type={item.type}>
                                {item.type === "model" ? item.response[0]!.toString() : item.text.toString()}
                            </ChatSingle>
                        ))}
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
