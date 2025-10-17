"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/base/card"
import { Skeleton } from "@/components/ui/skeleton"

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

      {/* Provider Payments Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-40" />
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}
        >
          {[1, 2, 3].map((i) => (
            <Card
              key={i}
              className="border-primary-100 bg-primary-50 rounded-xl flex flex-col justify-between h-full"
            >
              <CardHeader className="flex flex-row items-start justify-between pb-3 border-b border-primary-100 min-h-[110px]">
                <div className="flex items-start gap-3 w-full">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex flex-col justify-between flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
                <Skeleton className="h-5 w-14 rounded-full" />
              </CardHeader>

              <CardContent className="flex flex-col justify-between flex-grow pt-4">
                <div className="space-y-3 flex-grow">
                  <div className="flex justify-between text-sm">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                  <div className="flex justify-between text-sm">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                </div>
                <div className="pt-4 mt-auto">
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Chart + Top Lists Skeleton */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Skeleton className="h-64 w-full rounded-md" />
        <Skeleton className="h-64 w-full rounded-md" />
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
