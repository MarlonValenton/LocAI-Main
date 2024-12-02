import fs from "node:fs/promises";
import path from "node:path";
import {IpcMainInvokeEvent} from "electron";
import Prompt from "../../src/interfaces/Prompt";
import PromptAndFilename from "../../src/interfaces/PromptAndFilename";
import {configFile} from "..";

export async function createPromptFile(
    event: IpcMainInvokeEvent,
    name: string,
    description: string,
    prompt: string
): Promise<PromptAndFilename> {
    const promptFile: Prompt = {
        name: name,
        description: description,
        prompt: prompt
    };

    await fs.mkdir(configFile.promptsDirectory, {recursive: true});

    const saveDate = new Date();
    const filename = `prompt_${saveDate.toISOString().split("T")[0]?.replaceAll("-", "_")}_${saveDate.getTime().toString()}.json`;

    await fs.writeFile(path.join(configFile.promptsDirectory, filename), JSON.stringify(promptFile, null, 2), "utf-8");

    return {filename: filename, path: path.resolve(configFile.promptsDirectory), prompt: promptFile};
}
