import fs from "node:fs/promises";
import path from "node:path";
import {IpcMainInvokeEvent} from "electron";
import {configFile} from "..";

export async function chatSessionExists(event: IpcMainInvokeEvent, filename: string): Promise<boolean> {
    return fs
        .access(path.join(configFile.chatSessionsDirectory, filename))
        .then(() => true)
        .catch(() => false);
}
