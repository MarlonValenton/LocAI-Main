import fs from "node:fs/promises";
import path from "node:path";
import {readFileSync} from "node:fs";
import {IpcMainInvokeEvent} from "electron";
import LocaiConfig from "../../src/interfaces/locaiconfig";

const configFile: LocaiConfig = JSON.parse(readFileSync("./locaiconfig.json", {encoding: "utf-8"}));

export async function chatSessionExists(event: IpcMainInvokeEvent, filename: string): Promise<boolean> {
    return fs
        .access(path.join(configFile.chatSessionsDirectory, filename))
        .then(() => true)
        .catch(() => false);
}
