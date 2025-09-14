"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface DropdownOption {
  label: string;
  value: string;
  icon?: React.ReactNode; // 👈 optional icon for each option
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className = "",
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-700 hover:border-gray-400 focus:ring-2 focus:ring-primary-500 focus:outline-none"
      >
        <span className="flex items-center gap-2">
          {selected?.icon && <span className="w-4 h-4">{selected.icon}</span>}
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          className={`ml-2 h-4 w-4 transition-transform ${open ? "rotate-180" : "rotate-0"}`}
        />
      </button>

      {open && (
        <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2 text-left px-3 py-2 hover:bg-primary-100 ${
                  value === option.value ? "bg-primary-100 font-medium" : ""
                }`}
              >
                {option.icon && <span className="w-4 h-4">{option.icon}</span>}
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
