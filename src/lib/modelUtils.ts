import ChatSession from "../interfaces/ChatSession";
import ChatSessionAndFilename from "../interfaces/ChatSessionAndFilename";
import ModelResponseSettings from "../interfaces/ModelResponseSettings";
import {electronLlmRpc} from "../rpc/llmRpc";
import {saveChatSession} from "./chatSessionUtils";

async function loadModelAndSession(
    setloadMessage: React.Dispatch<React.SetStateAction<string | undefined>>,
    setSelectedChatSession: React.Dispatch<React.SetStateAction<ChatSession | undefined>>,
    setChatSessionsAndFilenames: React.Dispatch<React.SetStateAction<ChatSessionAndFilename[]>>,
    setChatSessionSelectedIndex: React.Dispatch<React.SetStateAction<number | undefined>>,
    modelResponseSettings: ModelResponseSettings
) {
    if (modelResponseSettings.modelName) {
        console.log(`Loading ${modelResponseSettings.modelName}`);
        setloadMessage("Loading model");

        const updatedChatSessionsAndFilenames = await window.utils.getChatSessions();
        console.log("Updating chatSessionsAndFilenames first");

        const newChatSessionAndFilename = await window.utils.createChatSessionFile(
            modelResponseSettings.modelName!,
            modelResponseSettings.responseSettings,
            modelResponseSettings.systemPrompt,
            modelResponseSettings.modelLevelFlashAttention,
            modelResponseSettings.contextLevelFlashAttention,
            modelResponseSettings.contextSize
        );
        console.log(`Created new chat session file: ${newChatSessionAndFilename.filename}`);

        setSelectedChatSession(newChatSessionAndFilename.chatSession);
        console.log("newChatSession set");

        setChatSessionsAndFilenames([...updatedChatSessionsAndFilenames, newChatSessionAndFilename]);
        console.log("Added newChatSession to existing chatSessions");

        setChatSessionSelectedIndex(updatedChatSessionsAndFilenames.length);
        console.log("Selected chat session index");

        await electronLlmRpc.loadModelAndSession(modelResponseSettings);
        await saveChatSession(newChatSessionAndFilename);
    }
}

export {loadModelAndSession};
