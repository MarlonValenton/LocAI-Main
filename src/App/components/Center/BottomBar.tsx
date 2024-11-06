/// <reference types="vite-plugin-svgr/client" />

import {useCallback, useMemo, useRef, useState} from "react";
import {Input} from "../../shadcncomponents/Input";
import Bolt from "../../../icons/bolt.svg?react";
import Send from "../../../icons/send.svg?react";
import Plus from "../../../icons/plus.svg?react";
import Stop from "../../../icons/player-stop.svg?react";
import FileExport from "../../../icons/file-export.svg?react";
import QuickSettings from "./QuickSettings";
import QuickSettingsItem from "./QuickSettingsItem";

interface BottomBarProps {
    disabled?: boolean,
    autocompleteInputDraft?: string,
    autocompleteCompletion?: string,
    generatingResult: boolean,
    stopGeneration?(): void,
    onPromptInput?(currentText: string): void,
    sendPrompt(prompt: string): void,
    saveChatHistory(chatSessionName: string): void
}

function BottomBar({
    disabled = false,
    autocompleteInputDraft,
    autocompleteCompletion,
    generatingResult,
    stopGeneration,
    onPromptInput,
    sendPrompt,
    saveChatHistory
}: BottomBarProps): JSX.Element {
    const [inputText, setInputText] = useState<string>("");
    const inputRef = useRef<HTMLInputElement>(null);
    const autocompleteRef = useRef<HTMLDivElement>(null);
    const autocompleteCurrentTextRef = useRef<HTMLDivElement>(null);

    const autocompleteText = useMemo(() => {
        const fullText = (autocompleteInputDraft ?? "") + (autocompleteCompletion ?? "");
        if (fullText.startsWith(inputText)) return fullText.slice(inputText.length);
        return "";
    }, [inputText, autocompleteInputDraft, autocompleteCompletion]);

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
        <div className="flex flex-col justify-center items-center mt-5 [&>*:not(:last-child)]:mb-[15px]">
            <Input
                ref={inputRef}
                onInput={onInput}
                onKeyDownCapture={onInputKeyDown}
                autoComplete="off"
                spellCheck
                outerClassName="max-w-[900px]"
                variant={document.querySelector("html")?.classList.value === "dark" ? "solid" : "default"}
                autocomplete={inputText + autocompleteText}
                placeholder={inputText + autocompleteText === "" ? "Type a message..." : ""}
                startIcon={
                    <button className="text-primary p-[5px] rounded-[5px] hover:bg-black/5 dark:hover:bg-white/10">
                        <Bolt className="size-[23px]" />
                    </button>
                }
                endIcon={
                    generatingResult ? (
                        <button className="text-primary p-[5px] rounded-[5px] hover:bg-black/5 dark:hover:bg-white/10">
                            <Stop className="size-[23px]" onClick={stopGeneration} />
                        </button>
                    ) : (
                        <button className="text-primary p-[5px] rounded-[5px] hover:bg-black/5 dark:hover:bg-white/10">
                            <Send className="size-[23px]" onClick={submitPrompt} />
                        </button>
                    )
                }
                disabled={disabled}
            />
            <QuickSettings>
                <QuickSettingsItem icon={FileExport} onClick={saveChatHistory} />
                <QuickSettingsItem icon={Plus} />
                <QuickSettingsItem icon={Plus} />
                <QuickSettingsItem icon={Plus} />
                <QuickSettingsItem icon={Plus} />
            </QuickSettings>
        </div>
    );
}

export default BottomBar;
