/// <reference types="vite-plugin-svgr/client" />

import Markdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import {nightOwl, defaultStyle} from "react-syntax-highlighter/dist/esm/styles/hljs";
import {useState} from "react";
import Robot from "../../../../icons/robot.svg?react";
import User from "../../../../icons/user.svg?react";
import Copy from "../../../../icons/copy.svg?react";
import Check from "../../../../icons/check.svg?react";

type ChatSingleProps = {
    type: string,
    index: number,
    children: string
};

function ChatSingle({children, type = "user", index = 0}: ChatSingleProps) {
    const [isCopyClicked, setIsCopyClicked] = useState<boolean>(false);
    const isDark = document.querySelector("html")?.classList.contains("dark");
    let backgroundColor;

    if (index % 2 === 1) {
        backgroundColor = "foreground";
    } else {
        backgroundColor = "transparent";
    }

    return (
        <div className={`w-full bg-foreground py-[20px] px-[10%] bg-${backgroundColor}`}>
            <div className="flex w-full">
                <div className="text-primary h-full mr-[30px]">
                    {type === "user" ? <User className="size-[30px]" /> : <Robot className="size-[30px]" />}
                </div>
                <Markdown
                    className="prose dark:prose-invert max-w-full"
                    components={{
                        code(props) {
                            const {children, className, ...rest} = props;
                            const match = /language-(\w+)/.exec(className || "");
                            return match ? (
                                <div className="relative">
                                    <SyntaxHighlighter
                                        children={String(children).replace(/\n$/, "")}
                                        language={match[1]}
                                        style={isDark ? nightOwl : defaultStyle}
                                        customStyle={{
                                            backgroundColor: "transparent",
                                            margin: "0px",
                                            padding: "0px",
                                            fontSize: "unset"
                                        }}
                                    />
                                    <button
                                        className="absolute top-0 right-0 z-1 text-icon-gray"
                                        onClick={() => {
                                            if (!isCopyClicked) {
                                                setIsCopyClicked(true);
                                                setTimeout(() => {
                                                    setIsCopyClicked(false);
                                                }, 2000);
                                                navigator.clipboard.writeText(String(children).replace(/\n$/, ""));
                                            }
                                        }}
                                    >
                                        {isCopyClicked ? (
                                            <Check className="size-[25px] p-[5px] rounded-[5px] hover:bg-foreground dark:hover:bg-background-light" />
                                        ) : (
                                            <Copy className="size-[25px] p-[5px] rounded-[5px] hover:bg-foreground dark:hover:bg-background-light" />
                                        )}
                                    </button>
                                </div>
                            ) : (
                                <code {...rest} className={className}>
                                    {children}
                                </code>
                            );
                        }
                    }}
                >
                    {children}
                </Markdown>
            </div>
        </div>
    );
}

export default ChatSingle;
