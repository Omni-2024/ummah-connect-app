import { ChevronDownIcon } from "@radix-ui/react-icons";
import { TickCircle } from "iconsax-react";
import React, { useState } from "react";

import { cn } from "@/lib/className";
import Button from "./Button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./Command";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";

interface Props {
  onChange?: (value: string) => void;
  items: { value: string; label: string }[];
  placeholder?: string;
  initialValue?: string;
}

const ComboBox: React.FC<Props> = ({
  items,
  onChange,
  placeholder = "Select",
  initialValue,
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const handleOnSelect = (currentValue: string) => {
    setValue(currentValue === value ? "" : currentValue);
    onChange?.(currentValue);
    setOpen(false);
  };

  React.useEffect(() => {
    if (initialValue !== value) {
      setValue(initialValue || "");
    }
  }, [initialValue]);

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild className="bg-white ring-primary-400">
          <Button
            role="combobox"
            variant="unstyled"
            aria-expanded={open}
            className={cn(
              "w-full justify-between rounded-md border border-dark-50 px-3 font-normal text-dark-200",
              {
                "text-black": value,
              },
            )}
          >
            {value
              ? items?.find((item) => item?.value === value)?.label
              : placeholder}
            <ChevronDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="min-w-max p-0">
          <Command className="w-full">
            <CommandInput placeholder="Search" />

            <CommandList className="scrollbar-thin scrollbar-thumb-dark-100 max-w-[400px]">
              <CommandEmpty>No results</CommandEmpty>
              <CommandGroup>
                {items?.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={handleOnSelect}
                  >
                    <TickCircle
                      variant="Bold"
                      className={cn(
                        "mr-2 size-5 text-tertiary-500",
                        value === item?.value ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {item?.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ComboBox;
