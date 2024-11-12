import * as React from "react";
import {Slot} from "@radix-ui/react-slot";
import {cva, type VariantProps} from "class-variance-authority";

import {cn} from "../../lib/utils";

const buttonVariants = cva(
    "text-[15px] rounded-[5px] w-full font-semibold font inline-flex items-center justify-center whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-primary text-cblack hover:bg-primary-hover active:bg-primary-pressed",
                demo_hover: "bg-primary-hover text-cblack",
                demo_pressed: "bg-primary-pressed text-cblack",

                outline: "border-[2px] border-primary bg-transparent text-primary hover:bg-primary-hover/10 active:bg-primary-pressed/20",
                demo_outline_hover: "border-[2px] border-primary bg-primary-hover/10 text-primary",
                demo_outline_pressed: "border-[2px] border-primary bg-primary-pressed/20 text-primary",

                positive: "bg-positive text-white hover:bg-positive-hover active:bg-positive-pressed",
                demo_positive_hover: "bg-positive-hover text-white",
                demo_positive_pressed: "bg-positive-pressed text-white",

                positive_outline:
                    "border-[2px] border-positive bg-transparent text-positive hover:bg-positive-hover/10 active:bg-positive-pressed/20",
                demo_positive_outline_hover: "border-[2px] border-positive text-positive bg-positive-hover/10",
                demo_positive_outline_pressed: "border-[2px] border-positive bg-transparent text-positive bg-positive-pressed/20",

                negative: "bg-negative text-white hover:bg-negative-hover active:bg-negative-pressed",
                demo_negative_hover: "bg-negative-hover text-white",
                demo_negative_pressed: "bg-negative-pressed text-white",

                negative_outline:
                    "border-[2px] bg-transparent border-negative text-negative hover:bg-negative-hover/10 active:bg-negative-pressed/20",
                demo_negative_outline_hover: "border-[2px] border-negative bg-negative-hover/10 text-negative",
                demo_negative_outline_pressed: "border-[2px] border-negative bg-negative-pressed/20 text-negative",

                transparent:
                    "bg-transparent justify-start hover:bg-black/10 active:bg-black/20 dark:hover:bg-white/10 dark:active:bg-white/20",
                demo_transparent_hover: "bg-black/5 dark:bg-white/10 justify-start",
                demo_transparent_pressed: "bg-transprent dark:bg-white/20 justify-start",

                transparent_full: "bg-transparent justify-center hover:bg-transparent hover:underline active:bg-transparent",

                // transparent: 'bg-transparent justify-start hover:bg-white/10 active:bg-white/20',
                // demo_transparent_hover: 'bg-white/10 justify-start',
                // demo_transparent_pressed: 'bg-white/20 justify-start',

                // Defaults
                destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
                secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline"
            },
            size: {
                default: "h-[40px] p-[10px]",
                default_square: "size-[40px] p-[10px]",
                sm: "h-8 rounded-md px-3 text-xs",
                lg: "h-10 rounded-md px-8",
                icon: "h-9 w-9",
                icon_tight: "w-fit h-fit p-1"
            }
        },
        defaultVariants: {
            variant: "default",
            size: "default"
        }
    }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({className, variant, size, asChild = false, ...props}, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({variant, size, className}))} ref={ref} {...props} />;
});
Button.displayName = "Button";

export {Button, buttonVariants};
