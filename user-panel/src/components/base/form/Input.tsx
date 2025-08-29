import * as React from "react";
import { cn } from "@/lib/className";
import { Icon } from "iconsax-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-md border border-dark-50 bg-transparent px-3 py-1 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-sm placeholder:text-dark-200 focus:border-primary-400 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 lg:h-9",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  startIcon?: Icon;
  endIcon?: Icon;
  containerClassName?: string;
  iconSize?: number;
}

const InputWithIcon = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      startIcon: StartIcon,
      endIcon: EndIcon,
      containerClassName,
      iconSize = 18,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={cn("relative w-full text-black", containerClassName)}>
        {StartIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 transform">
            <StartIcon size={iconSize} className="text-muted-foreground" />
          </div>
        )}
        <input
          type={type}
          className={cn(
            "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-xl border border-dark-50 px-4 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
            StartIcon ? "pl-12" : "",
            EndIcon ? "pr-12" : "",
            className,
          )}
          ref={ref}
          {...props}
        />
        {EndIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 transform">
            <EndIcon className="text-muted-foreground" size={iconSize} />
          </div>
        )}
      </div>
    );
  },
);
InputWithIcon.displayName = "InputWithIcon";

export { InputWithIcon };

export default Input;
