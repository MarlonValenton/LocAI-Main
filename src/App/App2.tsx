/// <reference types="vite-plugin-svgr/client" />

import {useCallback, useEffect, useRef, useState} from "react";
import Trash from "../icons/trash.svg?react";
import FileExport from "../icons/file-export.svg?react";
import Settings from "../icons/settings.svg?react";
import ChatSession from "../interfaces/ChatSession";
import {useExternalState} from "../hooks/useExternalState";
import {llmState} from "../state/llmState";
import {electronLlmRpc} from "../rpc/llmRpc";
import ChatSessionAndFilename from "../interfaces/ChatSessionAndFilename";
import {ExportDialogType} from "../interfaces/dialog";
import LocaiConfig from "../interfaces/locaiconfig";
import Center from "./components/Center/Center";
import Sidebar from "./components/Sidebar/Sidebar";
import SideBarButton from "./components/Sidebar/SidebarButton";
import SidebarButtonGroup from "./components/Sidebar/SidebarButtonsGroup";
import {Button} from "./shadcncomponents/Button";

function App2(): JSX.Element {
    const [isDarkMode, setDarkMode] = useState(false);
    const [chatSessionsAndFilenames, setChatSessionsAndFilenames] = useState<ChatSessionAndFilename[]>([]);
    const [selectedChatSession, setSelectedChatSession] = useState<ChatSession>();
    const [selectedModel, setSelectedModel] = useState("");
    const [loadMessage, setloadMessage] = useState<string>();
    const [systemPrompt, setSystemPrompt] = useState<string>("");
    const state = useExternalState(llmState);
    const {generatingResult} = state.chatSession;

    useEffect(() => {
        console.log("Getting chat sessions from file system");
        getChatSessions().then((value) => setChatSessionsAndFilenames(value));

        console.log("Getting default system prompt");
        window.utils.getConfig().then((value: LocaiConfig) => setSystemPrompt(value.defaultSystemPrompt));
    }, []);

    useEffect(() => {
        if (!generatingResult) {
            const newChatSessionsAndFilenames: ChatSessionAndFilename[] = chatSessionsAndFilenames.map((chatSessionAndFilename) => {
                if (JSON.stringify(chatSessionAndFilename.chatSession) === JSON.stringify(selectedChatSession)) {
                    console.log("Updating selected chat session");

                    const newChatSessionAndFilename: ChatSessionAndFilename = {
                        ...chatSessionAndFilename,
                        chatSession: {
                            ...chatSessionAndFilename.chatSession,
                            inputTokens: state.chatSession.usedInputTokens!,
                            outputTokens: state.chatSession.usedOutputTokens!,
                            chatHistory: state.chatSession.chatHistory
                        }
                    };
                    console.log({newChatSessionAndFilename});

                    setSelectedChatSession(newChatSessionAndFilename.chatSession);
                    console.log("newChatSessionAndFilename set");
                    console.log("filename set");

                    if (newChatSessionAndFilename.chatSession.chatHistory) {
                        saveChatSession(newChatSessionAndFilename);
                    }

                    return newChatSessionAndFilename;
                } else return chatSessionAndFilename;
            });

            setChatSessionsAndFilenames(newChatSessionsAndFilenames);
        }
    }, [generatingResult]);

    const loadChatSession = useCallback(
        async (index: number) => {
            console.log("Loading chat session");
            setloadMessage("Loading chat session");
            await clearErrors();

            if (chatSessionsAndFilenames) {
                const chatSession = chatSessionsAndFilenames[index]?.chatSession;
                setSelectedChatSession(chatSession);
                console.log("Selected chat session set");

                console.log(`${selectedChatSession?.modelName} === ${chatSession?.modelName}`);

                await electronLlmRpc.setChatSessionLoad();
                if (selectedChatSession?.modelName === chatSession?.modelName) {
                    console.log("Selected chat session is the same as the old one, loading Chat History immediately");

                    // await electronLlmRpc.loadModel(chatSession!.modelPath);
                    console.log("Creating Context");
                    await electronLlmRpc.createContext();

                    console.log("Creating Context");
                    await electronLlmRpc.createContextSequence();

                    console.log("Loading Chat History");
                    await electronLlmRpc.loadChatHistory(chatSession!.chatHistory!, chatSession!.inputTokens, chatSession!.outputTokens);
                } else {
                    console.log("Loading Model");
                    await electronLlmRpc.loadModel(chatSession!.modelPath);

                    console.log("Creating Context");
                    await electronLlmRpc.createContext();

                    console.log("Creating Context Sequence");
                    await electronLlmRpc.createContextSequence();

                    console.log("Loading Chat History");
                    await electronLlmRpc.loadChatHistory(chatSession!.chatHistory!, chatSession!.inputTokens, chatSession!.outputTokens);
                }

                setSelectedModel(chatSession!.modelPath);
                console.log("Selected model set");
            } else console.log("There are no chat sessions available");
            updateChatSessions();
        },
        [chatSessionsAndFilenames, selectedChatSession]
    );

    const renameChatSession = useCallback(
        (event: React.KeyboardEvent, index: number, chatSessionName: string, callback: () => void) => {
            console.log("Renaming chat session");

            if (event.key === "Escape") {
                console.log("Escape key entered. Removing input element");
                callback();
            } else if (event.key === "Enter") {
                try {
                    const newChatSessionsAndFilenames = chatSessionsAndFilenames.map((chatSessionAndFilename, i) => {
                        if (i === index) {
                            console.log(`Updating chat session of index ${index}`);

                            const newChatSessionAndFilename: ChatSessionAndFilename = {
                                ...chatSessionAndFilename,
                                chatSession: {
                                    ...chatSessionAndFilename.chatSession,
                                    name: chatSessionName ? chatSessionName : chatSessionAndFilename.chatSession.name
                                }
                            };
                            console.log({newChatSessionAndFilename});

                            window.utils.chatSessionExists(newChatSessionAndFilename.filename).then((value) => {
                                if (value === true) {
                                    saveChatSession(newChatSessionAndFilename);
                                } else {
                                    throw Error("File does not exist");
                                }
                            });
                            return newChatSessionAndFilename;
                        } else return chatSessionAndFilename;
                    });
                    setChatSessionsAndFilenames(newChatSessionsAndFilenames);
                } catch (err) {
                    updateChatSessions();
                }

                callback();
            }
        },
        [chatSessionsAndFilenames]
    );

    const deleteChatSession = useCallback(
        (index: number) => {
            console.log(`Deleting chat session index ${index}`);

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

                // setSelectedModel("");
                // console.log("selected model set to empty");

                // setSelectedChatSession(undefined);
                // console.log("selected chat session set to undefined");

                unload();
            } catch (err) {
                updateChatSessions();
            }
        },
        [chatSessionsAndFilenames]
    );

    const saveChatSession = useCallback(async (chatSessionAndFilename: ChatSessionAndFilename) => {
        console.log("Saving chat session");
        console.log(`Filename: ${chatSessionAndFilename.filename}`);
        console.log({chatSessionAndFilename});

        await window.utils.saveChatSession(chatSessionAndFilename.filename, chatSessionAndFilename.chatSession);
    }, []);

    const loadModelAndSession = useCallback(async () => {
        if (selectedModel) {
            console.log(`Loading ${selectedModel}`);
            setloadMessage("Loading model");

            const updatedChatSessionsAndFilenames = await getChatSessions();
            console.log("Updating chatSessionsAndFilenames first");

            const newChatSessionAndFilename: ChatSessionAndFilename = await createChatSessionFile(selectedModel);
            console.log(`Created new chat session file: ${newChatSessionAndFilename.filename}`);

            setSelectedChatSession(newChatSessionAndFilename.chatSession);
            console.log("newChatSession set");

            setChatSessionsAndFilenames([...updatedChatSessionsAndFilenames, newChatSessionAndFilename]);
            console.log("Added newChatSession to existing chatSessions");

            await electronLlmRpc.loadModelAndSession(selectedModel);
            await saveChatSession(newChatSessionAndFilename);
        }
    }, [selectedModel]);

    const getChatSessions = useCallback(async () => {
        return await window.utils.getChatSessions();
    }, []);

    const createChatSessionFile = useCallback(async (modelFilePath: string) => {
        return await window.utils.createChatSessionFile(modelFilePath);
    }, []);

    const stopActivePrompt = useCallback(() => {
        void electronLlmRpc.stopActivePrompt();
    }, []);

    const resetChatHistory = useCallback(() => {
        void electronLlmRpc.stopActivePrompt();
        void electronLlmRpc.resetChatHistory();
    }, []);

    const sendPrompt = useCallback(
        (prompt: string) => {
            if (generatingResult) return;

            void electronLlmRpc.prompt(prompt);
        },
        [generatingResult]
    );

    const updateChatSessions = useCallback(() => {
        console.log("Updating ChatSession list");

        window.utils.getChatSessions().then((value) => {
            setChatSessionsAndFilenames(value);
        });
    }, []);

    const onPromptInput = useCallback((currentText: string) => {
        void electronLlmRpc.setDraftPrompt(currentText);
    }, []);

    const saveChatHistory = useCallback(() => {
        void electronLlmRpc.saveChatHistory();
    }, []);

    const unload = useCallback(async () => {
        console.log("Unloading state");

        setSelectedModel("");
        console.log("selected model set to empty");

        setSelectedChatSession(undefined);
        console.log("selected chat session set to undefined");

        await electronLlmRpc.unload();
    }, []);

    const clearErrors = useCallback(async () => {
        console.log("Clearing errors");
        await electronLlmRpc.clearErrors();
    }, []);

    const exportFile = useCallback(
        async (type: ExportDialogType, index: number) => {
            console.log("Exporting file");

            await window.utils.exportFile(type, chatSessionsAndFilenames[index]!.chatSession!);
            updateChatSessions();
        },
        [chatSessionsAndFilenames]
    );

    !isDarkMode ? document.querySelector("html")?.classList.remove("dark") : document.querySelector("html")?.classList.add("dark");

    const error = state.llama.error ?? state.model.error ?? state.context.error ?? state.contextSequence.error;
    const loading =
        state.selectedModelFilePath != null &&
        (!state.model.loaded || !state.llama.loaded || !state.context.loaded || !state.contextSequence.loaded || !state.chatSession.loaded);
    const loaded = state.chatSession.loaded;
    const showMessage = state.selectedModelFilePath == null || error != null || state.chatSession.simplifiedChat.length === 0;

    return (
        <div className="flex flex-row">
            <Sidebar
                mainButton="New chat session"
                mainButtonFunction={unload}
                items={chatSessionsAndFilenames}
                OnSelectItem={loadChatSession}
                renameItem={renameChatSession}
                deleteItem={deleteChatSession}
                exportItem={exportFile}
            >
                <SidebarButtonGroup>
                    <SideBarButton display="Clear Conversations" Icon={Trash} />
                    <SideBarButton display="Export Data" Icon={FileExport} />
                    <SideBarButton display="Settings" Icon={Settings} />
                    <Button onClick={() => setDarkMode((isDarkMode) => !isDarkMode)}>Dark Mode</Button>
                </SidebarButtonGroup>
            </Sidebar>
            <Center
                state={state}
                selectedModel={selectedModel}
                loaded={loaded}
                generatingResult={generatingResult}
                loading={loading}
                error={error}
                loadMessage={loadMessage}
                systemPrompt={systemPrompt}
                setSystemPrompt={setSystemPrompt}
                setSelectedModel={setSelectedModel}
                loadModelAndSession={loadModelAndSession}
                stopActivePrompt={stopActivePrompt}
                onPromptInput={onPromptInput}
                sendPrompt={sendPrompt}
                saveChatHistory={saveChatHistory}
            />
            <Sidebar mainButton="New Prompt" selectItem={(index) => null} />
        </div>
    );
}

export default App2;
