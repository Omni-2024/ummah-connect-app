import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";

import { cn } from "@/lib/className";
import IconButton from "../base/IconButton";
import TextInput, { Props as TextInputProps } from "./TextInput";

interface Props extends TextInputProps {}

const PasswordInput: React.FC<Props> = ({
  containerClassName,
  inputProps,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <div className={cn("relative", containerClassName)}>
      <TextInput
        {...props}
        inputProps={{
          className: "pr-8",
          type: showPassword ? "text" : "password",
          autoComplete: "new-password",
          ...inputProps,
        }}
      />

      <div className="absolute right-0 top-[25px] z-50 flex h-9 -translate-y-1/2 items-center justify-center px-2 lg:top-[18px]">
        <IconButton
          type="button"
          className="bg-none"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? (
            <EyeSlashIcon className="size-4 text-dark-400" />
          ) : (
            <EyeIcon className="size-4 text-dark-400" />
          )}
        </IconButton>
      </div>
    </div>
  );
};

export default PasswordInput;
