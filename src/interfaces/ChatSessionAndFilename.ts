import ChatSession from "./ChatSession";

interface ChatSessionAndFilename {
    filename: string,
    path: string,
    chatSession: ChatSession
}

interface ChatSessionAndApi {
    id: string,
    chatSession: ChatSession
}

export type {ChatSessionAndFilename, ChatSessionAndApi};
