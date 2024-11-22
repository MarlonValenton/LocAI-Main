/// <reference types="vite-plugin-svgr/client" />

import {useEffect} from "react";
import {LlmState} from "../../../../electron/state/llmState";
import Error from "../../../icons/exclamation-circle.svg?react";
import PromptAndFilename from "../../../interfaces/PromptAndFilename";
import ModelResponseSettings from "../../../interfaces/ModelResponseSettings";
import ModelSettings from "./ModelSettings";
import ChatArea from "./ChatArea/ChatArea";
import Loading from "./Loading";
interface CenterProps {
    state: LlmState,
    loaded: boolean,
    generatingResult: boolean,
    loading: boolean,
    error?: string,
    loadMessage?: string,
    isShowSystemPrompt: boolean,
    promptsAndFilenames?: PromptAndFilename[],
    modelResponseSettings: ModelResponseSettings,
    children: JSX.Element[],
    setisSystemPrompt: React.Dispatch<React.SetStateAction<boolean>>,
    setModelResponseSettings: React.Dispatch<React.SetStateAction<ModelResponseSettings>>,
    loadModelAndSession(): Promise<void>
}

function Center({
    state,
    loaded,
    generatingResult,
    loading,
    error,
    loadMessage,
    isShowSystemPrompt,
    promptsAndFilenames,
    modelResponseSettings,
    children,
    setisSystemPrompt,
    setModelResponseSettings,
    loadModelAndSession
}: CenterProps): JSX.Element {
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

    return (
        <div className="flex flex-col p-[8px] pt-[8px] pb-[30px] h-screen w-full">
            {children[0]}
            {error ? (
                <div className="flex gap-[10px] w-full h-full items-center justify-center text-negative">
                    <Error />
                    {error}
                </div>
            ) : loading ? (
                <Loading progress={state.model.loadProgress}>{loadMessage}</Loading>
            ) : !loaded ? (
                <ModelSettings
                    loadModelAndSession={loadModelAndSession}
                    promptsAndFilenames={promptsAndFilenames}
                    modelResponseSettings={modelResponseSettings}
                    setModelResponseSettings={setModelResponseSettings}
                />
            ) : (
                <ChatArea
                    simplifiedChat={state.chatSession.simplifiedChat}
                    isShowSystemPrompt={isShowSystemPrompt}
                    generatingResult={generatingResult}
                />
            )}
            {children[1]}
        </div>
    );
}

export default Center;
