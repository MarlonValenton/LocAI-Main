import {Separator} from "../../shadcncomponents/Separator";

function StatusBarItems({display, separator = true}: {display?: string, separator?: boolean}): JSX.Element {
    return (
        <>
            <p className="flex flex-row justify-center truncate lg:w-[200px] 2xl:w-[290px]">{display}</p>
            {separator && <Separator orientation="vertical" className="border border-border-gray h-full" />}
        </>
    );
}

export default StatusBarItems;
