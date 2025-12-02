"use client";

export default function ProviderListSkeleton() {
  return (
    <div className="space-y-3 p-4 mt-16 border rounded-xl bg-white animate-pulse">

      {/* Search skeleton */}
      <div className="w-full h-10 bg-gray-200 rounded-lg" />

      {/* List skeleton items */}
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-10 bg-gray-200 rounded-lg"
          />
        ))}
      </div>

    </div>
  );
}
