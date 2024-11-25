import {Input} from "../../shadcncomponents/Input";
import {Label} from "../../shadcncomponents/Label";
import {Textarea} from "../../shadcncomponents/textarea";

interface PromptFormProps {
    name: string,
    description: string,
    prompt: string,
    setName?: React.Dispatch<React.SetStateAction<string>>,
    setDescription?: React.Dispatch<React.SetStateAction<string>>,
    setPrompt?: React.Dispatch<React.SetStateAction<string>>
}

export default function PromptForm({name, description, prompt, setName, setDescription, setPrompt}: PromptFormProps) {
    return (
        <div className="flex flex-col gap-[15px] px-[15px] py-[15px]">
            <div className="flex flex-col gap-[10px]">
                <Label className="select-none">Name</Label>
                <Input
                    onChange={(e) => (setName ? setName(e.currentTarget.value) : null)}
                    value={name}
                    placeholder="Required"
                    readOnly={!setName ? true : false}
                />
            </div>
            <div className="flex flex-col gap-[10px]">
                <Label className="select-none">Description</Label>
                <Textarea
                    value={description}
                    onChange={(e) => (setDescription ? setDescription(e.currentTarget.value) : null)}
                    className="resize-none"
                    readOnly={!setDescription ? true : false}
                />
            </div>
            <div className="flex flex-col gap-[10px]">
                <Label className="select-none">Prompt</Label>
                <Textarea
                    className="min-h-[200px] resize-none"
                    onChange={(e) => {
                        setPrompt ? setPrompt(e.currentTarget.value) : null;
                    }}
                    placeholder="Required"
                    value={prompt}
                    readOnly={!setPrompt ? true : false}
                />
            </div>
        </div>
    );
}
