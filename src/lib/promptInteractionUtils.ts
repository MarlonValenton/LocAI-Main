import ModelResponseSettings from "../interfaces/ModelResponseSettings";
import {electronLlmRpc} from "../rpc/llmRpc";

function stopActivePrompt() {
    console.log("Stop active prompt");

    void electronLlmRpc.stopActivePrompt();
}

function submitPrompt(
    setInputValue: (value: string) => void,
    setPromptSelectedIndex: React.Dispatch<React.SetStateAction<number | undefined>>,
    modelResponseSettings: ModelResponseSettings,
    generatingResult: boolean,
    inputRef: React.RefObject<HTMLInputElement> | null,
    autocompleteRef: React.RefObject<HTMLDivElement | null>
) {
    console.log("submitting prompt");

    if (generatingResult || inputRef?.current == null) {
        console.warn("Input is null");
        return;
    }

    const message = inputRef.current.value;
    if (message.length === 0) {
        console.warn("Input is empty");
        return;
    }

    setInputValue("");
    resizeInput(inputRef, autocompleteRef);
    onPromptInput("");
    setPromptSelectedIndex(undefined);

    if (generatingResult) return;
    void electronLlmRpc.prompt(message, modelResponseSettings.responseSettings);
}

function resizeInput(inputRef: React.RefObject<HTMLInputElement> | null, autocompleteRef: React.RefObject<HTMLDivElement | null>) {
    if (inputRef?.current == null) return;

    inputRef.current.style.height = "";
    inputRef.current.style.height = inputRef.current.scrollHeight + "px";

    if (autocompleteRef.current != null) {
        autocompleteRef.current.scrollTop = inputRef.current.scrollTop;
    }
}

function onPromptInput(currentText: string) {
    void electronLlmRpc.setDraftPrompt(currentText);
}

function onInput(
    setInputText: React.Dispatch<React.SetStateAction<string>>,
    inputRef: React.RefObject<HTMLInputElement>,
    autocompleteRef: React.RefObject<HTMLDivElement>,
    autocompleteCurrentTextRef: React.RefObject<HTMLDivElement>
) {
    setInputText(inputRef.current?.value ?? "");
    resizeInput(inputRef, autocompleteRef);

    if (autocompleteCurrentTextRef.current != null && inputRef.current != null)
        autocompleteCurrentTextRef.current.innerText = inputRef.current?.value;

    if (inputRef.current != null && onPromptInput != null) onPromptInput(inputRef.current?.value);
}

function setInputValue(
    setInputText: React.Dispatch<React.SetStateAction<string>>,
    inputRef: React.RefObject<HTMLInputElement>,
    autocompleteCurrentTextRef: React.RefObject<HTMLDivElement>,
    value: string
) {
    if (inputRef.current != null) inputRef.current.value = value;

    if (autocompleteCurrentTextRef.current != null) autocompleteCurrentTextRef.current.innerText = value;

    setInputText(value);
}

function onInputKeydown(
    setInputText: React.Dispatch<React.SetStateAction<string>>,
    setPromptSelectedIndex: React.Dispatch<React.SetStateAction<number | undefined>>,
    inputRef: React.RefObject<HTMLInputElement>,
    autocompleteRef: React.RefObject<HTMLDivElement>,
    autocompleteText: string,
    event: React.KeyboardEvent<HTMLInputElement>,
    autocompleteCurrentTextRef: React.RefObject<HTMLDivElement>,
    modelResponseSettings: ModelResponseSettings,
    generatingResult: boolean
) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        submitPrompt(
            (value: string) => setInputValue(setInputText, inputRef, autocompleteCurrentTextRef, value),
            setPromptSelectedIndex,
            modelResponseSettings,
            generatingResult,
            inputRef,
            autocompleteCurrentTextRef
        );
    } else if (event.key === "Tab" && !event.shiftKey && !event.ctrlKey && !event.metaKey && !event.altKey) {
        event.preventDefault();
        if (inputRef.current != null && autocompleteText !== "") {
            setInputValue(setInputText, inputRef, autocompleteCurrentTextRef, inputRef.current.value + autocompleteText);
            inputRef.current.scrollTop = inputRef.current.scrollHeight;
            onPromptInput?.(inputRef.current.value);
        }

        resizeInput(inputRef, autocompleteRef);
    }
}
export {stopActivePrompt, submitPrompt, resizeInput, onPromptInput, onInput, setInputValue, onInputKeydown};
