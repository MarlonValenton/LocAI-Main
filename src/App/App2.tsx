/// <reference types="vite-plugin-svgr/client" />

import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import { ChatHistoryItem, ChatModelResponse, ChatUserMessage, ChatApiResponse, ChatApiModel } from "node-llama-cpp";
import Trash from "../icons/trash.svg?react";
import FileExport from "../icons/file-export.svg?react";
import Settings from "../icons/settings.svg?react";
import Plus from "../icons/plus.svg?react";
import ChatSession from "../interfaces/ChatSession";
import {useExternalState} from "../hooks/useExternalState";
import {llmState} from "../state/llmState";
import ChatSessionAndFilename from "../interfaces/ChatSessionAndFilename";
import PromptAndFilename from "../interfaces/PromptAndFilename";
import {ChatSessionValues, PromptValues} from "../interfaces/EditItemValues";
import ModelResponseSettings from "../interfaces/ModelResponseSettings";
import {
    deleteChatSession,
    editChatSession,
    loadChatSession,
    renameChatSession,
    saveChatSession,
    updateChatSessionsFromFileSystem
} from "../lib/chatSessionUtils";
import loadConfigSettings from "../lib/loadConfigSettings";
import {loadModelAndSession} from "../lib/modelUtils";
import {createPromptFile, deletePrompt, editPrompt, loadPrompt, renamePrompt} from "../lib/promptUtils";
import {exportFile, unloadObjects} from "../lib/miscUtils";
import {onInput, onInputKeydown, setInputValue, stopActivePrompt, submitPrompt} from "../lib/promptInteractionUtils";
import LocaiConfig from "../interfaces/locaiconfig";
import { callGroqApi } from "../lib/apiUtils";
import Center from "./components/Center/Center";
import Sidebar from "./components/Sidebar/Sidebar";
import SideBarButton from "./components/Sidebar/SidebarButton";
import SidebarButtonGroup from "./components/Sidebar/SidebarButtonsGroup";
import {Button} from "./shadcncomponents/Button";
import {SidebarTop, SidebarTopButton} from "./components/Sidebar/SidebarTop";
import {Separator} from "./shadcncomponents/Separator";
import {SidebarCenter} from "./components/Sidebar/SidebarCenter";
import StatusBar from "./components/Center/StatusBar";
import StatusBarItems from "./components/Center/StatusBarItem";
import {BottomBar, BottomBarInput} from "./components/Center/BottomBar/BottomBar";
import QuickSettings from "./components/Center/BottomBar/QuickSettings";
import CreatePromptDialog from "./components/Dialogs/CreatePromptDialog";
import {Dialog, DialogContent, DialogTrigger} from "./shadcncomponents/dialog";
import SettingsDialog from "./components/Dialogs/SettingsDialog";

interface App2Props {
    initSettings: LocaiConfig,
    initChatSessionsandFilenames: ChatSessionAndFilename[],
    initPromptsAndFilenames: PromptAndFilename[]
}
function App2({initSettings, initChatSessionsandFilenames, initPromptsAndFilenames}: App2Props): JSX.Element {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(initSettings.theme === "dark" ? true : false);

    // Chat sessions
    const [chatSessionsAndFilenames, setChatSessionsAndFilenames] = useState<ChatSessionAndFilename[]>(initChatSessionsandFilenames);
    const [selectedChatSession, setSelectedChatSession] = useState<ChatSession>();
    const [chatSessionSelectedIndex, setChatSessionSelectedIndex] = useState<number>();
    const [chatSessionInputValue, setChatSessionInputValue] = useState<string>("");
    const [inputText, setInputText] = useState<string>("");

    // prompts
    const [promptsAndFilenames, setPromptsAndFilenames] = useState<PromptAndFilename[]>(initPromptsAndFilenames);
    const [promptInputValue, setPromptInputValue] = useState<string>("");
    const [promptSelectedIndex, setPromptSelectedIndex] = useState<number>();
    const [prompt, setPrompt] = useState<string>("")
    const [groqApiResponse, setGroqApiResponse] = useState<string>("");

    // states
    const state = useExternalState(llmState);
    const {generatingResult} = state.chatSession;
    const [loadMessage, setloadMessage] = useState<string>();
    const [isSystemPrompt, setisSystemPrompt] = useState<boolean>(false);
    const [isShowSystemPrompt, setIsShowSystemPrompt] = useState<boolean>(false);

    // settings
    const [modelResponseSettings, setModelResponseSettings] = useState<ModelResponseSettings>({
        modelName: undefined,
        systemPrompt: initSettings.systemPrompt,
        modelLevelFlashAttention: initSettings.modelLevelFlashAttention,
        contextLevelFlashAttention: initSettings.contextLevelFlashAttention,
        contextSize: initSettings.contextSize,
        responseSettings: {
            ...initSettings.responseSettings
        }
    });

    // refs
    const inputRef = useRef<HTMLInputElement>(null);
    const autocompleteRef = useRef<HTMLDivElement>(null);
    const autocompleteCurrentTextRef = useRef<HTMLDivElement>(null);

    const autocompleteText = useMemo(() => {
        const fullText = (state.chatSession.draftPrompt.prompt ?? "") + (state.chatSession.draftPrompt.completion ?? "");
        if (fullText.startsWith(inputText)) return fullText.slice(inputText.length);
        return "";
    }, [inputText, state.chatSession.draftPrompt.prompt, state.chatSession.draftPrompt.completion]);

    useEffect(() => {
        console.log(`generating result ${generatingResult}`);
        if (!generatingResult && chatSessionsAndFilenames) {
            const newChatSessionsAndFilenames: ChatSessionAndFilename[] = chatSessionsAndFilenames.map((chatSessionAndFilename) => {
                if (JSON.stringify(chatSessionAndFilename.chatSession) === JSON.stringify(selectedChatSession)) {
                    console.log("Updating selected chat session");

                    const newChatSessionAndFilename: ChatSessionAndFilename = {
                        ...chatSessionAndFilename,
                        chatSession: {
                            ...chatSessionAndFilename.chatSession,
                            inputTokens: state.chatSession.usedInputTokens!,
                            outputTokens: state.chatSession.usedOutputTokens!,
                            chatHistory: state.chatSession.chatHistory,
                            responseSettingsHistory: [
                                ...chatSessionAndFilename.chatSession.responseSettingsHistory!,
                                modelResponseSettings.responseSettings
                            ]
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

    useEffect(() => {
        if (!isDarkMode) {
            console.log("Switching to light mode");
            document.querySelector("html")?.classList.remove("dark");
        } else {
            console.log("Switching to dark mode");
            document.querySelector("html")?.classList.add("dark");
        }
    }, [isDarkMode]);

    useEffect(() => {
        async () => {
            if (chatSessionSelectedIndex) {
                if (
                    JSON.stringify(chatSessionsAndFilenames[chatSessionSelectedIndex]?.chatSession) !== JSON.stringify(selectedChatSession)
                ) {
                    await loadChatSession(
                        setloadMessage,
                        setSelectedChatSession,
                        setisSystemPrompt,
                        setModelResponseSettings,
                        setChatSessionsAndFilenames,
                        chatSessionsAndFilenames,
                        chatSessionSelectedIndex,
                        selectedChatSession
                    );
                }
            }
        };
    }, [chatSessionsAndFilenames]);

    const error = state.llama.error ?? state.model.error ?? state.context.error ?? state.contextSequence.error;
    const loading =
        state.selectedModelFilePath != null &&
        (!state.model.loaded || !state.llama.loaded || !state.context.loaded || !state.contextSequence.loaded || !state.chatSession.loaded);
    const loaded = state.chatSession.loaded;
    const showMessage = state.selectedModelFilePath == null || error != null || state.chatSession.simplifiedChat.length === 0;

    // GroqTesting Debug
    const apiPrompt = async (prompt: any) => {
    // Get input value and trim it
        prompt = inputRef.current?.value.trim();
        if (!prompt || generatingResult) return; // Skip if no input or already generating
        setPrompt(prompt);

        // Create a new user message based on the type structure
        const newMessage: ChatApiResponse = {
            role: "user",
            content: prompt
            // role: "system",
            // content: "You are a helpful AI assistant"
        };

        // Update the chat history with the user message
        const updatedChatHistory: ChatHistoryItem[]  = [

            newMessage
        ];

        // Update the UI state with the user's message
        setSelectedChatSession({
            ...selectedChatSession,
            chatHistory: updatedChatHistory
        });

        // Clear the input field
        setInputValue(setInputText, inputRef, autocompleteCurrentTextRef, "");

        try {
        // Show loading state
            setloadMessage("Generating response...");

            // Use default model if not specified
            const modelName = "mixtral-8x7b-32768"

            // Call Groq API
            const groqResponse = await callGroqApi(updatedChatHistory, modelName);
            const apireply =  groqResponse.choices?.[0]?.message?.content;

            

            // Extract and format the assistant's response
            const assistantResponse: ChatApiModel = {
                model: "model",
                response: [
                    groqResponse?.choices?.[0]?.message?.content || "No response received.",
                ],
            };
            
            setGroqApiResponse(apireply);
            // Update the chat history with the assistant's response
            const finalChatHistory: ChatHistoryItem[] = [
                ...updatedChatHistory,
                assistantResponse,
            ];

            setSelectedChatSession({
                ...selectedChatSession,
                chatHistory: finalChatHistory,
            });

            // Clear loading state
            setloadMessage("");
        } catch (error) {
            console.error("Error generating response:", error);
            setloadMessage("Error generating response.");
        }
    };
    // GroqTestEnd

    // Sidebar chat session

    const updateStatesFromNewChatSession = useCallback(async () => {
        setisSystemPrompt(false);
        console.log("Set isSystemPrompt to false");

        setIsShowSystemPrompt(false);
        console.log("Set isShowSystemPrompt to false");

        setChatSessionSelectedIndex(undefined);
        console.log("set chatSessionSelectedIndex to undefined");

        setInputValue(setInputText, inputRef, autocompleteCurrentTextRef, "");
        console.log("Cleared input");

        setSelectedChatSession(undefined);
        console.log("Set selected chat session to undefined");

        await unloadObjects();
        console.log("Unloaded objects");
    }, [isSystemPrompt, isShowSystemPrompt, chatSessionSelectedIndex, state]);

    return (
        <div className="flex flex-row">
            <Sidebar>
                <SidebarTop setInputValue={setChatSessionInputValue}>
                    <SidebarTopButton>
                        <Button
                            onClick={() => {
                                updateStatesFromNewChatSession();
                                loadConfigSettings(setModelResponseSettings);
                            }}
                        >
                            <Plus className="size-icon mr-[5px]" />
                            <p>New chat session</p>
                        </Button>
                    </SidebarTopButton>
                </SidebarTop>
                <div className="px-[8px]">
                    <Separator />
                </div>
                <SidebarCenter
                    items={chatSessionsAndFilenames}
                    inputValue={chatSessionInputValue}
                    selectedIndex={chatSessionSelectedIndex}
                    isDarkMode={isDarkMode}
                    setSelectedIndex={setChatSessionSelectedIndex}
                    OnSelectItem={(index) =>
                        loadChatSession(
                            setloadMessage,
                            setSelectedChatSession,
                            setisSystemPrompt,
                            setModelResponseSettings,
                            setChatSessionsAndFilenames,
                            chatSessionsAndFilenames,
                            index,
                            selectedChatSession
                        )
                    }
                    renameItem={(index, values) => renameChatSession(chatSessionsAndFilenames, index, values, setChatSessionsAndFilenames)}
                    editItem={(index, values: ChatSessionValues) =>
                        editChatSession(setChatSessionsAndFilenames, chatSessionsAndFilenames, index, values)
                    }
                    deleteItem={(index) =>
                        deleteChatSession(
                            setIsShowSystemPrompt,
                            setisSystemPrompt,
                            setChatSessionsAndFilenames,
                            setChatSessionSelectedIndex,
                            (value: string) => setInputValue(setInputText, inputRef, autocompleteCurrentTextRef, value),
                            setSelectedChatSession,
                            setModelResponseSettings,
                            chatSessionsAndFilenames,
                            index,
                            chatSessionSelectedIndex
                        )
                    }
                    exportItem={(index) => {
                        exportFile(index, chatSessionsAndFilenames);
                        updateChatSessionsFromFileSystem(setChatSessionsAndFilenames);
                    }}
                />
                <div className="px-[8px]">
                    <Separator />
                </div>
                <SidebarButtonGroup>
                    <SideBarButton display="Clear Conversations" Icon={Trash} />
                    <SideBarButton display="Export Data" Icon={FileExport} />
                    <SettingsDialog isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}>
                        <SideBarButton display="Settings" Icon={Settings} />
                    </SettingsDialog>
                </SidebarButtonGroup>
            </Sidebar>
            <Center
                apiPrompt={apiPrompt}
                groqApiResponse={groqApiResponse}
                prompt={prompt}
                state={state}
                loaded={loaded}
                generatingResult={generatingResult}
                loading={loading}
                error={error}
                loadMessage={loadMessage}
                modelResponseSettings={modelResponseSettings}
                isShowSystemPrompt={isShowSystemPrompt}
                isDarkMode={isDarkMode}
                setModelResponseSettings={setModelResponseSettings}
                loadModelAndSession={() =>
                    loadModelAndSession(
                        setloadMessage,
                        setSelectedChatSession,
                        setChatSessionsAndFilenames,
                        setChatSessionSelectedIndex,
                        modelResponseSettings
                    )
                }
                loadApiModelAndSession={() =>
                    loadApiModelAndSession(
                        setloadMessage,
                        setSelectedChatSession,
                        setChatSessionSelectedIndex,
                        modelResponseSettings
                    )
                }
                setisSystemPrompt={setisSystemPrompt}
            >
                <StatusBar>
                    {modelResponseSettings.modelName !== "" && modelResponseSettings.modelName !== undefined && !loading && loaded ? (
                        <>
                            <StatusBarItems display={selectedChatSession?.modelName} />
                            <StatusBarItems display={`Input Tokens: ${state.chatSession.usedInputTokens}`} separator={true} />
                            <StatusBarItems display={`Output Tokens: ${state.chatSession.usedOutputTokens}`} separator={false} />
                        </>
                    ) : (
                        <></>
                    )}
                </StatusBar>
                <BottomBar>
                    <BottomBarInput
                        apiPrompt={apiPrompt}
                        disabled={!loaded}
                        inputRef={inputRef}
                        inputText={inputText}
                        autocompleteText={autocompleteText}
                        generatingResult={generatingResult}
                        isDarkMode={isDarkMode}
                        onInput={() => onInput(setInputText, inputRef, autocompleteRef, autocompleteCurrentTextRef)}
                        onInputKeyDown={(e) =>
                            onInputKeydown(
                                setInputText,
                                setPromptSelectedIndex,
                                inputRef,
                                autocompleteRef,
                                autocompleteText,
                                e,
                                autocompleteCurrentTextRef,
                                modelResponseSettings,
                                generatingResult
                            )
                        }
                        stopGeneration={generatingResult ? stopActivePrompt : undefined}
                        submitPrompt={() =>
                            submitPrompt(
                                (value: string) => setInputValue(setInputText, inputRef, autocompleteCurrentTextRef, value),
                                setPromptSelectedIndex,
                                modelResponseSettings,
                                generatingResult,
                                inputRef,
                                autocompleteRef
                            )
                        }
                    />
                    <QuickSettings
                        modelResponseSettings={modelResponseSettings}
                        selectedChatSession={selectedChatSession}
                        isSystemPrompt={isSystemPrompt}
                        isShowSystemPrompt={isShowSystemPrompt}
                        setIsShowSystemPrompt={setIsShowSystemPrompt}
                        setModelResponseSettings={setModelResponseSettings}
                    />
                </BottomBar>
            </Center>
            <Sidebar>
                <SidebarTop setInputValue={setPromptInputValue}>
                    <SidebarTopButton>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button
                                    onClick={() => {
                                        setPromptSelectedIndex(undefined);
                                    }}
                                >
                                    <Plus className="size-icon mr-[5px]" />
                                    <p>New prompt</p>
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-[40%] p-0 m-0 gap-0">
                                <CreatePromptDialog
                                    createPromptFile={(name, description, prompt) => {
                                        createPromptFile(setPromptsAndFilenames, name, description, prompt);
                                    }}
                                />
                            </DialogContent>
                        </Dialog>
                    </SidebarTopButton>
                </SidebarTop>
                <div className="px-[8px]">
                    <Separator />
                </div>
                <SidebarCenter
                    items={promptsAndFilenames}
                    inputValue={promptInputValue}
                    selectedIndex={promptSelectedIndex}
                    setSelectedIndex={setPromptSelectedIndex}
                    OnSelectItem={(index) =>
                        loadPrompt(
                            (value: string) => setInputValue(setInputText, inputRef, autocompleteCurrentTextRef, value),
                            () => onInput(setInputText, inputRef, autocompleteCurrentTextRef, autocompleteCurrentTextRef),
                            promptsAndFilenames,
                            index,
                            inputRef
                        )
                    }
                    renameItem={(index, values: PromptValues) => renamePrompt(setPromptsAndFilenames, promptsAndFilenames, index, values)}
                    editItem={(index, values: PromptValues) => editPrompt(setPromptsAndFilenames, promptsAndFilenames, index, values)}
                    deleteItem={(index) => deletePrompt(setPromptsAndFilenames, promptsAndFilenames, index)}
                    exportItem={(index: number) => {
                        exportFile(index, promptsAndFilenames);
                    }}
                />
            </Sidebar>
        </div>
    );
}

export default App2;
