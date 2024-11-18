/// <reference types="vite-plugin-svgr/client" />

import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {LlmState} from "../../../../electron/state/llmState";
import Plus from "../../../icons/plus.svg?react";
import FileExport from "../../../icons/file-export.svg?react";
import Error from "../../../icons/exclamation-circle.svg?react";
import {Switch} from "../../shadcncomponents/switch";
import {BottomBar, BottomBarInput, QuickSettings, QuickSettingsItem} from "./BottomBar";
import ModelSettings from "./ModelSettings";
import StatusBar from "./StatusBar";
import StatusBarItems from "./StatusBarItem";
import ChatArea from "./ChatArea/ChatArea";
import Loading from "./Loading";
interface CenterProps {
    state: LlmState,
    selectedModel: string,
    loaded: boolean,
    chatAreaRef: React.RefObject<HTMLDivElement>,
    generatingResult: boolean,
    loading: boolean,
    error?: string,
    loadMessage?: string,
    setSelectedModel: React.Dispatch<React.SetStateAction<string>>,
    loadModelAndSession(): Promise<void>,
    stopActivePrompt(): void,
    onPromptInput(currentText: string): void,
    sendPrompt(prompt: string): void,
    saveChatHistory(): void
}

function Center({
    state,
    selectedModel,
    loaded,
    chatAreaRef,
    generatingResult,
    loading,
    error,
    loadMessage,
    setSelectedModel,
    loadModelAndSession,
    stopActivePrompt,
    onPromptInput,
    sendPrompt,
    saveChatHistory
}: CenterProps): JSX.Element {
    const [isShowSystemPrompt, setIsShowSystemPrompt] = useState<boolean>(false);
    const [inputText, setInputText] = useState<string>("");
    const [isSystemPrompt, setisSystemPrompt] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const autocompleteRef = useRef<HTMLDivElement>(null);
    const autocompleteCurrentTextRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (state.chatSession.simplifiedChat.length) {
            state.chatSession.simplifiedChat.some((item) => {
                if (item.type === "system") {
                    setisSystemPrompt(true);
                    console.log("true");
                    return true;
                } else {
                    setisSystemPrompt(false);
                    console.log("false");
                    return false;
                }
            });
        } else setisSystemPrompt(false);
    }, [loading, error]);

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
        if (generatingResult || inputRef.current == null) return;

        const message = inputRef.current.value;
        if (message.length === 0) return;

        setInputValue("");
        resizeInput();
        onPromptInput?.("");
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

    return (
        <div className="flex flex-col p-[8px] pt-[8px] pb-[30px] h-screen w-full">
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
            {error ? (
                <div className="flex gap-[10px] w-full h-full items-center justify-center text-negative">
                    <Error />
                    {error}
                </div>
            ) : loading ? (
                <Loading progress={state.model.loadProgress}>{loadMessage}</Loading>
            ) : !loaded ? (
                <ModelSettings
                    setSelectedModel={setSelectedModel}
                    loadModelAndSession={loadModelAndSession}
                    selectedModel={selectedModel}
                />
            ) : (
                <ChatArea ref={chatAreaRef} simplifiedChat={state.chatSession.simplifiedChat} isShowSystemPrompt={isShowSystemPrompt} />
            )}
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
        </div>
    );
}

export default Center;
