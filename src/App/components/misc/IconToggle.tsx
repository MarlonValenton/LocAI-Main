import {ReactElement, useState, forwardRef, useEffect} from "react";
import {cn} from "../../../lib/utils";

interface IconToggleProps {
    startState?: boolean,
    disabled?: boolean,
    cursor?: boolean,
    children: [ReactElement<IconToggleOnStateProps>, ReactElement<IconToggleOffStateProps>],
    onChangeValue?(value: boolean): void
}
const IconToggle = forwardRef(function IconToggle(
    {startState = true, disabled = false, cursor = false, onChangeValue, children}: IconToggleProps,
    ref
) {
    const [isOn, setIsOn] = useState<boolean>(startState);

    useEffect(() => {
        setIsOn(startState);
    }, [startState]);
    return (
        <div
            className={cn(
                "text-primary disabled:text-primary/40 size-[24px]",
                disabled ? "text-primary/40" : "",
                cursor ? "cursor-pointer" : ""
            )}
            onClick={() => {
                if (!disabled) {
                    setIsOn((value) => !value);
                    onChangeValue ? onChangeValue(!isOn) : null;
                }
            }}
        >
            {isOn ? children[0] : children[1]}
            {/* {isOn
                ? children.find(({type}) => type.toString() === IconToggleOnState.toString())
                : children.find(({type}) => type.toString() === IconToggleOffState.toString())} */}
        </div>
    );
});
interface IconToggleOnStateProps {
    children?: React.ReactNode
}
const IconToggleOnState: React.FC<IconToggleOnStateProps> = ({children}) => {
    return <div>{children}</div>;
};

interface IconToggleOffStateProps {
    children?: React.ReactNode
}
const IconToggleOffState: React.FC<IconToggleOffStateProps> = ({children}) => {
    return <div>{children}</div>;
};

export {IconToggleOnState, IconToggleOffState, IconToggle};
