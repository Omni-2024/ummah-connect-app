import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/className";

const iconButtonVariants = cva(
  "inline-flex items-center gap-2 font-secondary justify-center whitespace-nowrap rounded-full transition-colors focus-visible:outline-none select-none ease-in focus-visible:ring-1 disabled:pointer-events-none outline-none",
  {
    variants: {
      variant: {
        primary:
          "bg-primary-500 text-white hover:bg-primary-400 active:bg-primary-700 disabled:bg-dark-100",
        secondary:
          "bg-white text-black hover:text-primary-500 hover:bg-primary-50 disabled:text-dark-100 active:text-primary-700 active:border-transparent active:bg-primary-100",
        outline:
          "border border-primary-500 text-primary-500 hover:bg-primary-50 active:bg-primary-100 disabled:text-dark-100 disabled:border-dark-100",
      },
      size: {
        sm: "size-6 text-xs",
        md: "size-8 text-sm",
        lg: "size-10 text-base",
      },
    },
    defaultVariants: {
      variant: "secondary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  asChild?: boolean;
}

const IconButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(iconButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {props.children}
      </Comp>
    );
  },
);
IconButton.displayName = "IconButton";

export { iconButtonVariants };
export default IconButton;
