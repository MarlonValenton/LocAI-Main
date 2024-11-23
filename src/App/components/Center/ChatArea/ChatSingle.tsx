/// <reference types="vite-plugin-svgr/client" />

import Markdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import {nightOwl, defaultStyle} from "react-syntax-highlighter/dist/esm/styles/hljs";
import {useState} from "react";
import Robot from "../../../../icons/robot.svg?react";
import User from "../../../../icons/user.svg?react";
import Copy from "../../../../icons/copy.svg?react";
import Check from "../../../../icons/check.svg?react";
import System from "../../../../icons/device-desktop.svg?react";
import {cn} from "../../../../lib/utils";

type ChatSingleProps = {
    type: string,
    index: number,
    children: string,
    isDarkMode: boolean
};

function ChatSingle({children, type = "user", index = 0, isDarkMode}: ChatSingleProps) {
    const [isCopyClicked, setIsCopyClicked] = useState<boolean>(false);

    return (
        <div className={cn("w-full bg-foreground py-[20px] px-[10%]", index % 2 === 0 ? "bg-foreground" : "bg-transparent")}>
            <div className="flex">
                <div className="text-primary h-full mr-[30px]">
                    {type === "user" ? (
                        <User className="size-[30px]" />
                    ) : type === "system" ? (
                        <System className="size-[30px]" />
                    ) : (
                        <Robot className="size-[30px]" />
                    )}
                </div>
                <Markdown
                    className="prose dark:prose-invert flex-grow max-w-none w-0"
                    components={{
                        code(props) {
                            const {children, className, ...rest} = props;
                            const match = /language-(\w+)/.exec(className || "");
                            return match ? (
                                <div className="relative">
                                    <SyntaxHighlighter
                                        children={String(children).replace(/\n$/, "")}
                                        language={match[1]}
                                        style={isDarkMode ? nightOwl : defaultStyle}
                                        customStyle={{
                                            backgroundColor: "transparent",
                                            margin: "0px",
                                            padding: "0px",
                                            fontSize: "unset",
                                            width: "100%"
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
                                            <Check className="size-[30px] p-[5px] rounded-[5px] hover:bg-foreground dark:hover:bg-background-light" />
                                        ) : (
                                            <Copy className="size-[30px] p-[5px] rounded-[5px] hover:bg-foreground dark:hover:bg-background-light" />
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
