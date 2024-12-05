import ChatSession from "../interfaces/ChatSession";
import ChatSessionAndFilename from "../interfaces/ChatSessionAndFilename";
import ModelResponseSettings from "../interfaces/ModelResponseSettings";
import {electronLlmRpc} from "../rpc/llmRpc";
import {callGroqApi} from "./apiUtils";
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

        if (modelResponseSettings.isApiModel) {
            // Handle API model logic
            console.log("Detected API model. Calling Groq API...");
            try {
                // Use `callGroqApi` to interact with the API
                const response = await callGroqApi(
                    [{role: "user", content: "messages"}], // Example prompt
                    modelResponseSettings.modelName as "" // Adjust the type as needed
                );
                console.log("Model loaded from API successfully:", response);

                // Update session states (use placeholders or basic session data)
                const newChatSession: ChatSession = {
                    id: Date.now().toString(),
                    name: `Session with ${modelResponseSettings.modelName}`,
                    messages: []
                };
                setSelectedChatSession(newChatSession);

                // Add the session to the session list
                setChatSessionsAndFilenames((prev) => [
                    ...prev,
                    {chatSession: newChatSession, filename: `api-session-${Date.now()}.json`}
                ]);
                setChatSessionSelectedIndex((prev) => (prev ? prev + 1 : 0));

                setloadMessage(undefined); // Clear loading message
            } catch (error) {
                console.error("Error loading API model:", error);
                setloadMessage("Failed to load API model. Check console for details.");
            }
        } else {

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
}

export {loadModelAndSession};
