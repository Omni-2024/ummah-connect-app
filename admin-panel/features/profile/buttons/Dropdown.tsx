import React from "react";

interface DropdownProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string | string[]) => void;
  required?: boolean;
  disabled?: boolean;   // ✅ added this
}

export function Dropdown({ label, value, options, onChange, required, disabled }: DropdownProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <select
        className="w-full border rounded-md px-3 py-2 text-sm bg-input border-[#337f7c]/20"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}   // ✅ now it respects disabled
      >
        <option value="" disabled>
          Select {label}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
