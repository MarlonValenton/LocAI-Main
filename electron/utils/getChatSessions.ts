import {readdirSync, readFileSync} from "fs";
import path from "path";
import ChatSessionAndFilename from "../../src/interfaces/ChatSessionAndFilename";
import LocaiConfig from "../../src/interfaces/locaiconfig";

const configFile: LocaiConfig = JSON.parse(readFileSync("./locaiconfig.json", "utf-8"));

export function getChatSessions(): ChatSessionAndFilename[] {
    const chatSessionsPath = configFile.chatSessionsDirectory;
    const chatSessionsAndFilenames: ChatSessionAndFilename[] = [];

    readdirSync(chatSessionsPath).forEach((file) => {
        if (path.extname(file).toLowerCase() === ".json") {
            chatSessionsAndFilenames.push({
                filename: file,
                path: path.resolve(configFile.chatSessionsDirectory),
                chatSession: JSON.parse(readFileSync(path.join(chatSessionsPath, file), "utf-8"))
            });
        }
    });

    return chatSessionsAndFilenames;
}
