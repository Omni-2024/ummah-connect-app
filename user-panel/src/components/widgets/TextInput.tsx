import { cn } from "@/lib/className";
import Input, { InputProps } from "../base/form/Input";
import Label from "../base/form/Label";
import Textarea, { TextareaProps } from "../base/form/Textarea";

export interface Props {
  id: string;
  name?: string;
  value?: string;
  label?: string;
  multiline?: boolean;
  placeholder?: string;
  defaultValue?: string;
  errorMessage?: string;
  instructionMessage?: string;
  containerClassName?: string;
  inputProps?: InputProps;
  textAreaProps?: TextareaProps;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onBlur?: (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}

const TextInput: React.FC<Props> = ({
  id,
  name,
  label,
  value,
  onBlur,
  onChange,
  inputProps,
  placeholder,
  errorMessage,
  defaultValue,
  textAreaProps,
  multiline = false,
  instructionMessage,
  containerClassName,
}) => {
  const textInputClassName = cn("bg-white", {
    "focus-visible:ring-0 border-status-red border focus:border-status-red":
      errorMessage,
  });
  const messageClassName = cn("text-xs text-dark-300 font-secondary");

  const commonProps = {
    id,
    value,
    onChange,
    onBlur,
    placeholder,
    defaultValue,
    name: name || id,
  };
  const textAreaMergedProps: TextareaProps = {
    ...textAreaProps,
    ...commonProps,
    className: cn(textInputClassName, textAreaProps?.className),
  };
  const inputMergedProps: InputProps = {
    ...inputProps,
    ...commonProps,
    className: cn(textInputClassName, inputProps?.className),
  };

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-2 font-secondary",
        containerClassName,
      )}
    >
      {label && <Label htmlFor={id}>{label}</Label>}
      {multiline ? (
        <Textarea {...textAreaMergedProps} />
      ) : (
        <Input {...inputMergedProps} />
      )}
      {errorMessage && (
        <p className={cn(messageClassName, "text-status-red")}>
          {errorMessage}
        </p>
      )}
      {!errorMessage?.trim() && instructionMessage && (
        <p className={cn(messageClassName)}>{instructionMessage}</p>
      )}
    </div>
  );
};

export default TextInput;
