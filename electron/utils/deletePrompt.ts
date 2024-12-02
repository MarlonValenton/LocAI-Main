import fs from "node:fs/promises";
import path from "node:path";
import {IpcMainInvokeEvent} from "electron";
import {configFile} from "..";

export async function deletePrompt(event: IpcMainInvokeEvent, filename: string): Promise<void> {
    fs.unlink(path.join(configFile.promptsDirectory, filename));
}
