import fs from "node:fs/promises";
import path from "node:path";
import {readFileSync} from "node:fs";
import {IpcMainInvokeEvent} from "electron";
import LocaiConfig from "../../src/interfaces/locaiconfig";

const configFile: LocaiConfig = JSON.parse(readFileSync("./locaiconfig.json", {encoding: "utf-8"}));

export async function deletePrompt(event: IpcMainInvokeEvent, filename: string): Promise<void> {
    fs.unlink(path.join(configFile.promptsDirectory, filename));
}
