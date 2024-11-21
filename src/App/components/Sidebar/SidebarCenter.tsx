/// <reference types="vite-plugin-svgr/client" />

import {useState, useEffect} from "react";
import Empty from "../../../icons/mist-off.svg?react";
import ChatSessionAndFilename from "../../../interfaces/ChatSessionAndFilename";
import PromptAndFilename from "../../../interfaces/PromptAndFilename";
import {cn} from "../../../lib/utils";
import SpecialButton from "./SpecialButton";

interface SidebarCenterProps {
    items?: ChatSessionAndFilename[] | PromptAndFilename[],
    inputValue: string,
    indexDisabled?: number,
    setIndexDisabled: React.Dispatch<React.SetStateAction<number | undefined>>,
    OnSelectItem(index: number): void,
    renameItem(event: React.KeyboardEvent, index: number, itemName: string): void,
    deleteItem(index: number): void,
    exportItem(index: number): void
}
function SidebarCenter({
    items,
    inputValue,
    indexDisabled,
    setIndexDisabled,
    OnSelectItem,
    renameItem,
    deleteItem,
    exportItem
}: SidebarCenterProps): JSX.Element {
    const [filteredItems, setFilteredItems] = useState<ChatSessionAndFilename[] | PromptAndFilename[]>();

    useEffect(() => {
        if (inputValue !== "" && items) {
            let newItems;

            if ("chatSession" in items[0]! && (items as ChatSessionAndFilename[])) {
                newItems = items?.filter((item) => {
                    return (item as ChatSessionAndFilename).chatSession.name.toLowerCase().includes(inputValue.toLowerCase());
                });
            } else if ("prompt" in items[0]! && (items as PromptAndFilename[])) {
                newItems = items?.filter((item) => {
                    return (item as PromptAndFilename).prompt.name.toLowerCase().includes(inputValue.toLowerCase());
                });
            }

            setFilteredItems(newItems as ChatSessionAndFilename[] | PromptAndFilename[]);
        } else setFilteredItems(items);
    }, [inputValue, items]);

    return (
        <div
            className={cn(
                "flex flex-col flex-grow pl-[8px] items-center text-icon-gray [&>*:not(:last-child)]:mb-[10px] overflow-auto",
                !filteredItems?.length ? "justify-center" : "",
                (items![0]! as unknown as PromptAndFilename[]) ? "pb-[8px]" : ""
            )}
            style={{scrollbarGutter: "stable"}}
        >
            {filteredItems?.length ? (
                filteredItems?.map((item, index) => (
                    <SpecialButton
                        item={item}
                        key={index}
                        index={index}
                        disabled={index === indexDisabled ? true : false}
                        onClick={() => {
                            setIndexDisabled(index);
                            OnSelectItem(index);
                        }}
                        renameItem={renameItem}
                        deleteItem={deleteItem}
                        exportItem={() => exportItem(index)}
                    />
                ))
            ) : (
                <>
                    <Empty className="size-[30px]" />
                    <p className="select-none">No Data.</p>
                </>
            )}
        </div>
    );
}

export {SidebarCenter};
