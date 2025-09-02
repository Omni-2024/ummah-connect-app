import { cn } from "@/lib/className";
import * as React from "react";
import Label from "./Label";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="flex flex-col w-full">
        <textarea
          className={cn(
            "flex min-h-[60px] w-full border border-dark-50 bg-transparent px-3 py-2 text-sm scrollbar-thin placeholder:text-dark-200 focus:border-primary-400 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 rounded-xl",
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

export function TextareaWithLabel({
  label,
  id,
  className,
  withCounter,
  maxLength,
  ...props
}: TextareaProps & {
  label: string;
  id: string;
  errorMessage?: string;
  className?: string;
  withCounter?: boolean;
  maxLength?: number;
}) {
  return (
    <div className={cn("flex flex-col gap-2 rounded-xl", className)}>
      <Label htmlFor={id}>{label}</Label>
      <Textarea
        id={id}
        {...props}
        className={cn(
          "max-h-56 min-h-28",
          props.errorMessage ? "!border-status-red" : ""
        )}
      />
      <div className="flex">
        {props.errorMessage && (
          <div className="text-status-red text-xs">{props.errorMessage}</div>
        )}
        {withCounter && (
          <div className="ml-auto text-xs text-dark-300">
            {(props.value ?? "").toString().length}/{maxLength}
          </div>
        )}
      </div>
    </div>
  );
}
Textarea.displayName = "Textarea";

export default Textarea;
