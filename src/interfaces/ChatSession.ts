import {ChatHistoryItem} from "node-llama-cpp";

interface ChatSession {
    name: string,
    modelPath: string,
    modelName: string,
    inputTokens: number,
    outputTokens: number,
    chatHistory?: ChatHistoryItem[]
}

export default ChatSession;
