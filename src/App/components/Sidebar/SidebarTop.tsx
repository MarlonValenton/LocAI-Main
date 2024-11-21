/// <reference types="vite-plugin-svgr/client" />

import {Button} from "../../shadcncomponents/Button";
import {Input} from "../../shadcncomponents/Input";
import FolderPlus from "../../../icons/folder-plus.svg?react";

interface SidebarTopProps {
    children?: JSX.Element | JSX.Element[],
    setInputValue: React.Dispatch<React.SetStateAction<string>>
}
function SidebarTop({children, setInputValue}: SidebarTopProps) {
    return (
        <div className="flex-none px-[8px] pt-[8px]">
            <div className="flex flex-row mb-[12px]">
                {children}
                <Button size="default_square">
                    <FolderPlus className="size-icon" />
                </Button>
            </div>
            <Input placeholder="Search..." onChange={(e) => setInputValue(e.target.value)} />
        </div>
    );
}

interface SidebarTopButtonProps {
    children?: JSX.Element | JSX.Element[]
}
function SidebarTopButton({children}: SidebarTopButtonProps) {
    return <div className="w-full mr-[13px]">{children}</div>;
}

export {SidebarTop, SidebarTopButton};
