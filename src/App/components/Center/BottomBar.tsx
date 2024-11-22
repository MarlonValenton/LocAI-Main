/// <reference types="vite-plugin-svgr/client" />

import {Input} from "../../shadcncomponents/Input";
import Bolt from "../../../icons/bolt.svg?react";
import Send from "../../../icons/send.svg?react";
import Stop from "../../../icons/player-stop.svg?react";
import {Button} from "../../shadcncomponents/Button";

interface BottomBarProps {
    children?: JSX.Element | JSX.Element[]
}

function BottomBar({children}: BottomBarProps): JSX.Element {
    return <div className="flex flex-col justify-center items-center mt-5 [&>*:not(:last-child)]:mb-[15px]">{children}</div>;
}

interface BottomBarInputProps {
    disabled?: boolean,
    inputRef: React.RefObject<HTMLInputElement>,
    inputText: string,
    autocompleteText: string,
    generatingResult: boolean,
    isDarkMode: boolean,
    onInput(): void,
    onInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void,
    stopGeneration?(): void,
    submitPrompt(): void
}

function BottomBarInput({
    disabled,
    inputRef,
    inputText,
    autocompleteText,
    generatingResult,
    isDarkMode,
    onInput,
    onInputKeyDown,
    stopGeneration,
    submitPrompt
}: BottomBarInputProps) {
    console.log(document.querySelector("html")?.classList.value === "dark");

    return (
        <Input
            ref={inputRef}
            onInput={onInput}
            onKeyDownCapture={onInputKeyDown}
            autoComplete="off"
            spellCheck
            outerClassName="max-w-[900px]"
            variant={isDarkMode ? "solid" : "default"}
            autocomplete={inputText + autocompleteText}
            placeholder={inputText + autocompleteText === "" ? "Type a message..." : ""}
            startIcon={
                <Button
                    variant="transparent_full"
                    size="icon_tight"
                    className="text-primary p-[5px] rounded-[5px] hover:bg-black/5 dark:hover:bg-white/10"
                    disabled={disabled}
                >
                    <Bolt className="size-[23px]" />
                </Button>
            }
            endIcon={
                generatingResult ? (
                    <Button
                        variant="transparent_full"
                        size="icon_tight"
                        className="text-primary p-[5px] rounded-[5px] hover:bg-black/5 dark:hover:bg-white/10"
                        disabled={disabled}
                    >
                        <Stop className="size-[23px]" onClick={stopGeneration} />
                    </Button>
                ) : (
                    <Button
                        variant="transparent_full"
                        size="icon_tight"
                        className="text-primary p-[5px] rounded-[5px] hover:bg-black/5 dark:hover:bg-white/10"
                        disabled={disabled || !inputText}
                    >
                        <Send className="size-[23px]" onClick={submitPrompt} />
                    </Button>
                )
            }
            disabled={disabled}
        />
    );
}

interface QuickSettingsProps {
    children?: JSX.Element[] | JSX.Element
}
function QuickSettings({children}: QuickSettingsProps): JSX.Element {
    return (
        <>
            <div className="flex flex-row items-center justify-center w-[500px] bg-foreground h-[40px] rounded-[5px] [&>*:not(:last-child)]:mr-5">
                {children}
            </div>
        </>
    );
}

interface QuickSettingsItemProps {
    icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>,
    onClick?(...args: any): void
}

function QuickSettingsItem({icon, onClick}: QuickSettingsItemProps): JSX.Element {
    const Icon = icon;
    return (
        <Button size="icon_tight" variant="transparent_full" onClick={onClick}>
            <Icon className="size-icon text-primary" />
        </Button>
    );
}

export {BottomBar, BottomBarInput, QuickSettings, QuickSettingsItem};
