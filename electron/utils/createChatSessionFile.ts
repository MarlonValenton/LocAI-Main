import fs from "node:fs/promises";
import path from "node:path";
import {readFileSync} from "node:fs";
import {IpcMainInvokeEvent} from "electron";
import ChatSessionFile from "../../src/interfaces/ChatSession";
import ChatSessionAndFilename from "../../src/interfaces/ChatSessionAndFilename";
import LocaiConfig from "../../src/interfaces/locaiconfig";

const configFile: LocaiConfig = JSON.parse(readFileSync("./locaiconfig.json", {encoding: "utf-8"}));

export async function createChatSessionFile(event: IpcMainInvokeEvent, modelPath: string): Promise<ChatSessionAndFilename> {
    const chatSession: ChatSessionFile = {
        name: "New chat session",
        modelPath: modelPath,
        modelName: path.basename(modelPath),
        inputTokens: 0,
        outputTokens: 0,
        chatHistory: [
            {
                type: "system",
                text: configFile.defaultSystemPrompt
            }
        ]
    };

    await fs.mkdir(configFile.chatSessionDirectory, {recursive: true});

    const saveDate = new Date();
    const filename = `chat_session_${saveDate.toISOString().split("T")[0]?.replaceAll("-", "_")}_${saveDate.getTime().toString()}.json`;

    await fs.writeFile(path.join(configFile.chatSessionDirectory, filename), JSON.stringify(chatSession, null, 2), "utf-8");

    return {filename: filename, path: configFile.chatSessionDirectory, chatSession: chatSession};
}
