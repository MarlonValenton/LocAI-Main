/// <reference types="vite-plugin-svgr/client" />

import Loader from "../../../icons/loader-2.svg?react";

function Loading() {
    return (
        <div className="flex justify-center items-center w-full h-full">
            <Loader className="size-10 text-primary animate-spin" />
        </div>
    );
}

export default Loading;
