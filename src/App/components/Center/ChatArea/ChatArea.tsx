import {forwardRef} from "react";
import {ChatHistoryItem} from "node-llama-cpp";
import {LlmState} from "../../../../../electron/state/llmState.ts";
import ChatSingle from "./ChatSingle";

interface ChatHistoryProps {
    simplifiedChat?: LlmState["chatSession"]["simplifiedChat"],
    chatHistory?: ChatHistoryItem[],
    isShowSystemPrompt: boolean
}

const ChatArea = forwardRef<HTMLDivElement, ChatHistoryProps>(
    ({simplifiedChat, chatHistory, isShowSystemPrompt}: ChatHistoryProps, ref) => {
        return (
            <div ref={ref} className="flex flex-col h-full w-full overflow-y-auto">
                {simplifiedChat
                    ? simplifiedChat.map((item, index) => {
                        if ((item.type !== "system" && !isShowSystemPrompt) || isShowSystemPrompt) {
                            return (
                                <ChatSingle key={index} index={index} type={item.type}>
                                    {item.message}
                                </ChatSingle>
                            );
                        } else return <></>;
                    })
                    : chatHistory!.map((item, index) => {
                        if ((item.type !== "system" && !isShowSystemPrompt) || isShowSystemPrompt) {
                            return (
                                <ChatSingle index={index} type={item.type}>
                                    {item.type === "model" ? item.response[0]!.toString() : item.text.toString()}
                                </ChatSingle>
                            );
                        } else return <></>;
                    })}
            </div>
        );
    }
);

export default ChatArea;
