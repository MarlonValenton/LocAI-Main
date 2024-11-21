import fs from "node:fs/promises";
import path from "node:path";
import {readFileSync} from "node:fs";
import {IpcMainInvokeEvent} from "electron";
import LocaiConfig from "../../src/interfaces/locaiconfig";
import Prompt from "../../src/interfaces/Prompt";
import PromptAndFilename from "../../src/interfaces/PromptAndFilename";

const configFile: LocaiConfig = JSON.parse(readFileSync("./locaiconfig.json", {encoding: "utf-8"}));

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
