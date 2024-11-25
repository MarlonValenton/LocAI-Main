/// <reference types="vite-plugin-svgr/client" />

import LeftArrowBar from "../../../icons/arrow-bar-left.svg?react";
import RightArrowBar from "../../../icons/arrow-bar-right.svg?react";

function StatusBar({children}: {children?: JSX.Element[] | JSX.Element}): JSX.Element {
    return (
        <div className="flex flex-row h-[40px] flex-shrink-0 items-center justify-center gap-[5px]">
            {/* <LeftArrowBar className="text-primary" /> */}
            <div className="flex flex-row flex-grow border border-border-gray dark:border-none bg-white dark:bg-background-light p-[10px] rounded-[5px] h-full items-center justify-center gap-[10px]">
                {children}
            </div>
            {/* <RightArrowBar className="text-primary" /> */}
        </div>
    );
}

export default StatusBar;
