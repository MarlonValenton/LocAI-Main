import fs from "node:fs/promises";
import path from "node:path";
import {IpcMainInvokeEvent} from "electron";
import Prompt from "../../src/interfaces/Prompt";
import {configFile} from "..";

export async function savePrompt(event: IpcMainInvokeEvent, filename: string, prompt: Prompt): Promise<void> {
    await fs.mkdir(configFile.promptsDirectory, {recursive: true});

    await fs.writeFile(path.join(configFile.promptsDirectory, filename), JSON.stringify(prompt, null, 2), "utf-8");
}
