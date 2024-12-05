/// <reference types="vite-plugin-svgr/client" />

import {useEffect, useState} from "react";
import {LlmState} from "../../../../electron/state/llmState";
import Error from "../../../icons/exclamation-circle.svg?react";
import ModelResponseSettings from "../../../interfaces/ModelResponseSettings";
import ModelSettings from "./ModelSettings/ModelSettings";
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
    modelResponseSettings: ModelResponseSettings,
    isDarkMode: boolean,
    children: JSX.Element[],
    setisSystemPrompt: React.Dispatch<React.SetStateAction<boolean>>,
    setModelResponseSettings: React.Dispatch<React.SetStateAction<ModelResponseSettings>>,
    loadModelAndSession(): Promise<void>,
    apiPrompt(): void,
    groqApiResponse: string,
    prompt: string
}

function Center({
    state,
    loaded,
    generatingResult,
    loading,
    error,
    loadMessage,
    isShowSystemPrompt,
    modelResponseSettings,
    isDarkMode,
    children,
    setisSystemPrompt,
    setModelResponseSettings,
    loadModelAndSession,
    apiPrompt,
    groqApiResponse,
    prompt
}: CenterProps): JSX.Element {
    const [systemPromptChecked, setSystemPromptChecked] = useState<boolean>(false);

    useEffect(() => {
        if (!systemPromptChecked) {
            if (state.chatSession.simplifiedChat.length) {
                state.chatSession.simplifiedChat.some((item) => {
                    if (item.type === "system") {
                        setisSystemPrompt(true);
                        console.log("System is supported");
                        return true;
                    } else {
                        setisSystemPrompt(false);
                        console.log("System is not supported");
                        return false;
                    }
                });

                setSystemPromptChecked(true);
                console.log("Set systemPromptChecked to true");
            } else setisSystemPrompt(false);
        }
    }, [generatingResult]);

    useEffect(() => {
        if (!loaded) {
            setSystemPromptChecked(false);
            console.log("Set systemPromptChecked to false");
        }
    }, [loaded]);

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
                    modelResponseSettings={modelResponseSettings}
                    loaded={loaded}
                    setModelResponseSettings={setModelResponseSettings}
                />
            ) : (
                <ChatArea
                    simplifiedChat={state.chatSession.simplifiedChat}
                    isShowSystemPrompt={isShowSystemPrompt}
                    generatingResult={generatingResult}
                    isDarkMode={isDarkMode}
                    apiPrompt={apiPrompt}
                    groqApiResponse={groqApiResponse}
                    prompt={prompt}
                />
            )}
            {children[1]}
        </div>
    );
}

export default Center;
