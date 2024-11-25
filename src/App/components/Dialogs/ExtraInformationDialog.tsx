import {cn} from "../../../lib/utils";

interface ExtraInformationDialogProps {
    baseClassName?: string,
    contentClassName?: string,
    items: Array<[any, any]>
}
export default function ExtraInformationDialog({baseClassName, contentClassName, items}: ExtraInformationDialogProps) {
    return (
        <div
            className={cn("w-[40%] absolute top-[0%] right-[105%] bg-background rounded-[10px] h-fit", baseClassName ? baseClassName : "")}
        >
            <div className="font-semibold text-lg border-b-[1px] border-b-border-gray px-[15px] pt-[15px] pb-[10px] select-none">
                File Information
            </div>
            <div
                className={cn(
                    "flex flex-col gap-[10px] px-[15px] pt-[10px] pb-[15px] break-words overflow-auto",
                    contentClassName ? contentClassName : ""
                )}
            >
                {items.map((value, index) => (
                    <div className="flex flex-col leading-tight" key={index}>
                        <span className="font-semibold">{value[0]}</span> {value[1]}
                    </div>
                ))}
            </div>
        </div>
    );
}
