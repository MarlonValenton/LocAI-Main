/// <reference types="vite-plugin-svgr/client" />

import {useState, useEffect} from "react";
import Empty from "../../../icons/mist-off.svg?react";
import ChatSessionAndFilename from "../../../interfaces/ChatSessionAndFilename";
import PromptAndFilename from "../../../interfaces/PromptAndFilename";
import {cn} from "../../../lib/utils";
import {EditItemValues} from "../../../interfaces/EditItemValues";
import SpecialButton from "./SpecialButton";

interface SidebarCenterProps {
    items?: ChatSessionAndFilename[] | PromptAndFilename[],
    inputValue: string,
    selectedIndex?: number,
    isDarkMode?: boolean,
    setSelectedIndex: React.Dispatch<React.SetStateAction<number | undefined>>,
    OnSelectItem(index: number): void,
    renameItem(index: number, values: EditItemValues): void,
    editItem(index: number, values: EditItemValues): void,
    deleteItem(index: number): void,
    exportItem(index: number): void
}
function SidebarCenter({
    items,
    inputValue,
    selectedIndex,
    isDarkMode,
    setSelectedIndex,
    OnSelectItem,
    renameItem,
    editItem,
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
                items ? ((items![0]! as unknown as PromptAndFilename[]) ? "pb-[8px]" : "") : ""
            )}
            style={{scrollbarGutter: "stable"}}
        >
            {filteredItems?.length ? (
                filteredItems?.map((item, index) => (
                    <SpecialButton
                        item={item}
                        key={index}
                        index={index}
                        disabled={"chatSession" in item ? (index === selectedIndex ? true : false) : undefined}
                        isDarkMode={isDarkMode!}
                        onClick={() => {
                            setSelectedIndex(index);
                            OnSelectItem(index);
                        }}
                        renameItem={renameItem}
                        editItem={editItem}
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
