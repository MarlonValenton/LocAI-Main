import {Separator} from "../../shadcncomponents/Separator";

function StatusBarItems({
    display,
    separator = true
}: {
  display?: string,
  separator?: boolean
}): JSX.Element {
    return (
        <>
            <p>{display}</p>
            {separator && (
                <Separator orientation="vertical" className="border border-border-gray h-[24px]" />
            )}
        </>
    );
}

export default StatusBarItems;
