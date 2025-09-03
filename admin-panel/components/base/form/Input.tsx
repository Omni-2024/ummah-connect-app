import * as React from "react";
import { cn } from "@/lib/className";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <div className="flex flex-col w-full">
        <input
          type={type}
          className={cn(
            "flex h-12 w-full rounded-xl border border-dark-50 bg-transparent px-3 py-1 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-sm placeholder:text-dark-200 focus:border-primary-400 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50",
            className,
            props.error && "!border-status-red"
          )}
          ref={ref}
          {...props}
        />
        <div className="text-status-red text-xs">{props.error}</div>
      </div>
    );
  }
);
Input.displayName = "Input";

export default Input;
