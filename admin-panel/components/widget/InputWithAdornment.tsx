import {Separator} from "@/components/base/separator";
import { cn } from "@/lib/className";
import type React from "react";
import { forwardRef } from "react";

export interface InputWithAdornmentProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  containerClassName?: string;
  error?: string;
}

const InputWithAdornment = forwardRef<
  HTMLInputElement,
  InputWithAdornmentProps
>(
  (
    {
      className,
      type,
      startAdornment,
      endAdornment,
      containerClassName,
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={cn("relative flex items-center w-full", containerClassName)}
      >
        {startAdornment && (
          <>
            <span
              className={cn(
                "absolute right-0 pr-3 text-sm text-muted-foreground",
                props.disabled && "opacity-50"
              )}
            >
              {startAdornment}
            </span>
          </>
        )}
        <input
          type={type}
          className={cn(
            "h-10 w-fit rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            startAdornment ? "pr-10" : "",
            endAdornment ? "pl-10" : "",
            className,
            props.error && "!border-status-red"
          )}
          ref={ref}
          {...props}
        />

        {endAdornment && (
          <span
            className={cn(
              "absolute left-0 pl-3 text-sm text-muted-foreground flex items-center gap-2",
              props.disabled && "opacity-50"
            )}
          >
            {endAdornment}
            <Separator orientation="vertical" className="h-5" />
          </span>
        )}
      </div>
    );
  }
);

InputWithAdornment.displayName = "InputWithAdornment";

export { InputWithAdornment };
