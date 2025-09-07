import { cn } from "@/lib/className";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import Spinner from "../ui/Spinner";

const buttonVariants = cva(
    "inline-flex items-center gap-2 font-secondary justify-center whitespace-nowrap rounded-full text-sm transition-colors focus-visible:outline-none select-none ease-in focus-visible:ring-1 disabled:pointer-events-none cursor-pointer ring-primary-200",
    {
      variants: {
        variant: {
          primary:
              "bg-primary-500 text-white hover:bg-primary-400 active:bg-primary-700 disabled:bg-opacity-40 ",
          secondary:
              "bg-white text-primary-500 hover:bg-primary-50 hover:border-opacity-60 disabled:text-dark-100 disabled:border-dark-100 border border-primary-500 active:text-primary-700 active:border-opacity-60 active:bg-primary-100",
          link: "text-primary-500 hover:text-primary-400 active:text-primary-700 disabled:text-dark-100",
          icon: "bg-white text-black hover:text-primary-500 active:text-primary-700 hover:bg-primary-50 active:bg-primary-100 disabled:text-dark-100 border-transparent",
          unstyled: "text-dark-400 disabled:text-dark-100",
        },
        size: {
          lg: "h-11 px-9 text-lg",
          md: "h-10 px-6 text-base font-medium",
          sm: "h-9 px-5 text-xs font-medium",
          xs: "h-8 px-4 text-xs ",
          icon: "h-9 w-9",
        },
      },
      defaultVariants: {
        variant: "primary",
        size: "md",
      },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
          className,
          variant,
          size,
          asChild = false,
          leftIcon,
          rightIcon,
          isLoading,
          ...props
        },
        ref
    ) => {
      const Comp = asChild ? Slot : "button";

      return (
          <Comp
              className={cn(buttonVariants({ variant, size, className }))}
              ref={ref}
              {...props}
          >
            <React.Fragment>
              {leftIcon && <span>{leftIcon}</span>}
              {props.children}
              {rightIcon && !isLoading && <span>{rightIcon}</span>}
              {isLoading && <Spinner />}
            </React.Fragment>
          </Comp>
      );
    }
);
Button.displayName = "Button";

export { buttonVariants };
export default Button;
