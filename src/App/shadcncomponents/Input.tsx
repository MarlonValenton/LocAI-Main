import * as React from "react";
import {cva, VariantProps} from "class-variance-authority";
import {cn} from "../../lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {
    startIcon?: React.ReactNode,
    endIcon?: React.ReactNode,
    outerClassName?: string,
    autocomplete?: string
}

const inputVariants = cva(
    "flex w-full rounded-md px-3 py-1 text-sm border-border-gray placeholder:text-placeholder focus-visible:ring-primary focus-visible:ring-offset-1 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "border bg-white dark:bg-transparent",
                solid: "bg-white dark:bg-background-light drop-shadow-lg dark:drop-shadow-none"
            },
            inputSize: {
                default: "h-[40px]"
            }
        },
        defaultVariants: {
            variant: "default",
            inputSize: "default"
        }
    }
);

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({className, variant, inputSize, startIcon, endIcon, type, outerClassName, autocomplete, ...props}, ref) => {
        return (
            <div className={cn("flex w-full relative", outerClassName)}>
                {startIcon && <div className="absolute left-1 top-1/2 transform -translate-y-1/2 z-10">{startIcon}</div>}
                <input
                    type={type}
                    className={cn(inputVariants({variant, inputSize, className}), startIcon ? "pl-11" : "", endIcon ? "pr-11" : "")}
                    ref={ref}
                    {...props}
                />
                <div className="flex absolute items-center text-sm text-cblack/40 dark:text-cwhite/30 pl-11 pr-11 w-full h-full pointer-events-none select-none whitespace-nowrap">
                    <span className="overflow-hidden">{autocomplete}</span>
                </div>
                {endIcon && (
                    <div className="flex items-center justify-center absolute right-1 top-1/2 transform -translate-y-1/2">{endIcon}</div>
                )}
            </div>
        );
    }
);
Input.displayName = "Input";

export {Input};
