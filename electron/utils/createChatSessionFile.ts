import fs from "node:fs/promises";
import path from "node:path";
import {IpcMainInvokeEvent} from "electron";
import ChatSessionFile from "../../src/interfaces/ChatSession";
import ChatSessionAndFilename from "../../src/interfaces/ChatSessionAndFilename";
import ResponseSettings from "../../src/interfaces/ResponseSettings";
import {configFile} from "..";

export async function createChatSessionFile(
    event: IpcMainInvokeEvent,
    modelPath: string,
    responseSettings: ResponseSettings,
    systemPrompt: string,
    modelLevelFlashAttention: boolean,
    contextLevelFlashAttention: boolean,
    contextSize: number
): Promise<ChatSessionAndFilename> {
    const chatSession: ChatSessionFile = {
        name: "New chat session",
        modelPath: path.resolve(modelPath),
        modelName: path.basename(modelPath),
        inputTokens: 0,
        outputTokens: 0,
        systemPrompt: systemPrompt,
        initialResponseSettings: responseSettings,
        modelLevelFlashAttention: modelLevelFlashAttention,
        contextLevelFlashAttention: contextLevelFlashAttention,
        contextSize: contextSize,
        chatHistory: [
            {
                type: "system",
                text: systemPrompt!
            }
        ],
        responseSettingsHistory: []
    };

    await fs.mkdir(configFile.chatSessionsDirectory, {recursive: true});

    const saveDate = new Date();
    const filename = `chat_session_${saveDate.toISOString().split("T")[0]?.replaceAll("-", "_")}_${saveDate.getTime().toString()}.json`;

    await fs.writeFile(path.join(configFile.chatSessionsDirectory, filename), JSON.stringify(chatSession, null, 2), "utf-8");

    return {filename: filename, path: path.resolve(configFile.chatSessionsDirectory), chatSession: chatSession};
}
