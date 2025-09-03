import React from "react"
import { MagnifyingGlassIcon } from "@radix-ui/react-icons"

const SearchBar = () => {
  return (
    <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
      <div className="relative w-full">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search courses, topics, members..."
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
        />
      </div>
    </div>
  )
}

export default SearchBar