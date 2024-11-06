/// <reference types="vite-plugin-svgr/client" />

import {useCallback, useEffect, useRef, useState} from "react";
import {ChatHistoryItem, isChatModelResponseFunctionCall} from "node-llama-cpp";
import Trash from "../icons/trash.svg?react";
import FileExport from "../icons/file-export.svg?react";
import Settings from "../icons/settings.svg?react";
import ChatSession from "../interfaces/ChatSession";
import {useExternalState} from "../hooks/useExternalState";
import {llmState} from "../state/llmState";
import {electronLlmRpc} from "../rpc/llmRpc";
import ChatSessionAndFilename from "../interfaces/ChatSessionAndFilename";
import Center from "./components/Center/Center";
import Sidebar from "./components/Sidebar/Sidebar";
import SideBarButton from "./components/Sidebar/SidebarButton";
import SidebarButtonGroup from "./components/Sidebar/SidebarButtonsGroup";
import {Button} from "./shadcncomponents/Button";

function App2(): JSX.Element {
    const [isDarkMode, setDarkMode] = useState(false);
    const [chatSessionsAndFilenames, setChatSessionsAndFilenames] = useState<ChatSessionAndFilename[]>([]);
    const [selectedChatSession, setSelectedChatSession] = useState<ChatSession>();
    const [selectedFilename, setSelectedFilename] = useState<string>();
    const [selectedModel, setSelectedModel] = useState("");
    const state = useExternalState(llmState);
    const {generatingResult} = state.chatSession;
    const chatAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        getChatSessions().then((value) => setChatSessionsAndFilenames(value));
    }, []);

    useEffect(() => {
        if (generatingResult) {
            scrollToBottom();
        } else {
            const newChatSessionsAndFilenames: ChatSessionAndFilename[] = chatSessionsAndFilenames.map((chatSessionAndFilename) => {
                if (JSON.stringify(chatSessionAndFilename.chatSession) === JSON.stringify(selectedChatSession)) {
                    console.log("Updating selected chat session");

                    const newChatSessionAndFilename: ChatSessionAndFilename = {
                        filename: chatSessionAndFilename.filename,
                        chatSession: {
                            name: chatSessionAndFilename.chatSession.name,
                            modelPath: chatSessionAndFilename.chatSession.modelPath,
                            modelName: chatSessionAndFilename.chatSession.modelName,
                            inputTokens: state.chatSession.usedInputTokens!,
                            outputTokens: state.chatSession.usedOutputTokens!,
                            chatHistory: state.chatSession.chatHistory
                        }
                    };
                    console.log({newChatSessionAndFilename});

                    setSelectedChatSession(newChatSessionAndFilename.chatSession);
                    setSelectedFilename(newChatSessionAndFilename.filename);
                    console.log("newChatSessionAndFilename set");
                    console.log("filename set");

                    if (newChatSessionAndFilename.chatSession.chatHistory) {
                        saveChatSession(newChatSessionAndFilename.chatSession);
                    }

                    return newChatSessionAndFilename;
                } else return chatSessionAndFilename;
            });

            setChatSessionsAndFilenames(newChatSessionsAndFilenames);
        }
    }, [generatingResult]);

    useEffect(() => {
        if (isScrolledToTheBottom()) {
            scrollToBottom();
        }
    }, [chatAreaRef.current?.scrollHeight]);

    const loadChatSession = useCallback(
        async (index: number) => {
            console.log("Loading chat session");

            if (chatSessionsAndFilenames) {
                const chatSession = chatSessionsAndFilenames[index]?.chatSession;
                setSelectedChatSession(chatSession);
                console.log("Selected chat session set");
                setSelectedFilename(chatSessionsAndFilenames[index]?.filename);
                console.log("Selected filename set");
                setSelectedModel(chatSession!.modelPath);
                console.log("Selected model set");

                console.log(`${selectedChatSession?.modelName} === ${chatSession?.modelName}`);

                if (selectedChatSession?.modelName === chatSession?.modelName) {
                    console.log("Selected chat session is the same as the old one, loading Chat History immediately");

                    // await electronLlmRpc.loadModel(chatSession!.modelPath);
                    await electronLlmRpc.createContext();
                    await electronLlmRpc.createContextSequence();
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
            } else console.log("There are no chat sessions available");
        },
        [chatSessionsAndFilenames, selectedChatSession]
    );

    const saveChatSession = useCallback(
        async (chatSession: ChatSession) => {
            console.log("Saving chat session");
            console.log(`Filename: ${selectedFilename}`);
            console.log({chatSession});

            await window.utils.saveChatSession(selectedFilename!, chatSession);
        },
        [selectedFilename]
    );

    const isScrolledToTheBottom = useCallback(() => {
        if (chatAreaRef.current != null) {
            return chatAreaRef.current!.clientHeight / (chatAreaRef.current!.scrollHeight - chatAreaRef.current!.scrollTop) > 0.85;
        }

        return true;
    }, []);

    const scrollToBottom = useCallback(() => {
        if (chatAreaRef.current != null) {
            chatAreaRef.current!.scrollTop = chatAreaRef.current.scrollHeight;
        }
    }, []);

    const loadModelAndSession = useCallback(async () => {
        if (selectedModel) {
            console.log(`Loading ${selectedModel}`);

            const updatedChatSessionsAndFilenames = await getChatSessions();
            console.log("Updating chatSessionsAndFilenames first");

            const newChatSessionAndFilename: ChatSessionAndFilename = await createChatSessionFile(selectedModel);
            console.log(`Created new chat session file: ${newChatSessionAndFilename.filename}`);

            setSelectedChatSession(newChatSessionAndFilename.chatSession);
            console.log("newChatSession set");

            setSelectedFilename(newChatSessionAndFilename.filename);
            console.log("Set newFilename as selectedFilename");

            setChatSessionsAndFilenames([...updatedChatSessionsAndFilenames, newChatSessionAndFilename]);
            console.log("Added newChatSession to existing chatSessions");

            await electronLlmRpc.loadModelAndSession(selectedModel);
        }
    }, [selectedModel]);

    const getChatSessions = useCallback(async () => {
        return await window.utils.getChatSessions();
    }, []);

    const createChatSessionFile = useCallback(async (modelFilePath: string) => {
        return await window.utils.createChatSessionFile(modelFilePath);
    }, []);

    // const loadChatHistory = useCallback(async () => {
    //     if (selectedChatSession?.modelPath === modelFilePath) {
    //         console.log("Current model used is the same as the model to be loaded. Skipping model loading...");
    //         await electronLlmRpc.loadChatHistory(modelFilePath, chatHistory, true);
    //     } else await electronLlmRpc.loadChatHistory(modelFilePath, chatHistory, false);
    // }, [selectedChatSession]);

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

    const onPromptInput = useCallback((currentText: string) => {
        void electronLlmRpc.setDraftPrompt(currentText);
    }, []);

    const saveChatHistory = useCallback(() => {
        void electronLlmRpc.saveChatHistory();
    }, []);

    !isDarkMode ? document.querySelector("html")?.classList.remove("dark") : document.querySelector("html")?.classList.add("dark");

    const error = state.llama.error ?? state.model.error ?? state.context.error ?? state.contextSequence.error;
    const loading =
        state.selectedModelFilePath != null &&
        error == null &&
        (!state.model.loaded || !state.llama.loaded || !state.context.loaded || !state.contextSequence.loaded || !state.chatSession.loaded);
    const loaded = state.chatSession.loaded;
    const showMessage = state.selectedModelFilePath == null || error != null || state.chatSession.simplifiedChat.length === 0;
    console.log(`state.model.loaded = ${state.model.loaded}`);
    console.log(`state.contextSequence.loaded = ${state.contextSequence.loaded}`);
    console.log(`state.chatSession.loaded = ${state.chatSession.loaded}`);
    return (
        <div className="flex flex-row">
            <Sidebar
                mainButton="New Chat"
                items={chatSessionsAndFilenames.map((value) => value.chatSession.name)}
                OnSelectItem={loadChatSession}
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
                chatAreaRef={chatAreaRef}
                generatingResult={generatingResult}
                loading={loading}
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
