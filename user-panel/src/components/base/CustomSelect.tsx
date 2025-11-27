// components/base/CustomSelectUp.tsx   ← or just replace your existing one

import { ChevronDownIcon,  ChevronUpIcon } from "@radix-ui/react-icons";
import { TickCircle } from "iconsax-react";
import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/className";

interface Item {
  value: string;
  label: string;
}

interface CustomSelectUpProps {
  items: Item[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const CustomSelectUp: React.FC<CustomSelectUpProps> = ({
  items,
  value = "",
  onChange,
  placeholder = "Select...",
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filtered = items.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  const selectedLabel = items.find((i) => i.value === value)?.label || "";

  // Close when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className={cn("relative w-full", className)}>
      {/* Trigger */}
      <button
        ref={triggerRef}
        onClick={() => setOpen(!open)}
        className={cn(
          "flex w-full items-center justify-between rounded-lg border bg-white px-4 py-2.5 text-left text-sm font-normal transition-all",
          "border-dark-200/50 hover:border-dark-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
          value ? "text-dark-900" : "text-dark-400"
        )}
      >
        <span className="truncate">{value ? selectedLabel : placeholder}</span>
        {open ? (
          <ChevronUpIcon className="ml-2 size-4 shrink-0" />
        ) : (
          <ChevronDownIcon className="ml-2 size-4 shrink-0" />
        )}
      </button>

      {/* DROPDOWN — OPENS UPWARDS */}
      {open && (
        <div
          ref={dropdownRef}
          className="absolute bottom-full left-0 right-0 mb-1 max-h-64 overflow-hidden rounded-lg border border-dark-100 bg-white shadow-2xl z-50"
          style={{ width: triggerRef.current?.offsetWidth || "100%" }} // Fixed width
        >
          {/* Search */}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full border-b border-dark-100 px-4 py-3 text-sm outline-none"
            autoFocus
          />

          {/* List */}
          <div className="max-h-56 overflow-y-auto scrollbar-thin scrollbar-thumb-dark-200">
            {filtered.length === 0 ? (
              <div className="px-4 py-3 text-center text-sm text-dark-400">
                No results
              </div>
            ) : (
              filtered.map((item) => (
                <button
                  key={item.value}
                  onClick={() => {
                    onChange?.(item.value);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-emerald-50",
                    value === item.value && "bg-emerald-50"
                  )}
                >
                  <TickCircle
                    variant="Bold"
                    className={cn(
                      "size-5 text-emerald-600",
                      value === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelectUp;