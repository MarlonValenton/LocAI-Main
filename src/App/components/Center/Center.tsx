import {LlmState} from "../../../../electron/state/llmState";
import BottomBar from "./BottomBar";
import ModelSettings from "./ModelSettings";
import StatusBar from "./StatusBar";
import StatusBarItems from "./StatusBarItem";
import ChatArea from "./ChatArea/ChatArea";

interface CenterProps {
    state: LlmState,
    selectedModel: string,
    loaded: boolean,
    chatAreaRef: React.RefObject<HTMLDivElement>,
    generatingResult: boolean,
    loading: boolean,
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
    setSelectedModel,
    loadModelAndSession,
    stopActivePrompt,
    onPromptInput,
    sendPrompt,
    saveChatHistory
}: CenterProps): JSX.Element {
    console.log(loaded);

    return (
        <div className="flex flex-col p-[8px] pt-[8px] pb-[30px] h-screen w-full">
            <StatusBar>
                {selectedModel !== "" ? (
                    <>
                        <StatusBarItems display={selectedModel.split("\\").pop()} />{" "}
                        <StatusBarItems display={`Input Tokens: ${state.chatSession.usedInputTokens}/1000`} separator={false} />
                        <StatusBarItems display={`Output Tokens: ${state.chatSession.usedOutputTokens}/1000`} separator={false} />
                    </>
                ) : (
                    <></>
                )}
            </StatusBar>
            {!loaded ? (
                <ModelSettings
                    setSelectedModel={setSelectedModel}
                    loadModelAndSession={loadModelAndSession}
                    selectedModel={selectedModel}
                    loading={loading}
                />
            ) : (
                <ChatArea ref={chatAreaRef} simplifiedChat={state.chatSession.simplifiedChat} />
            )}
            <BottomBar
                disabled={loaded}
                generatingResult={generatingResult}
                autocompleteInputDraft={state.chatSession.draftPrompt.prompt}
                autocompleteCompletion={state.chatSession.draftPrompt.completion}
                stopGeneration={generatingResult ? stopActivePrompt : undefined}
                onPromptInput={onPromptInput}
                sendPrompt={sendPrompt}
                saveChatHistory={saveChatHistory}
            />
        </div>
    );
}

export default Center;
