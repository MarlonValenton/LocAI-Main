/// <reference types="vite-plugin-svgr/client" />

import {Input} from "../../shadcncomponents/Input";
import {Separator} from "../../shadcncomponents/Separator";
import FolderPlus from "../../../icons/folder-plus.svg?react";
import Plus from "../../../icons/plus.svg?react";
import Empty from "../../../icons/mist-off.svg?react";
import {Button} from "../../shadcncomponents/Button";
import {ExportDialogType} from "../../../interfaces/dialog";
import ChatSessionAndFilename from "../../../interfaces/ChatSessionAndFilename";
import SpecialButton from "./SpecialButton";

interface SideBarProps {
    mainButton: string,
    items?: ChatSessionAndFilename[],
    children?: JSX.Element,
    mainButtonFunction(...args: any): void,
    OnSelectItem(index: number): void,
    renameItem(event: React.KeyboardEvent, index: number, chatSessionName: string, callback: () => void): void,
    deleteItem(index: number): void,
    exportItem(type: ExportDialogType, index: number): void
}

function Sidebar({
    mainButton,
    items,
    children,
    mainButtonFunction,
    OnSelectItem,
    renameItem,
    deleteItem,
    exportItem
}: SideBarProps): JSX.Element {
    let justify = "";
    if (!items?.length) {
        justify = "justify-center";
    }

    return (
        <div className="flex flex-col w-[260px] p-[8px] [&>*:not(:last-child)]:mb-[12px] bg-foreground h-screen flex-none">
            <div className="flex-none">
                <div className="flex flex-row mb-[12px]">
                    <Button className="w-full mr-[13px]" onClick={() => mainButtonFunction()}>
                        <Plus className="size-icon mr-[5px]" />
                        <p>{mainButton}</p>
                    </Button>
                    <Button size="default_square">
                        <FolderPlus className="size-icon" />
                    </Button>
                </div>
                <Input placeholder="Search..." />
            </div>
            <Separator />
            <div className={`flex flex-col flex-grow items-center ${justify} text-icon-gray [&>*:not(:last-child)]:mb-[10px]`}>
                {items?.length ? (
                    items?.map((item, index) => (
                        <SpecialButton
                            item={item}
                            key={index}
                            index={index}
                            onClick={OnSelectItem}
                            onEnter={renameItem}
                            onDelete={deleteItem}
                            exportItem={() => {
                                if (mainButton.includes("chat")) {
                                    exportItem("chat session", index);
                                } else {
                                    exportItem("prompt", index);
                                }
                            }}
                        />
                    ))
                ) : (
                    <>
                        <Empty className="size-[30px]" />
                        <p className="select-none">No Data.</p>
                    </>
                )}
                {/* {items?.map((title, index) => <SpecialButton title={title} key={index} onClick={() => OnSelectItem(index)} />)}
                <Empty className="size-[30px]" />
                <p className="select-none">No Data.</p> */}
            </div>

            {children && (
                <>
                    <Separator />
                    {children}
                </>
            )}
        </div>
    );
}

export default Sidebar;
