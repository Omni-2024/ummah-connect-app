'use client';

import { Card, CardHeader, CardContent } from "@/components/base/card";
import { Skeleton } from "@/components/ui/skeleton";

const ProviderPaymentsSkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="space-y-4">
      {/* Filter button skeleton */}
      <div className="mb-4 w-full flex justify-end">
        <Skeleton className="h-12 w-80 rounded-full" />
      </div>

      {/* Grid of skeleton cards */}
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}
      >
        {[...Array(count)].map((_, i) => (
          <Card
            key={i}
            className="border-primary-100 bg-white rounded-xl flex flex-col justify-between h-full animate-pulse"
          >
            {/* Card header */}
            <CardHeader className="flex flex-row items-start justify-between pb-3 border-b border-primary-100 min-h-[110px]">
              <div className="flex items-start gap-3 w-full">
                <Skeleton className="h-10 w-10 rounded-full" /> {/* Avatar */}
                <div className="flex flex-col flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" /> {/* Service name */}
                  <Skeleton className="h-3 w-1/2" /> {/* Payer/Provider name */}
                </div>
              </div>
              <Skeleton className="h-5 w-14 rounded-full" /> {/* Status badge */}
            </CardHeader>

            {/* Card content */}
            <CardContent className="flex flex-col justify-between flex-grow pt-4">
              <div className="space-y-3 flex-grow">
                <div className="flex justify-between text-sm">
                  <Skeleton className="h-4 w-1/4" /> {/* Paid to Provider label */}
                  <Skeleton className="h-4 w-1/4" /> {/* Amount value */}
                </div>

                <div className="flex justify-between text-sm">
                  <Skeleton className="h-4 w-1/4" /> {/* Commission/Gross label */}
                  <Skeleton className="h-4 w-1/4" /> {/* Value */}
                </div>

                <div className="flex justify-between text-sm">
                  <Skeleton className="h-4 w-1/4" /> {/* Paid Date label */}
                  <Skeleton className="h-4 w-1/3" /> {/* Paid Date value */}
                </div>
              </div>

              {/* Optional placeholder button/space */}
              <div className="pt-4 mt-auto">
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProviderPaymentsSkeleton;
