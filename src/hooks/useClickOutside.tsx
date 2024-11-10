import {MouseEvent, RefObject, useEffect} from "react";

function useClickOutside(ref: RefObject<Element>, callback: () => void) {
    useEffect(() => {
        function handleClickOutside(event: MouseEvent | any) {
            if (event.target instanceof Node && ref.current && !ref.current.contains(event.target)) {
                callback();
            }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);
}

export default useClickOutside;
