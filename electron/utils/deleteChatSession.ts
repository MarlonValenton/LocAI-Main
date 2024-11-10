import fs from "node:fs/promises";
import path from "node:path";
import {readFileSync} from "node:fs";
import {IpcMainInvokeEvent} from "electron";

const configFile = JSON.parse(readFileSync("./locaiconfig.json", {encoding: "utf-8"}));

export async function deleteChatSession(event: IpcMainInvokeEvent, filename: string): Promise<void> {
    fs.unlink(path.join(configFile.chatSessionDirectory, filename));
}
