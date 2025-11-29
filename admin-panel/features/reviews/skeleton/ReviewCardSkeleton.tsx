"use client";

export default function ReviewCardSkeleton() {
  return (
    <div className="border rounded-xl bg-white/50 animate-pulse p-4 flex gap-4">
      {/* User avatar */}
      <div className="w-12 h-12 rounded-full bg-gray-200" />

      {/* Content */}
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div> {/* username */}
        <div className="h-3 bg-gray-200 rounded w-full"></div>   {/* description */}
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>    {/* description line 2 */}
        <div className="flex gap-1 mt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="h-3 bg-gray-200 rounded w-1/4 mt-1"></div> {/* date */}
      </div>
    </div>
  );
}
