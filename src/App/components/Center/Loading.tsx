/// <reference types="vite-plugin-svgr/client" />

import Loader from "../../../icons/loader-2.svg?react";
import {Progress} from "../../shadcncomponents/progress";

interface LoadingProps {
    progress?: number,
    children?: JSX.Element | JSX.Element[] | string
}
function Loading({progress, children}: LoadingProps) {
    return (
        <div className="flex flex-col gap-[30px] justify-center items-center w-full h-full select-none">
            <div className="flex gap-[10px] items-center">
                <Loader className="size-[24px] text-primary animate-spin" />
                {children}
            </div>
            {progress !== 1 ? (
                <Progress value={progress! * 100} className="w-[50%] h-[10px]" />
            ) : (
                <Progress value={progress! * 100} className="w-[50%] h-[10px] invisible" />
            )}
        </div>
    );
}

export default Loading;
