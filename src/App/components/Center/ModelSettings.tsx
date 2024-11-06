/// <reference types="vite-plugin-svgr/client" />

import {useState} from "react";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "../../shadcncomponents/select";
import {Button} from "../../shadcncomponents/Button";
import {Label} from "../../shadcncomponents/Label";
import Loader from "../../../icons/loader-2.svg?react";

interface ModelSettingsProps {
    setSelectedModel: React.Dispatch<React.SetStateAction<string>>,
    selectedModel: string,
    loading: boolean,
    loadModelAndSession(): Promise<void>
}

function ModelSettings({setSelectedModel, selectedModel, loading, loadModelAndSession}: ModelSettingsProps): JSX.Element {
    const [modelFiles, setModelFiles] = useState<string[]>([]);

    if (modelFiles.length == 0) {
        window.utils.getModelFiles().then((value) => setModelFiles(value));
    }

    return (
        <div className="flex flex-col flex-grow justify-center items-center">
            <div className="flex flex-col w-[650px] min-h-[400px] max-h-[448px] border-[1px] border-border-gray rounded-[5px] px-[20px] py-[25px] text-[20px] [&>*:not(:last-child)]:mb-3">
                <div className="h-full">
                    <Label className="text-[15px]">Select a model: </Label>
                    <Select onValueChange={setSelectedModel}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a model" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {modelFiles.map((file) => {
                                    return (
                                        <SelectItem value={file} key={file.replaceAll(" ", "_").toLowerCase()}>
                                            {file.split("\\").pop()}
                                        </SelectItem>
                                    );
                                })}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {loading ? (
                    <Button disabled>
                        <Loader className="animate-spin" />
                    </Button>
                ) : (
                    <Button onClick={() => loadModelAndSession()} disabled={selectedModel === ""}>
                        Load Model
                    </Button>
                )}
            </div>
        </div>
    );
}

export default ModelSettings;
