/// <reference types="vite-plugin-svgr/client" />

import {useState} from "react";
import {Input} from "../../../shadcncomponents/Input";
import Bolt from "../../../../icons/bolt.svg?react";
import Send from "../../../../icons/send.svg?react";
import Stop from "../../../../icons/player-stop.svg?react";
import {Button} from "../../../shadcncomponents/Button";
import {fetchGroqModels} from "../../../../lib/apiUtils";

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
    submitPrompt(): void,
    apiPrompt(): void
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
    submitPrompt,
    apiPrompt
}: BottomBarInputProps) {
    const [models, setModels] = useState<{ id: string; object: string }[]>([]);
    const [selectedModel, setSelectedModel] = useState<string | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);

    // Function to fetch models and toggle the dropdown
    const handleFetchModels = async () => {
        setShowDropdown(!showDropdown); // Toggle dropdown visibility
        if (!showDropdown) {
            const models = await fetchGroqModels(); // Call the updated function

            if (models) {
                setModels(models); // Update state with the models
            } else {
                console.error("No models available.");
            }
        }
    };
    return (
        <div>
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
                        onClick={handleFetchModels} // Fetch models on click
                    >
                        <Bolt className={`size-[23px] ${showDropdown ? "text-green-500" : "text-primary"}`}  />
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
                            <Send className="size-[23px]" onClick={apiPrompt} />
                        </Button>
                    )
                }
                disabled={disabled}
            />
            {/* Dropdown for models */}
            {showDropdown && (
                <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 mt-2 rounded shadow-lg max-h-[200px] overflow-y-auto z-50">
                    {models.length > 0 ? (
                        models.map((model) => (
                            <div
                                key={model.object}
                                className={`p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${
                                    selectedModel === model.id ? "bg-gray-300 dark:bg-gray-600" : ""
                                }`}
                                onClick={() => {
                                    setSelectedModel(model.id); // Set selected model
                                    setShowDropdown(false); // Hide dropdown
                                }}
                            >
                                {model.id}
                            </div>
                        ))
                    ) : (
                        <div className="p-2 text-gray-500">No models available</div>
                    )}
                </div>
            )}
        </div>
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

export {BottomBar, BottomBarInput, QuickSettingsItem};
