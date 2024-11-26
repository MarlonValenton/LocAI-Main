import ChatSession from "../interfaces/ChatSession";
import ChatSessionAndFilename from "../interfaces/ChatSessionAndFilename";
import {ChatSessionValues, EditItemValues} from "../interfaces/EditItemValues";
import ModelResponseSettings from "../interfaces/ModelResponseSettings";
import {electronLlmRpc} from "../rpc/llmRpc";
import loadConfigSettings from "./loadConfigSettings";
import {clearErrors, unloadObjects} from "./miscUtils";

async function saveChatSession(chatSessionAndFilename: ChatSessionAndFilename) {
    console.log("Saving chat session");
    console.log(`Filename: ${chatSessionAndFilename.filename}`);
    console.log({chatSessionAndFilename});

    await window.utils.saveChatSession(chatSessionAndFilename.filename, chatSessionAndFilename.chatSession);
}

async function renameChatSession(
    chatSessionsAndFilenames: ChatSessionAndFilename[],
    index: number,
    values: EditItemValues,
    setChatSessionsAndFilenames: React.Dispatch<React.SetStateAction<ChatSessionAndFilename[]>>
) {
    console.log("Renaming chat session");

    try {
        const newChatSessionsAndFilenames = await Promise.all(
            chatSessionsAndFilenames.map(async (chatSessionAndFilename, i): Promise<ChatSessionAndFilename> => {
                if (i === index) {
                    console.log(`Updating chat session of index ${index}`);

                    const newChatSessionAndFilename: ChatSessionAndFilename = {
                        ...chatSessionAndFilename,
                        chatSession: {
                            ...chatSessionAndFilename.chatSession,
                            name: values.name ? values.name : chatSessionAndFilename.chatSession.name
                        }
                    };
                    console.log({newChatSessionAndFilename});

                    if (await window.utils.chatSessionExists(newChatSessionAndFilename.filename)) {
                        saveChatSession(newChatSessionAndFilename);
                    } else throw Error("File does not exist");

                    return newChatSessionAndFilename;
                } else return chatSessionAndFilename;
            })
        );
        setChatSessionsAndFilenames(newChatSessionsAndFilenames);
    } catch (err) {
        updateChatSessionsFromFileSystem(setChatSessionsAndFilenames);
    }
}

async function updateChatSessionsFromFileSystem(
    setChatSessionsAndFilenames: React.Dispatch<React.SetStateAction<ChatSessionAndFilename[]>>
) {
    console.log("Updating ChatSession list");
    setChatSessionsAndFilenames(await window.utils.getChatSessions());
}

async function loadChatSession(
    setloadMessage: React.Dispatch<React.SetStateAction<string | undefined>>,
    setSelectedChatSession: React.Dispatch<React.SetStateAction<ChatSession | undefined>>,
    setisSystemPrompt: React.Dispatch<React.SetStateAction<boolean>>,
    setModelResponseSettings: React.Dispatch<React.SetStateAction<ModelResponseSettings>>,
    setChatSessionsAndFilenames: React.Dispatch<React.SetStateAction<ChatSessionAndFilename[]>>,
    chatSessionsAndFilenames: ChatSessionAndFilename[],
    index: number,
    selectedChatSession?: ChatSession
) {
    console.log("Loading chat session");
    setloadMessage("Loading chat session");

    await clearErrors();

    if (chatSessionsAndFilenames) {
        const chatSession = chatSessionsAndFilenames[index]?.chatSession;

        setSelectedChatSession(chatSession);
        console.log("Selected chat session set");

        console.log(`${selectedChatSession?.modelName} === ${chatSession?.modelName}`);

        await electronLlmRpc.unloadChatSession();
        console.log("Unloading chat session");

        if (chatSession?.chatHistory) {
            if (chatSession.chatHistory.length) {
                if (chatSession.chatHistory[0]?.type === "system") {
                    setisSystemPrompt(true);
                } else setisSystemPrompt(false);
            } else setisSystemPrompt(false);
        } else setisSystemPrompt(false);

        if (selectedChatSession?.modelName === chatSession?.modelName) {
            console.log("Selected chat session is the same as the old one, loading Chat History immediately");

            // await electronLlmRpc.loadModel(chatSession!.modelPath);
            console.log("Creating Context");
            await electronLlmRpc.createContext(chatSession!.contextSize, chatSession!.contextLevelFlashAttention);

            console.log("Creating Context");
            await electronLlmRpc.createContextSequence();

            console.log("Loading Chat History");
            await electronLlmRpc.loadChatHistory(
                chatSession!.chatHistory!,
                chatSession!.inputTokens,
                chatSession!.outputTokens,
                chatSession!.systemPrompt
            );
        } else {
            console.log("Loading Model");
            await electronLlmRpc.loadModel(chatSession!.modelPath, chatSession!.modelLevelFlashAttention);

            console.log("Creating Context");
            await electronLlmRpc.createContext(chatSession!.contextSize, chatSession!.contextLevelFlashAttention);

            console.log("Creating Context Sequence");
            await electronLlmRpc.createContextSequence();

            console.log("Loading Chat History");
            await electronLlmRpc.loadChatHistory(
                chatSession!.chatHistory!,
                chatSession!.inputTokens,
                chatSession!.outputTokens,
                chatSession!.systemPrompt
            );
        }

        // setSelectedModel(chatSession!.modelPath);
        setModelResponseSettings({
            modelName: chatSession!.modelPath,
            systemPrompt: chatSession!.systemPrompt,
            modelLevelFlashAttention: chatSession!.modelLevelFlashAttention,
            contextLevelFlashAttention: chatSession!.contextLevelFlashAttention,
            contextSize: chatSession!.contextSize,
            responseSettings: chatSession!.responseSettingsHistory
                ? chatSession!.responseSettingsHistory.length
                    ? chatSession!.responseSettingsHistory.slice(-1)[0]!
                    : chatSession!.initialResponseSettings
                : chatSession!.initialResponseSettings
        });
        console.log("Selected model set");
    } else console.log("There are no chat sessions available");
    updateChatSessionsFromFileSystem(setChatSessionsAndFilenames);
}

async function editChatSession(
    setChatSessionsAndFilenames: React.Dispatch<React.SetStateAction<ChatSessionAndFilename[]>>,
    chatSessionsAndFilenames: ChatSessionAndFilename[],
    index: number,
    values: ChatSessionValues
) {
    console.log("Renaming chat session");
    try {
        const newChatSessionsAndFilenames = await Promise.all(
            chatSessionsAndFilenames.map(async (chatSessionAndFilename, i): Promise<ChatSessionAndFilename> => {
                if (i === index) {
                    console.log(`Updating chat session of index ${index}`);

                    const newChatSessionAndFilename: ChatSessionAndFilename = {
                        ...chatSessionAndFilename,
                        chatSession: {
                            ...chatSessionAndFilename.chatSession,
                            name: values.name,
                            systemPrompt: values.systemPrompt,
                            contextSize: values.contextSize,
                            modelLevelFlashAttention: values.modelLevelFlashAttention,
                            contextLevelFlashAttention: values.contextLevelFlashAttention
                        }
                    };
                    console.log({newChatSessionAndFilename});

                    if (await window.utils.chatSessionExists(newChatSessionAndFilename.filename)) {
                        saveChatSession(newChatSessionAndFilename);
                    } else throw Error("File does not exist");

                    return newChatSessionAndFilename;
                } else return chatSessionAndFilename;
            })
        );
        setChatSessionsAndFilenames(newChatSessionsAndFilenames);
    } catch (err) {
        updateChatSessionsFromFileSystem(setChatSessionsAndFilenames);
    }
}

async function deleteChatSession(
    setIsShowSystemPrompt: React.Dispatch<React.SetStateAction<boolean>>,
    setisSystemPrompt: React.Dispatch<React.SetStateAction<boolean>>,
    setChatSessionsAndFilenames: React.Dispatch<React.SetStateAction<ChatSessionAndFilename[]>>,
    setChatSessionSelectedIndex: React.Dispatch<React.SetStateAction<number | undefined>>,
    setInputValue: (value: string) => void,
    setSelectedChatSession: React.Dispatch<React.SetStateAction<ChatSession | undefined>>,
    setModelResponseSettings: React.Dispatch<React.SetStateAction<ModelResponseSettings>>,
    chatSessionsAndFilenames: ChatSessionAndFilename[],
    index: number,
    chatSessionSelectedIndex?: number
) {
    console.log(`Deleting chat session index ${index}`);

    setIsShowSystemPrompt(false);
    console.log("Set isShowSystemPrompt to false");

    setisSystemPrompt(false);
    console.log("Set isSystemPrompt to false");

    try {
        const toDeleteChatSession = chatSessionsAndFilenames[index];
        window.utils.chatSessionExists(toDeleteChatSession!.filename).then((value) => {
            if (value === true) {
                window.utils.deleteChatSession(toDeleteChatSession!.filename);
            } else {
                throw Error("File does not exist");
            }
        });

        const newChatSessionsAndFilenames = chatSessionsAndFilenames.filter((chatSession, i) => i !== index);

        setChatSessionsAndFilenames(newChatSessionsAndFilenames);
        console.log("newChatSessionsAndFilenames set");

        if (chatSessionSelectedIndex === index) {
            setChatSessionSelectedIndex(undefined);
            console.log("set chatSessionSelectedIndex to undefined");

            setInputValue("");
            console.log("Cleared input");

            setSelectedChatSession(undefined);
            console.log("set selected chat session to undefined");

            loadConfigSettings(setModelResponseSettings);

            await unloadObjects();
        } else if (chatSessionSelectedIndex! >= index) {
            setChatSessionSelectedIndex((value) => (value ? value - 1 : value));
        }

        // setSelectedModel("");
        // console.log("selected model set to empty");

        // setSelectedChatSession(undefined);
        // console.log("selected chat session set to undefined");
    } catch (err) {
        updateChatSessionsFromFileSystem(setChatSessionsAndFilenames);
    }
}

export {saveChatSession, renameChatSession, updateChatSessionsFromFileSystem, loadChatSession, editChatSession, deleteChatSession};
