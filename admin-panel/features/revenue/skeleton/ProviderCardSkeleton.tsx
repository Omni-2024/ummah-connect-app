'use client';

import { Card, CardHeader, CardContent } from "@/components/base/card";
import { Skeleton } from "@/components/ui/skeleton";

const ProviderPaymentsSkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-40" /> {/* section title */}
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}
      >
        {[...Array(count)].map((_, i) => (
          <Card
            key={i}
            className="border-background-100 bg-background/95 rounded-xl flex flex-col justify-between h-full"
          >
            <CardHeader className="flex flex-row items-start justify-between pb-3 border-b border-background-100 min-h-[110px]">
              <div className="flex items-start gap-3 w-full">
                <Skeleton className="h-10 w-10 rounded-full" /> {/* avatar */}
                <div className="flex flex-col justify-between flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" /> {/* service name */}
                  <Skeleton className="h-3 w-1/2" /> {/* provider name */}
                </div>
              </div>
              <Skeleton className="h-5 w-14 rounded-full" /> {/* badge */}
            </CardHeader>

            <CardContent className="flex flex-col justify-between flex-grow pt-4">
              <div className="space-y-3 flex-grow">
                <div className="flex justify-between text-sm">
                  <Skeleton className="h-4 w-1/4" /> {/* Amount label */}
                  <Skeleton className="h-4 w-1/4" /> {/* Amount value */}
                </div>
                <div className="flex justify-between text-sm">
                  <Skeleton className="h-4 w-1/4" /> {/* Date label */}
                  <Skeleton className="h-4 w-1/3" /> {/* Date value */}
                </div>
              </div>
              <div className="pt-4 mt-auto">
                <Skeleton className="h-10 w-full rounded-md" /> {/* button */}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProviderPaymentsSkeleton;
