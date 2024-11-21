/// <reference types="vite-plugin-svgr/client" />

import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import Trash from "../icons/trash.svg?react";
import FileExport from "../icons/file-export.svg?react";
import Settings from "../icons/settings.svg?react";
import Plus from "../icons/plus.svg?react";
import ChatSession from "../interfaces/ChatSession";
import {useExternalState} from "../hooks/useExternalState";
import {llmState} from "../state/llmState";
import {electronLlmRpc} from "../rpc/llmRpc";
import ChatSessionAndFilename from "../interfaces/ChatSessionAndFilename";
import {ExportDialogType} from "../interfaces/dialog";
import LocaiConfig from "../interfaces/locaiconfig";
import PromptAndFilename from "../interfaces/PromptAndFilename";
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
import {BottomBar, BottomBarInput, QuickSettings, QuickSettingsItem} from "./components/Center/BottomBar";
import {Switch} from "./shadcncomponents/switch";
import CreatePromptDialog from "./components/Dialogs/CreatePromptDialog";
import {Dialog, DialogContent, DialogTrigger} from "./shadcncomponents/dialog";

function App2(): JSX.Element {
    const [isDarkMode, setDarkMode] = useState(false);
    const [chatSessionsAndFilenames, setChatSessionsAndFilenames] = useState<ChatSessionAndFilename[]>([]);
    const [promptsAndFilenames, setPromptsAndFilenames] = useState<PromptAndFilename[]>([]);
    const [selectedChatSession, setSelectedChatSession] = useState<ChatSession>();
    const [selectedModel, setSelectedModel] = useState("");
    const [loadMessage, setloadMessage] = useState<string>();
    const [systemPrompt, setSystemPrompt] = useState<string>("");
    const state = useExternalState(llmState);
    const {generatingResult} = state.chatSession;

    useEffect(() => {
        console.log("Getting chat sessions from file system");
        getChatSessions().then((value) => setChatSessionsAndFilenames(value));

        console.log("Getting prompts from file system");
        getPrompts().then((value) => setPromptsAndFilenames(value));

        console.log("Getting default system prompt");
        window.utils.getConfig().then((value: LocaiConfig) => setSystemPrompt(value.defaultSystemPrompt));
    }, []);

    useEffect(() => {
        console.log(`generating result ${generatingResult}`);

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
        (event: React.KeyboardEvent, index: number, itemName: string) => {
            console.log("Renaming chat session");

            try {
                const newChatSessionsAndFilenames = chatSessionsAndFilenames.map((chatSessionAndFilename, i) => {
                    if (i === index) {
                        console.log(`Updating chat session of index ${index}`);

                        const newChatSessionAndFilename: ChatSessionAndFilename = {
                            ...chatSessionAndFilename,
                            chatSession: {
                                ...chatSessionAndFilename.chatSession,
                                name: itemName ? itemName : chatSessionAndFilename.chatSession.name
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
        },
        [chatSessionsAndFilenames]
    );

    const deleteChatSession = useCallback(
        (index: number) => {
            console.log(`Deleting chat session index ${index}`);
            setInputValue("");

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
                    unload();
                } else if (chatSessionSelectedIndex! >= index) {
                    setChatSessionSelectedIndex((value) => (value ? value - 1 : value));
                }

                // setSelectedModel("");
                // console.log("selected model set to empty");

                // setSelectedChatSession(undefined);
                // console.log("selected chat session set to undefined");
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

            setChatSessionSelectedIndex(updatedChatSessionsAndFilenames.length);
            console.log("Selected chat session index");

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

    const getPrompts = useCallback(async () => {
        return await window.utils.getPrompts();
    }, []);

    const createPromptFile = useCallback(async (name: string, description: string, prompt: string) => {
        console.log("Creating prompt file");

        const updatedPromptsAndFilenames: PromptAndFilename[] = await getPrompts();
        console.log("Updating promptsAndFilenames first");

        const newPromptAndFilename: PromptAndFilename = await window.utils.createPromptFile(name, description, prompt);
        console.log(`Created new prompt file: ${newPromptAndFilename.filename}`);

        setPromptsAndFilenames([...updatedPromptsAndFilenames, newPromptAndFilename]);
        console.log("Added newPromptAndFilename to existing PromptsAndFilenames");
    }, []);

    const renamePrompt = useCallback(
        (event: React.KeyboardEvent, index: number, itemName: string) => {
            console.log("Renaming prompt");

            try {
                const newPromptsAndFilenames = promptsAndFilenames.map((promptAndFilename, i) => {
                    if (i === index) {
                        console.log(`Updating prompt of index ${index}`);

                        const newPromptAndFilename: PromptAndFilename = {
                            ...promptAndFilename,
                            prompt: {
                                ...promptAndFilename.prompt,
                                name: itemName ? itemName : promptAndFilename.prompt.name
                            }
                        };
                        console.log({newPromptAndFilename});

                        window.utils.promptExists(newPromptAndFilename.filename).then((value) => {
                            if (value === true) {
                                savePrompt(newPromptAndFilename);
                            } else {
                                throw Error("File does not exist");
                            }
                        });
                        return newPromptAndFilename;
                    } else return promptAndFilename;
                });
                setPromptsAndFilenames(newPromptsAndFilenames);
            } catch (err) {
                updatePromptsAndFilenames();
            }
        },
        [promptsAndFilenames]
    );

    const deletePrompt = useCallback(
        (index: number) => {
            console.log(`Deleting prompt index ${index}`);

            try {
                const toDeletePrompt = promptsAndFilenames[index];
                window.utils.promptExists(toDeletePrompt!.filename).then((value) => {
                    if (value === true) {
                        window.utils.deletePrompt(toDeletePrompt!.filename);
                    } else {
                        throw Error("File does not exist");
                    }
                });

                const newPromptsAndFilenames = promptsAndFilenames.filter((promptAndFilename, i) => i !== index);

                setPromptsAndFilenames(newPromptsAndFilenames);
                console.log("newPromptsAndFilenames set");
            } catch (err) {
                console.error(err);
                updatePromptsAndFilenames();
            }
        },
        [promptsAndFilenames]
    );

    const updatePromptsAndFilenames = useCallback(() => {
        console.log("Updating promptsAndFilenames list");

        window.utils.getPrompts().then((value) => {
            setPromptsAndFilenames(value);
        });
    }, []);

    const savePrompt = useCallback(async (promptAndFilename: PromptAndFilename) => {
        console.log("Saving prompt");
        console.log(`Filename: ${promptAndFilename.filename}`);
        console.log({promptAndFilename});

        await window.utils.savePrompt(promptAndFilename.filename, promptAndFilename.prompt);
    }, []);

    const stopActivePrompt = useCallback(() => {
        console.log("Stop active prompt");

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

    // Center
    const inputRef = useRef<HTMLInputElement>(null);
    const [inputText, setInputText] = useState<string>("");
    const autocompleteRef = useRef<HTMLDivElement>(null);
    const autocompleteCurrentTextRef = useRef<HTMLDivElement>(null);
    const [isSystemPrompt, setisSystemPrompt] = useState<boolean>(false);
    const [isShowSystemPrompt, setIsShowSystemPrompt] = useState<boolean>(false);

    const autocompleteText = useMemo(() => {
        const fullText = (state.chatSession.draftPrompt.prompt ?? "") + (state.chatSession.draftPrompt.completion ?? "");
        if (fullText.startsWith(inputText)) return fullText.slice(inputText.length);
        return "";
    }, [inputText, state.chatSession.draftPrompt.prompt, state.chatSession.draftPrompt.completion]);

    const setInputValue = useCallback((value: string) => {
        if (inputRef.current != null) inputRef.current.value = value;

        if (autocompleteCurrentTextRef.current != null) autocompleteCurrentTextRef.current.innerText = value;

        setInputText(value);
    }, []);

    const resizeInput = useCallback(() => {
        if (inputRef.current == null) return;

        inputRef.current.style.height = "";
        inputRef.current.style.height = inputRef.current.scrollHeight + "px";

        if (autocompleteRef.current != null) {
            autocompleteRef.current.scrollTop = inputRef.current.scrollTop;
        }
    }, []);

    const submitPrompt = useCallback(() => {
        console.log("submitting prompt");

        if (generatingResult || inputRef.current == null) {
            console.warn("Input is null");
            return;
        }

        const message = inputRef.current.value;
        if (message.length === 0) {
            console.warn("Input is empty");
            return;
        }

        setInputValue("");
        resizeInput();
        onPromptInput?.("");
        setPromptSelectedIndex(undefined);
        sendPrompt(message);
    }, [setInputValue, generatingResult, resizeInput, sendPrompt, onPromptInput]);

    const onInput = useCallback(() => {
        setInputText(inputRef.current?.value ?? "");
        resizeInput();

        if (autocompleteCurrentTextRef.current != null && inputRef.current != null)
            autocompleteCurrentTextRef.current.innerText = inputRef.current?.value;

        if (inputRef.current != null && onPromptInput != null) onPromptInput(inputRef.current?.value);
    }, [resizeInput, onPromptInput]);

    const onInputKeyDown = useCallback(
        (event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                submitPrompt();
            } else if (event.key === "Tab" && !event.shiftKey && !event.ctrlKey && !event.metaKey && !event.altKey) {
                event.preventDefault();
                if (inputRef.current != null && autocompleteText !== "") {
                    setInputValue(inputRef.current.value + autocompleteText);
                    inputRef.current.scrollTop = inputRef.current.scrollHeight;
                    onPromptInput?.(inputRef.current.value);
                }

                resizeInput();
            }
        },
        [submitPrompt, setInputValue, onPromptInput, resizeInput, autocompleteText]
    );

    // Sidebar chat session
    const [chatSessionSelectedIndex, setChatSessionSelectedIndex] = useState<number>();
    const [promptSelectedIndex, setPromptSelectedIndex] = useState<number>();
    const [chatSessionInputValue, setChatSessionInputValue] = useState<string>("");
    const [promptInputValue, setPromptInputValue] = useState<string>("");

    // Sidebar prompt
    const loadPrompt = useCallback(
        (index: number) => {
            console.log("Loading prompt to input ref");

            if (!inputRef.current?.disabled && promptsAndFilenames) {
                setInputValue(promptsAndFilenames[index]!.prompt.prompt);
                onInput();
            } else console.warn("input ref is disabled");
        },
        [promptsAndFilenames]
    );

    return (
        <div className="flex flex-row">
            <Sidebar>
                <SidebarTop setInputValue={setChatSessionInputValue}>
                    <SidebarTopButton>
                        <Button
                            onClick={() => {
                                setChatSessionSelectedIndex(undefined);
                                setInputValue("");
                                unload();
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
                    setSelectedIndex={setChatSessionSelectedIndex}
                    OnSelectItem={loadChatSession}
                    renameItem={renameChatSession}
                    deleteItem={deleteChatSession}
                    exportItem={(index: number) => exportFile("chat session", index)}
                />
                <div className="px-[8px]">
                    <Separator />
                </div>
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
                isShowSystemPrompt={isShowSystemPrompt}
                setSystemPrompt={setSystemPrompt}
                setSelectedModel={setSelectedModel}
                loadModelAndSession={loadModelAndSession}
                setisSystemPrompt={setisSystemPrompt}
            >
                <StatusBar>
                    {selectedModel !== "" && !loading && loaded ? (
                        <>
                            <StatusBarItems display={selectedModel.split("\\").pop()} />{" "}
                            <StatusBarItems display={`Input Tokens: ${state.chatSession.usedInputTokens}/1000`} separator={false} />
                            <StatusBarItems display={`Output Tokens: ${state.chatSession.usedOutputTokens}/1000`} separator={false} />
                        </>
                    ) : (
                        <></>
                    )}
                </StatusBar>
                <BottomBar>
                    <BottomBarInput
                        disabled={!loaded}
                        inputRef={inputRef}
                        inputText={inputText}
                        autocompleteText={autocompleteText}
                        generatingResult={generatingResult}
                        onInput={onInput}
                        onInputKeyDown={onInputKeyDown}
                        stopGeneration={generatingResult ? stopActivePrompt : undefined}
                        submitPrompt={submitPrompt}
                    />
                    <QuickSettings>
                        <Switch
                            disabled={!isSystemPrompt}
                            checked={isShowSystemPrompt}
                            onCheckedChange={() => setIsShowSystemPrompt((value) => !value)}
                        />
                        <QuickSettingsItem icon={FileExport} onClick={saveChatHistory} />
                        <QuickSettingsItem icon={Plus} />
                        <QuickSettingsItem icon={Plus} />
                        <QuickSettingsItem icon={Plus} />
                        <QuickSettingsItem icon={Plus} />
                    </QuickSettings>
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
                                        createPromptFile(name, description, prompt);
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
                    OnSelectItem={loadPrompt}
                    renameItem={renamePrompt}
                    deleteItem={deletePrompt}
                    exportItem={(index: number) => exportFile("prompt", index)}
                />
            </Sidebar>
        </div>
    );
}

export default App2;
