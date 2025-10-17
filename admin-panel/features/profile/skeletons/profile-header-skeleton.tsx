"use client";

import { Card, CardContent } from "@/components/base/card";

export function ProfileHeaderSkeleton() {
  return (
    <Card className="border-[#3E6563]/50 shadow-lg animate-pulse">
      <CardContent className="pl-8 pr-8 pt-16 pb-16">
        <div className="flex items-start space-x-6">
          {/* Avatar Skeleton */}
          <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-700" />

          {/* Profile Info Skeleton */}
          <div className="flex-1 space-y-4">
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mt-2"></div>

            <div className="flex space-x-2 mt-2">
              <div className="h-5 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="h-5 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>

            {/* Quick Stats Skeleton */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#337f7c]/50">
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mx-auto w-12"></div>
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mx-auto w-12"></div>
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mx-auto w-12"></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
