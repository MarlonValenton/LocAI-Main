import {DialogClose} from "@radix-ui/react-dialog";
import {Button} from "../../shadcncomponents//Button";
import {DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "../../shadcncomponents/dialog";
import PromptAndFilename from "../../../interfaces/PromptAndFilename";
import PromptForm from "./PromptForm";
import ExtraInformationDialog from "./ExtraInformationDialog";

interface DeleteDialogProps {
    prompt: PromptAndFilename,
    deleteItem(): void
}

export function DeletePromptDialog({prompt, deleteItem}: DeleteDialogProps) {
    return (
        <div onClick={(e) => e.stopPropagation()}>
            <DialogContent className="max-w-[40%] p-0 m-0 gap-0">
                <DialogHeader className="px-[15px] pt-[15px] pb-[10px] border-border-gray border-b-[1px] h-fit">
                    <DialogTitle>Delete Prompt</DialogTitle>
                    <DialogDescription>Are you sure you want to delete this prompt?</DialogDescription>
                </DialogHeader>
                <ExtraInformationDialog
                    items={[
                        ["Filename", prompt.filename],
                        ["Path", prompt.path]
                    ]}
                    baseClassName="w-[300px]"
                />
                <PromptForm name={prompt.prompt.name} description={prompt.prompt.description} prompt={prompt.prompt.prompt} />
                <DialogFooter className="border-border-gray border-t-[1px] px-[15px] py-[10px]">
                    <DialogClose asChild>
                        <Button className="w-[100px]" variant="transparent_full">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button className="w-[100px]" variant="negative" onClick={() => deleteItem()}>
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </div>
    );
}
