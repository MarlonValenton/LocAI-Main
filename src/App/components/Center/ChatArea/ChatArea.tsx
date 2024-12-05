import {useCallback, useEffect, useRef, useState} from "react";
import {ChatHistoryItem} from "node-llama-cpp";
import {LlmState} from "../../../../../electron/state/llmState.ts";
import ChatSingle from "./ChatSingle";

interface ChatHistoryProps {
    simplifiedChat?: LlmState["chatSession"]["simplifiedChat"],
    chatHistory?: ChatHistoryItem[],
    isShowSystemPrompt: boolean,
    generatingResult?: boolean,
    isDarkMode: boolean
    apiPrompt():void,
    groqApiResponse:string,
    prompt:string
}

function ChatArea({simplifiedChat, chatHistory, isShowSystemPrompt, generatingResult, isDarkMode, groqApiResponse, prompt}: ChatHistoryProps) {
    const chatAreaRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        console.log("Scrolling to bottom");

        if (generatingResult) {
            scrollToBottom();
        }
    }, [generatingResult]);

    useEffect(() => {
        console.log("Scroll height changed");

        if (isScrolledToTheBottom()) {
            scrollToBottom();
        }
    }, [chatAreaRef.current?.scrollHeight]);

    const scrollToBottom = useCallback(() => {
        if (chatAreaRef.current != null) {
            chatAreaRef.current!.scrollTop = chatAreaRef.current.scrollHeight;
        }
    }, [chatAreaRef]);

    const isScrolledToTheBottom = useCallback(() => {
        if (chatAreaRef.current != null) {
            return chatAreaRef.current!.clientHeight / (chatAreaRef.current!.scrollHeight - chatAreaRef.current!.scrollTop) > 0.85;
        }

        return true;
    }, [chatAreaRef]);

    return (
        <div ref={chatAreaRef} className="flex flex-col h-full w-full overflow-y-auto">
            {simplifiedChat
                ? simplifiedChat.map((item, index) => {
                    if ((item.type !== "system" && !isShowSystemPrompt) || isShowSystemPrompt) {
                        return (
                            <ChatSingle key={index} index={index} type={item.type} isDarkMode={isDarkMode}>
                                {item.message}
                            </ChatSingle>
                        );
                    } else return "";
                })
                : chatHistory!.map((item, index) => {
                    if ((item.type !== "system" && !isShowSystemPrompt) || isShowSystemPrompt) {
                        return (
                            <ChatSingle key={index} index={index} type={item.type} isDarkMode={isDarkMode}>
                                {item.type === "model" ? item.response[0]!.toString() : item.text.toString()}
                            </ChatSingle>
                        );
                    } else return "";
                })
            }
            {groqApiResponse ? (
                <ChatSingle index={chatHistory?.length || 0} type="model" isDarkMode={isDarkMode}>
                    {`${prompt}
                            \nResponse: ${groqApiResponse}`}
                </ChatSingle>
            ) : (
                ""
            )}
        </div>
    );
}

export default ChatArea;
