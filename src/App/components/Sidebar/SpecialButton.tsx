/// <reference types="vite-plugin-svgr/client" />

import {useState} from "react";
import Chat from "../../../icons/message.svg?react";
import Check from "../../../icons/check.svg?react";
import Cancel from "../../../icons/x.svg?react";
import Edit from "../../../icons/pencil.svg?react";
import Delete from "../../../icons/trash.svg?react";
import {Button} from "../../shadcncomponents/Button";

interface SpecialButtonProps {
    title: string,
    onClick?(...args: any): void
}

function SpecialButton({title, onClick}: SpecialButtonProps): JSX.Element {
    const [hoverEditDelete, setHoverEditDelete] = useState(false);
    const [hoverConfirmCancel, setHoverConfirmCancel] = useState(false);

    return (
        <div
            onClick={onClick}
            className="flex h-[40px] w-full p-[10px] rounded-[5px] text-cblack dark:text-cwhite bg-foreground-dark
      dark:bg-background-light text-[15px] select-none hover:bg-foreground-dark/60 hover:dark:bg-white/20
      active:bg-foreground-dark/40 active:dark:bg-white/30 cursor-pointer"
            onMouseEnter={() => setHoverEditDelete(true)}
            onMouseLeave={() => setHoverEditDelete(false)}
        >
            <Chat className="mr-[6px] size-[20px] text-primary overflow-visible" />
            <span className="truncate">{title}</span>

            {hoverEditDelete && !hoverConfirmCancel ? (
                <div className="flex flex-1 justify-end items-center">
                    <Button
                        size="icon_tight"
                        variant="transparent_full"
                        onClick={(e) => {
                            e.stopPropagation();
                            setHoverConfirmCancel(true);
                        }}
                    >
                        <Edit className="text-icon-gray size-[20px] " />
                    </Button>
                    <Button
                        size="icon_tight"
                        variant="transparent_full"
                        onClick={(e) => {
                            e.stopPropagation();
                            setHoverConfirmCancel(true);
                        }}
                    >
                        <Delete className="text-icon-gray size-[20px]" />
                    </Button>
                </div>
            ) : hoverConfirmCancel ? (
                <div className="flex flex-1 justify-end items-center">
                    <Button
                        size="icon_tight"
                        variant="transparent_full"
                        onClick={(e) => {
                            e.stopPropagation();
                            setHoverConfirmCancel(false);
                        }}
                    >
                        <Check className="text-positive size-[20px] " />
                    </Button>
                    <Button
                        size="icon_tight"
                        variant="transparent_full"
                        onClick={(e) => {
                            e.stopPropagation();
                            setHoverConfirmCancel(false);
                        }}
                    >
                        <Cancel className="text-negative size-[20px]" />
                    </Button>
                </div>
            ) : (
                ""
            )}
        </div>
    );
}

export default SpecialButton;
