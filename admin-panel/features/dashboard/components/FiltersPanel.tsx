"use client"

import { useState } from "react"
import {
  Filter,
  RefreshCw,
  Calendar,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/base/input"
import { Label } from "@/components/base/label"
import { GetStatsParams, ScopeType } from "@/lib/endpoints/paymentFns"

export function FiltersPanel({
  value,
  onChange,
  onRefresh,
}: {
  value: GetStatsParams
  onChange: (v: GetStatsParams) => void
  onRefresh: () => void
}) {
  const [filterOpen, setFilterOpen] = useState(false)
  const [rangePopoverOpen, setRangePopoverOpen] = useState(false)

  const handleScopeChange = (scope: ScopeType) => {
    const newParams: GetStatsParams = { ...value, scope }
    if (scope !== "month") {
      delete newParams.month
      delete newParams.year
    }
    if (scope !== "range") {
      delete newParams.start
      delete newParams.end
    }
    onChange(newParams)
  }

  const handleClearFilters = () => {
    onChange({
      scope: ScopeType.LAST_30D,
      groupBy: "day",
      topLimit: 5,
    } as GetStatsParams)
  }

  const handleMonthChange = (month: number, year: number) => {
    onChange({ ...value, scope: ScopeType.MONTH, month, year })
  }

  const handleStartDateChange = (start: string) => {
    onChange({ ...value, start })
  }

  const handleEndDateChange = (end: string) => {
    onChange({ ...value, end })
  }

  const generateMonthOptions = () => {
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth()
    const months = [
      "January","February","March","April","May","June",
      "July","August","September","October","November","December",
    ]
    const options = []

    for (let i = 0; i <= currentMonth; i++) {
      options.push({ month: i + 1, year: currentYear, label: `${months[i]} ${currentYear}` })
    }

    for (let i = 0; i < 12; i++) {
      options.push({ month: i + 1, year: currentYear - 1, label: `${months[i]} ${currentYear - 1}` })
    }

    return options
  }

  const getSelectedRangeLabel = () => {
    if (value.start && value.end) {
      const startDate = new Date(value.start).toLocaleDateString()
      const endDate = new Date(value.end).toLocaleDateString()
      return `${startDate} - ${endDate}`
    } else if (value.start) {
      return `From ${new Date(value.start).toLocaleDateString()}`
    } else if (value.end) {
      return `Until ${new Date(value.end).toLocaleDateString()}`
    }
    return "Pick a date range"
  }

  return (
    <Popover open={filterOpen} onOpenChange={setFilterOpen}>
      <PopoverTrigger asChild>
        <div className="flex justify-end w-full">
            <Button
            size="sm"
            variant="outline"
            className="flex items-center gap-2 rounded-md"
            >
            <Filter className="h-4 w-4" /> Filters
            </Button>
        </div>
        </PopoverTrigger>

      <PopoverContent
        side="bottom"
        align="end"
        sideOffset={4}
        className="w-96 p-6 rounded-xl bg-white shadow-xl border space-y-6"
      >
        {/* Header */}
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary-500">
            <Filter className="h-4 w-4 text-white" />
          </div>
          <span className="font-semibold text-gray-900">Time Range Filter</span>
        </div>

        {/* Quick Filters */}
        <div className="space-y-2">
          <span className="text-xs font-medium text-gray-500">Quick Filters</span>
          <div className="grid grid-cols-2 gap-2">
            {[{ scope: ScopeType.ALL, label: "All Time", desc: "Show all payments" }, 
              { scope: ScopeType.LAST_WEEK, label: "Last 7 Days", desc: "Recent activity" }, 
              { scope: ScopeType.LAST_30D, label: "Last 30 Days", desc: "This month's data" }].map((btn) => (
              <Button
                key={btn.scope}
                size="sm"
                onClick={() => handleScopeChange(btn.scope)}
                className={`flex flex-col items-start p-6 rounded-lg text-left ${
                  value.scope === btn.scope ? "bg-gray-200" : "bg-gray-50 border" 
                }`}
              >
                <span className="font-medium text-sm">{btn.label}</span>
                <span className="text-xs text-gray-400">{btn.desc}</span>
              </Button>
            ))}

            {/* Month Dropdown */}
                <Select
                onValueChange={(val) => {
                    const [m, y] = val.split("-").map(Number)
                    handleMonthChange(m, y)
                }}
                value={
                    value.scope === ScopeType.MONTH && value.month && value.year
                    ? `${value.month}-${value.year}`
                    : ""
                }
                >
                <SelectTrigger className="w-full justify-between px-3 py-6 rounded-lg text-left bg-white border">
                    <SelectValue placeholder="Pick a month" />
                </SelectTrigger>
                <SelectContent className="bg-white border rounded-md shadow-md">
                    {generateMonthOptions().map((opt) => (
                    <SelectItem
                        key={`${opt.month}-${opt.year}`}
                        value={`${opt.month}-${opt.year}`}
                        className="bg-white hover:bg-gray-100 cursor-pointer"
                    >
                        {opt.label}
                    </SelectItem>
                    ))}
                </SelectContent>
                </Select>

          </div>
        </div>

        {/* Custom Range */}
        <div className="space-y-2">
          <span className="text-xs font-medium text-gray-500">Custom Range</span>
          <Popover open={rangePopoverOpen} onOpenChange={setRangePopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                size="sm"
                onClick={() => {
                  if (value.scope !== "range") handleScopeChange(ScopeType.RANGE)
                  setRangePopoverOpen(true)
                }}
                className={`w-full justify-between rounded-lg text-left ${
                  value.scope === "range" ? "bg-gray-200" : "bg-gray-50 border"
                }`}
              >
                <span>{getSelectedRangeLabel()}</span>
                <Calendar className="h-4 w-4" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-full p-4 bg-white rounded-lg shadow-lg border">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="start-date" className="text-xs text-gray-400">From</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={value.start ? value.start.split("T")[0] : ""}
                    onChange={(e) => handleStartDateChange(e.target.value ? new Date(e.target.value).toISOString() : "")}
                    className="text-sm rounded-lg bg-gray-50 w-full"
                  />
                </div>
                <div>
                  <Label htmlFor="end-date" className="text-xs text-gray-400">To</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={value.end ? value.end.split("T")[0] : ""}
                    onChange={(e) => handleEndDateChange(e.target.value ? new Date(e.target.value).toISOString() : "")}
                    className="text-sm rounded-lg bg-gray-50 w-full"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-3">
                <Button variant="outline" size="sm" onClick={() => onChange({ ...value, start: undefined, end: undefined })}>
                  Clear
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Only Reset button aligned right */}
        <div className="flex justify-end items-center">
          <Button variant="ghost" size="sm" className="flex items-center gap-1" onClick={handleClearFilters}>
            <RefreshCw className="h-4 w-4" /> Reset
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

