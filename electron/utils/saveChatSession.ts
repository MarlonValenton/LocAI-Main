import fs from "node:fs/promises";
import path from "node:path";
import {readFileSync} from "node:fs";
import {IpcMainInvokeEvent} from "electron";
import ChatSessionFile from "../../src/interfaces/ChatSession";

const configFile = JSON.parse(readFileSync("./locaiconfig.json", {encoding: "utf-8"}));

export async function saveChatSession(event: IpcMainInvokeEvent, filename: string, chatSessionFile: ChatSessionFile): Promise<void> {
    await fs.mkdir(configFile.chatSessionDirectory, {recursive: true});

    await fs.writeFile(path.join(configFile.chatSessionDirectory, filename), JSON.stringify(chatSessionFile, null, 2), "utf-8");
}
