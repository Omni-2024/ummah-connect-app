"use client"

import { Skeleton } from "../skeleton"

// KPI card skeleton
export function KpiCardSkeleton() {
  return (
    <div className="p-4 rounded-lg border bg-white shadow-sm space-y-3">
      <Skeleton className="h-4 w-24" /> {/* title */}
      <Skeleton className="h-8 w-28" /> {/* big number */}
      <Skeleton className="h-4 w-20" /> {/* growth */}
    </div>
  )
}

// Top Services skeleton row
export function ServiceRowSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border">
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <div className="text-right space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  )
}

// Top Providers skeleton row
export function ProviderRowSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border">
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <div className="text-right space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  )
}
