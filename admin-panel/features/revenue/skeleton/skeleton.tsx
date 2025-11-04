"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/base/card"
import { Skeleton } from "@/components/ui/skeleton"
import TopListSkeleton from "./TopListSkeleton" // ✅ new import
import ProviderPaymentsSkeleton from "./ProviderCardSkeleton"

export default function AdminDashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* KPI Skeletons */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-6 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>

    <ProviderPaymentsSkeleton count={3} />

      {/* Chart + Top Lists Skeleton */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Skeleton className="h-64 w-full rounded-md" />
        <TopListSkeleton /> {/* ✅ integrated here */}
      </div>

      {/* Recent Payments Skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-6 w-32" />
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex justify-between">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-12" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
