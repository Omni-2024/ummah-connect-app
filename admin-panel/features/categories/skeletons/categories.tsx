"use client";

import { Skeleton } from "@/components/base/skeleton";
import { Card, CardContent } from "@/components/base/card";

const CategoryCardSkeleton = () => {
  return (
    <Card className="group hover:shadow-sm transition-all duration-200 border border-border/50 hover:border-primary/30 bg-gradient-to-r from-slate-50 to-white mb-3">
      <CardContent className="p-0">
        <div className="flex items-center justify-between w-full p-4">
          {/* Left Section */}
          <div className="flex items-center gap-3">
            {/* Drag handle placeholder */}
            <Skeleton className="h-4 w-4 rounded-md" />

            {/* Icon + Name */}
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-lg" />

              <div className="space-y-2">
                <Skeleton className="h-5 w-40 rounded-md" />
                <Skeleton className="h-4 w-28 rounded-md" />
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const CategoriesSkeletonList = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="flex flex-col py-4 px-4 gap-3">
      {[...Array(count)].map((_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey:
        <CategoryCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default function AdminCategoriesPageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/30">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          {/* Left: Icon + Text */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-52 rounded-md" />
              <Skeleton className="h-4 w-64 rounded-md" />
            </div>
          </div>

          {/* Right: Add Button */}
          <Skeleton className="h-10 w-40 rounded-md" />
        </div>
      </div>

      {/* Categories List Section */}
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <CategoriesSkeletonList count={6} />
      </div>
    </div>
  );
}
