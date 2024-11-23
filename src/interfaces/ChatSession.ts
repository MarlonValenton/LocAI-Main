import {ChatHistoryItem} from "node-llama-cpp";
import ResponseSettings from "./ResponseSettings";

interface ChatSession {
    name: string,
    modelPath: string,
    modelName: string,
    inputTokens: number,
    outputTokens: number,
    systemPrompt: string,
    initialResponseSettings: ResponseSettings,
    modelLevelFlashAttention: boolean,
    contextLevelFlashAttention: boolean,
    contextSize: number | "auto",
    chatHistory?: ChatHistoryItem[],
    responseSettingsHistory?: ResponseSettings[]
}

export default ChatSession;
