import {DialogClose} from "@radix-ui/react-dialog";
import {useState} from "react";
import {Button} from "../../shadcncomponents//Button";
import {DialogContent, DialogFooter, DialogHeader, DialogTitle} from "../../shadcncomponents/dialog";
import {ChatSessionValues} from "../../../interfaces/EditItemValues";
import ChatSessionAndFilename from "../../../interfaces/ChatSessionAndFilename";
import ExtraInformationDialog from "./ExtraInformationDialog";
import ChatSessionForm from "./ChatSessionForm";

interface EditPromptDialogProps {
    index: number,
    chatSessionAndFilename: ChatSessionAndFilename,
    editItem(index: number, values: ChatSessionValues): void
}

export function EditChatSessionDialog({index, chatSessionAndFilename, editItem}: EditPromptDialogProps) {
    const [name, setName] = useState<string>(chatSessionAndFilename.chatSession.name);
    const [systemPrompt, setSystemPRompt] = useState<string>(chatSessionAndFilename.chatSession.systemPrompt);
    const [contextSize, setContextSize] = useState<number | "auto">(chatSessionAndFilename.chatSession.contextSize);
    const [modelLevelFlashAttention, setModelLevelFlashAttention] = useState<boolean>(
        chatSessionAndFilename.chatSession.modelLevelFlashAttention
    );
    const [contextLevelFlashAttention, setContextLevelFlashAttention] = useState<boolean>(
        chatSessionAndFilename.chatSession.contextLevelFlashAttention
    );

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <DialogContent className="max-w-[50%] p-0 m-0 gap-0">
                <DialogHeader className="px-[15px] pt-[15px] pb-[10px] border-border-gray border-b-[1px] h-fit select-none">
                    <DialogTitle>Edit Chat Session</DialogTitle>
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
                <ChatSessionForm
                    name={name}
                    systemPrompt={systemPrompt}
                    contextSize={contextSize}
                    modelLevelFlashAttention={modelLevelFlashAttention}
                    contextLevelFlashAttention={contextLevelFlashAttention}
                    setName={setName}
                    setSystemPrompt={setSystemPRompt}
                    setContextSize={setContextSize}
                    setModelLevelFlashAttention={setModelLevelFlashAttention}
                    setContextLevelFlashAttention={setContextLevelFlashAttention}
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
                            onClick={() =>
                                editItem(index, {
                                    name: name,
                                    systemPrompt: systemPrompt,
                                    contextSize: contextSize,
                                    modelLevelFlashAttention: modelLevelFlashAttention,
                                    contextLevelFlashAttention: contextLevelFlashAttention
                                })
                            }
                            // disabled={name === "" || nameValue === undefined || promptValue === "" || promptValue === undefined}
                        >
                            Save
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </div>
    );
}
