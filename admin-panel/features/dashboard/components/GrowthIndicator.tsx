"use client"

import { ArrowUpRight, ArrowDownRight } from "lucide-react"

export function GrowthIndicator({ value, className = "" }: { value?: number; className?: string }) {
  if (value == null) return <span className="text-muted-foreground">—</span>

  const isPositive = value > 0
  const isNeutral = value === 0

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {!isNeutral &&
        (isPositive ? (
          <ArrowUpRight className="h-3 w-3 text-emerald-500" />
        ) : (
          <ArrowDownRight className="h-3 w-3 text-red-500" />
        ))}
      <span
        className={`text-xs font-medium ${
          isNeutral ? "text-muted-foreground" : isPositive ? "text-emerald-500" : "text-red-500"
        }`}
      >
        {isNeutral ? "0%" : `${isPositive ? "+" : ""}${value.toFixed(1)}%`}
      </span>
    </div>
  )
}
