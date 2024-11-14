import fs from "node:fs/promises";
import path from "node:path";
import {readFileSync} from "node:fs";
import {IpcMainInvokeEvent} from "electron";
import ChatSessionFile from "../../src/interfaces/ChatSession";
import ChatSessionAndFilename from "../../src/interfaces/ChatSessionAndFilename";

const configFile = JSON.parse(readFileSync("./locaiconfig.json", {encoding: "utf-8"}));

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
                text: "You are a helpful, respectful and honest assistant. Always answer as helpfully as possible.\nIf a question does not make any sense, or is not factually coherent, explain why instead of answering something incorrectly. If you don't know the answer to a question, don't share false information."
            }
        ]
    };

    await fs.mkdir(configFile.chatSessionDirectory, {recursive: true});

    const saveDate = new Date();
    const filename = `chat_session_${saveDate.toISOString().split("T")[0]?.replaceAll("-", "_")}_${saveDate.getTime().toString()}.json`;

    await fs.writeFile(path.join(configFile.chatSessionDirectory, filename), JSON.stringify(chatSession, null, 2), "utf-8");

    return {filename: filename, path: configFile.chatSessionDirectory, chatSession: chatSession};
}
