"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { languages } from "@/lib/constants";

interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  label: string;
  options: Option[];        // now objects
  value: string[];          // still array of values
  onChange: (value: string[]) => void;
  disabled?: boolean;
}

export function MultiSelectTags({ label, options, value, onChange, disabled }: MultiSelectProps) {
  const [inputValue, setInputValue] = useState("");

  const addOption = (val: string) => {
    if (!value.includes(val)) onChange([...value, val]);
    setInputValue("");
  };

  const removeOption = (val: string) => {
    onChange(value.filter((v) => v !== val));
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>

      {/* Selected tags */}
      <div className="flex flex-wrap gap-2">
       {(value || []).map((val) => {
  const optLabel = options.find((o) => o.value === val)?.label ?? val;
  return (
    <span key={val} className="flex items-center bg-accent/20 text-accent px-3 py-1 rounded-full text-sm">
      {optLabel}
      {!disabled && (
        <button type="button" className="ml-2 text-accent hover:text-red-500" onClick={() => removeOption(val)}>
          <X className="w-4 h-4" />
        </button>
      )}
    </span>
  );
})}

      </div>

      {/* Dropdown for adding new options */}
      {!disabled && (
        <select
          value={inputValue}
          onChange={(e) => addOption(e.target.value)}
          className="w-full border rounded-md p-2 bg-input border-[#337f7c]/20"
        >
          <option value="">Select a language...</option>
          {options
            .filter((o) => !value.includes(o.value))
            .map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
        </select>
      )}
    </div>
  );
}
