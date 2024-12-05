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

type ServiceOptionOffline = {
    type: "offline",
    modelName: string,
    modelPath: string,
    modelLevelFlashAttention: boolean,
    contextLevelFlashAttention: boolean,
    contextSize: number | "auto",
    systemPrompt: string,
    temperature: number,
    maxTokens: number,
    minP: number,
    topP: number,
    topK: number,
    seed: number
};

type ServiceOptionOnline = {
    type: "online",
    role: string,
    model: string
    temperature: number,
    max_tokens: number,
    top_P: number,
    frequency_penalty: number,
    presence_penalty: number,
    seed: number
    // other options that the api provides (temperature, etc..)
};

interface ChatSession {
    name: string,
    serviceType: ServiceOptionOffline | ServiceOptionOnline,
    inputTokens: number,
    outputTokens: number,
    type: string, // user / system / model
    message: string
}
