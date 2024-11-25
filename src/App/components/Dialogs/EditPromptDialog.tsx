import {DialogClose} from "@radix-ui/react-dialog";
import {useState} from "react";
import {Button} from "../../shadcncomponents//Button";
import {DialogContent, DialogFooter, DialogHeader, DialogTitle} from "../../shadcncomponents/dialog";
import PromptAndFilename from "../../../interfaces/PromptAndFilename";
import {PromptValues} from "../../../interfaces/EditItemValues";
import PromptForm from "./PromptForm";
import ExtraInformationDialog from "./ExtraInformationDialog";

interface EditDialogProps {
    index: number,
    prompt: PromptAndFilename,
    editItem(index: number, values: PromptValues): void
}

export function EditPromptDialog({index, prompt, editItem}: EditDialogProps) {
    const [nameValue, setNameValue] = useState<string>(prompt.prompt.name);
    const [descriptionValue, setDescriptionValue] = useState<string>(prompt.prompt.description);
    const [promptValue, setPromptValue] = useState<string>(prompt.prompt.prompt);

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <DialogContent className="max-w-[40%] p-0 m-0 gap-0">
                <DialogHeader className="px-[15px] pt-[15px] pb-[10px] border-border-gray border-b-[1px] h-fit select-none">
                    <DialogTitle>Edit Prompt</DialogTitle>
                </DialogHeader>
                <ExtraInformationDialog
                    items={[
                        ["Filename", prompt.filename],
                        ["Path", prompt.path]
                    ]}
                    baseClassName="w-[300px]"
                />
                <PromptForm
                    name={nameValue}
                    description={descriptionValue}
                    prompt={promptValue}
                    setName={setNameValue}
                    setDescription={setDescriptionValue}
                    setPrompt={setPromptValue}
                />
                <DialogFooter className="border-border-gray border-t-[1px] px-[15px] py-[10px]">
                    <DialogClose asChild>
                        <Button className="w-[100px]" variant="transparent_full">
                            Cancel
                        </Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button
                            className="w-[100px]"
                            onClick={() => editItem(index, {name: nameValue, description: descriptionValue, prompt: promptValue})}
                            disabled={nameValue === "" || nameValue === undefined || promptValue === "" || promptValue === undefined}
                        >
                            Save
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </div>
    );
}
