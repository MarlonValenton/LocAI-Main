import fs from "node:fs/promises";
import path from "node:path";
import {IpcMainInvokeEvent} from "electron";
import ChatSessionFile from "../../src/interfaces/ChatSession";
import {configFile} from "..";

export async function saveChatSession(event: IpcMainInvokeEvent, filename: string, chatSessionFile: ChatSessionFile): Promise<void> {
    await fs.mkdir(configFile.chatSessionsDirectory, {recursive: true});

    await fs.writeFile(path.join(configFile.chatSessionsDirectory, filename), JSON.stringify(chatSessionFile, null, 2), "utf-8");
}
