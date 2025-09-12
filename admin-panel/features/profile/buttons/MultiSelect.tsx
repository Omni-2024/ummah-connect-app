"use client";

import * as React from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/base/badge";
import { ScrollArea } from "@/components/base/scroll-area";
import { Checkbox } from "@/components/base/checkbox";

export type Option = { value: string; label: string };

type Props = {
    label?: string;
    options?: Option[];
    value?: string[];
    onChange: (next: string[]) => void;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    className?: string;
    maxHeight?: number;
};

export default function MultiLanguageSelect({
    label = "Languages",
    options,
    value,
    onChange,
    placeholder = "Select languages…",
    disabled,
    required,
    className,
    maxHeight = 320,
}: Props) {
    const [open, setOpen] = React.useState(false);
    const triggerRef = React.useRef<HTMLButtonElement>(null);

    const opts = Array.isArray(options) ? options : [];
    const safeValue = Array.isArray(value) ? value : [];

    const valueSet = React.useMemo(() => new Set(opts.map((o) => o.value)), [opts]);
    const selected = React.useMemo(
        () => safeValue.filter((v) => valueSet.has(v)),
        [safeValue, valueSet]
    );

    const toggleValue = (code: string) => {
        if (safeValue.includes(code)) onChange(safeValue.filter((v) => v !== code));
        else onChange([...safeValue, code]);
    };
    const removeOne = (code: string) => onChange(safeValue.filter((v) => v !== code));
    const clearAll = () => onChange([]);

    return (
        <div className={cn("w-full ", className)}>
            {label && (
                <div className="mb-1.5 flex items-center gap-1">
                    <label className="text-sm font-medium">{label}</label>
                    {required ? <span className="text-xs text-muted-foreground">(required)</span> : null}
                </div>
            )}

            {/* Selected chips row */}
            {selected.length > 0 && (
                <div className="mb-2 flex flex-wrap items-center gap-2">
                    {selected.map((code) => {
                        const text = opts.find((o) => o.value === code)?.label ?? code;
                        return (
                            <Badge
                                key={code}
                                variant="secondary"
                                className="rounded-full px-3 py-1 text-xs bg-accent/10 border border-[#337f7c]/20 text-foreground"
                            >
                                {text}
                                {!disabled && (
                                    <button
                                        type="button"
                                        className="ml-1 rounded p-0.5 hover:bg-muted"
                                        onClick={() => removeOne(code)}
                                        aria-label={`Remove ${text}`}
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                )}
                            </Badge>
                        );
                    })}
                    {!disabled && selected.length > 0 && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-7 rounded-full border border-[#337f7c]/30 bg-accent/10 px-3 text-xs"
                            onClick={clearAll}
                        >
                            Clear
                        </Button>
                    )}
                </div>
            )}

            {/* Trigger (pill) */}
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        ref={triggerRef}
                        type="button"
                        variant="outline"
                        className={cn(
                            "h-10 w-full justify-between rounded-full border border-[#337f7c]/30 bg-accent/10 text-foreground",
                            "hover:bg-accent/20",
                            disabled && "cursor-not-allowed opacity-60"
                        )}
                        disabled={disabled}
                    >
                        <span className="truncate text-left">
                            {selected.length === 0 ? (
                                <span className="text-muted-foreground">{placeholder}</span>
                            ) : (
                                `${selected.length} selected`
                            )}
                        </span>
                        <ChevronDown className="ml-2 h-4 w-4 opacity-70" />
                    </Button>
                </PopoverTrigger>

                {/* Popover panel, rounded and same width as trigger */}
                <PopoverContent
                    align="start"
                    side="bottom"
                    sideOffset={8}
                    className="z-50  overflow-hidden rounded-2xl border border-[#337f7c]/20 bg-card p-0 shadow-xl"
                    style={{ width: triggerRef.current?.offsetWidth }}
                >
                    <Command className=" bg-white">
                        <div className="sticky top-0 z-10 border-b bg-card/95 p-2 backdrop-blur">
                            <CommandInput
                                placeholder="Search languages..."
                                className="h-9 rounded-full bg-muted/60 text-sm px-3"
                            />
                        </div>

                        <CommandList>
                            <CommandEmpty className="p-4 text-sm">
                                {opts.length === 0 ? "No language options provided." : "No languages match your search."}
                            </CommandEmpty>

                            <ScrollArea className="max-h-[320px]">
                                <CommandGroup heading="All languages" className="px-2 py-2">
                                    {opts.map((opt) => {
                                        const checked = safeValue.includes(opt.value);
                                        return (
                                            <CommandItem
                                                key={opt.value}
                                                value={`${opt.label} ${opt.value}`}
                                                onSelect={() => toggleValue(opt.value)}
                                                className={cn(
                                                    "flex items-center gap-3 rounded-xl px-2 py-2",
                                                    "aria-selected:bg-accent/20"
                                                )}
                                            >
                                                <Checkbox
                                                    checked={checked}
                                                    onCheckedChange={() => toggleValue(opt.value)}
                                                    className="mr-1 h-4 w-4"
                                                />
                                                <span className="flex-1 text-sm">{opt.label}</span>
                                                {checked ? <Check className="h-4 w-4 opacity-80" /> : null}
                                            </CommandItem>
                                        );
                                    })}
                                </CommandGroup>
                            </ScrollArea>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
