import {useState} from "react";

await window.ai.loadModel();

function Chat(): JSX.Element {
    const [prompt, setInput] = useState("");
    const [response, setResponse] = useState("");
    const [callbackOnce, setOnce] = useState(false);

    if (!callbackOnce) {
        window.ai.setResponseCallback(setResponse);
        setOnce(true);
    }

    async function sendMessage(): Promise<void> {
        setResponse("");
        window.ai.submitPrompt(prompt);
    }

    return (
        <div className="flex flex-col font-display h-screen bg-background items-center justify-center">
            <label className="font-extrabold text-6xl text-white select-none">LocAi</label>
            <input
                className="rounded w-[800px] p-1 m-5 bg-background-light placeholder:text-placeholder"
                value={prompt}
                placeholder="Enter message"
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key == "Enter" && sendMessage()}
            ></input>
            <div className="w-[800px] h-[400px] bg-foreground drop-shadow-xl mt-10 p-5">
                <p className="text-white z-10 whitespace-pre-wrap">{response}</p>
            </div>
        </div>
    );
}

export default Chat;
