import {useState} from "react";
import {DialogFooter, DialogHeader, DialogTitle, DialogClose} from "../../shadcncomponents/dialog";
import {Button} from "../../shadcncomponents/Button";
import PromptForm from "./PromptForm";

interface CreatePromptDialogProps {
    createPromptFile(name: string, description: string, prompt: string): void
}
export default function CreatePromptDialog({createPromptFile}: CreatePromptDialogProps): JSX.Element {
    const [name, setName] = useState<string>("New prompt");
    const [description, setDescription] = useState<string>("");
    const [prompt, setPrompt] = useState<string>("");

    return (
        <>
            <DialogHeader className="px-[15px] pt-[15px] pb-[15px] border-border-gray border-b-[1px] h-fit">
                <DialogTitle>Create Prompt</DialogTitle>
            </DialogHeader>
            <PromptForm
                name={name}
                description={description}
                prompt={prompt}
                setName={setName}
                setDescription={setDescription}
                setPrompt={setPrompt}
            />
            <DialogFooter className="border-border-gray border-t-[1px] px-[15px] py-[10px]">
                <DialogClose asChild>
                    <Button variant="transparent_full" className="w-[100px]">
                        Cancel
                    </Button>
                </DialogClose>
                <DialogClose asChild>
                    <Button
                        className="w-[100px]"
                        onClick={() => {
                            createPromptFile(name, description, prompt);
                        }}
                        disabled={name === "" || name === undefined || prompt === "" || prompt === undefined}
                    >
                        Save
                    </Button>
                </DialogClose>
            </DialogFooter>
        </>
    );
}
