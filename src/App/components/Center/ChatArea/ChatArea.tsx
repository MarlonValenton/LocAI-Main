import {forwardRef} from "react";
import {LlmState} from "../../../../../electron/state/llmState.ts";
import ChatSingle from "./ChatSingle";

interface ChatHistoryProps {
    simplifiedChat: LlmState["chatSession"]["simplifiedChat"]
}

const ChatArea = forwardRef<HTMLDivElement, ChatHistoryProps>(({simplifiedChat}: ChatHistoryProps, ref) => {
    return (
        <div ref={ref} className="flex flex-col h-full w-full overflow-y-auto">
            {simplifiedChat.map((item, index) => (
                <ChatSingle key={index} index={index} type={item.type}>
                    {item.message}
                </ChatSingle>
            ))}
        </div>
    );
});

export default ChatArea;
