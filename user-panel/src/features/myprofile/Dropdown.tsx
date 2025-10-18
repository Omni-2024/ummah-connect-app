import React, { useState } from "react"
import { ChevronDownIcon } from "@radix-ui/react-icons"

interface DropdownProps {
  label: string
  value: string | string[]
  options: string[]
  onChange: (value: string | string[]) => void
  multiple?: boolean
  required?: boolean
  idToNameMap?: {[key: string]: string}
  maxHeight?: string
}

export function Dropdown({ 
  label, 
  value, 
  options, 
  onChange, 
  multiple = false, 
  required = false, 
  idToNameMap = {},
  maxHeight = "240px"
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  const handleOptionClick = (option: string) => {
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : []
      if (currentValues.includes(option)) {
        onChange(currentValues.filter(v => v !== option))
      } else {
        onChange([...currentValues, option])
      }
    } else {
      onChange(option)
      setIsOpen(false)
    }
  }
  
  const displayValue = () => {
    if (multiple) {
      const values = Array.isArray(value) ? value : []
      if (values.length > 0) {
        const displayNames = values.map(id => idToNameMap[id] || id).filter(Boolean)
        return displayNames.join(", ")
      }
      return "Select options..."
    }
    return value || "Select an option..."
  }
  
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm text-left bg-white flex items-center justify-between hover:border-gray-400 transition-colors"
      >
        <span className={value && (Array.isArray(value) ? value.length > 0 : true) ? "text-gray-900" : "text-gray-500"}>
          {displayValue()}
        </span>
        <ChevronDownIcon className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div 
            className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg overflow-y-auto"
            style={{ maxHeight }}
          >
            {options.map((option) => {
              const isSelected = multiple 
                ? Array.isArray(value) && value.includes(option)
                : value === option
              
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleOptionClick(option)}
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center justify-between ${
                    isSelected ? 'bg-emerald-50 text-emerald-700' : 'text-gray-900'
                  }`}
                >
                  {option}
                  {multiple && isSelected && (
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  )}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}