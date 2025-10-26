"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/base/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function TopListSkeleton({ title }: { title?: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-4 w-1/2" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <li key={i} className="flex justify-between text-sm">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
