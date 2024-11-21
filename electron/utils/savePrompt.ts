import fs from "node:fs/promises";
import path from "node:path";
import {readFileSync} from "node:fs";
import {IpcMainInvokeEvent} from "electron";
import LocaiConfig from "../../src/interfaces/locaiconfig";
import Prompt from "../../src/interfaces/Prompt";

const configFile: LocaiConfig = JSON.parse(readFileSync("./locaiconfig.json", {encoding: "utf-8"}));

export async function savePrompt(event: IpcMainInvokeEvent, filename: string, prompt: Prompt): Promise<void> {
    await fs.mkdir(configFile.promptsDirectory, {recursive: true});

    await fs.writeFile(path.join(configFile.promptsDirectory, filename), JSON.stringify(prompt, null, 2), "utf-8");
}
