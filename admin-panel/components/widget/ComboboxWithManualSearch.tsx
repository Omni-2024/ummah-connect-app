import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/base/Popover";

import { cn } from "@/lib/className";

import { Button } from "@/components/base/rawButton";
import type { PopoverProps } from "@radix-ui/react-popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/base/Command";
import { ArrowDown2 } from "iconsax-react";

type ComboBoxWithManualSearchProps = {
  onChange: (value: string) => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
  value: string;
  error?: string;

  placeholder?: string;
  items?: { value: string; label: string }[];
  className?: string;
};

const ComboBoxWithManualSearch: React.FC<ComboBoxWithManualSearchProps> = ({
  onChange,
  searchValue,
  setSearchValue,
  placeholder = "Select",
  className,
  items = [],
  value,
  error,
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="flex flex-col w-[400px]">
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-[400px] shrink-0 justify-between", className)}
          >
            {value ? (
              items.find((item) => item.value === value)?.label
            ) : (
              <span className="text-dark-200 font-normal">{placeholder}</span>
            )}
            <ArrowDown2 className="h-4 w-4 opacity-90" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className={cn("w-[200px] p-0", className)}>
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search..."
              className="h-9"
              value={searchValue}
              onInput={(e) => {
                setSearchValue((e.target as HTMLInputElement).value);
              }}
            />
            <CommandList>
              <CommandEmpty>Not found.</CommandEmpty>
              <CommandGroup>
                {items.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={(currentValue) => {
                      onChange(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    {item.label}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === item.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
        <div className="text-red-500 text-xs font-normal mt-1">{error}</div>
      </div>
    </Popover>
  );
};

export default ComboBoxWithManualSearch;
