import {TooltipContent} from "../../shadcncomponents/tooltip";

interface InfoPopover {
    children: JSX.Element | JSX.Element[]
}
function InfoTooltip({children}: InfoPopover): JSX.Element {
    return (
        <TooltipContent className="text-[12px] flex flex-col gap-[15px] w-[400px]" align="start" side="right">
            <div className="flex flex-col gap-[10px] px-[15px] pt-[15px]">{children}</div>
            <div className="text-right italic px-[10px] pb-[10px]">source: node-llama-cpp.withcat.ai</div>
        </TooltipContent>
    );
}

export default InfoTooltip;
