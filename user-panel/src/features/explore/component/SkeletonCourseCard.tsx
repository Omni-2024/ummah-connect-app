import { Skeleton } from "@/components/base/skeleton";
import { cn } from "@/lib/className";

interface Props {
  size?: "sm" | "md";
}

export function SkeletonServicesCard({ size = "md" }: Props) {
  return (
    <div
      className={cn(
        "w-full min-w-80 max-w-[25rem] cursor-pointer select-none space-y-2 overflow-hidden rounded-3xl p-4 transition-colors duration-300 ease-in-out hover:border-primary-100 hover:bg-primary-50/60 active:border-primary-300 lg:space-y-3.5",
        {
          "space-y-3 p-3.5 lg:min-w-72 lg:max-w-72": size === "sm",
        },
      )}
    >
      {/* Image Placeholder */}
      <Skeleton
        className={cn("h-44 w-full rounded-2xl object-cover", {
          "h-36": size === "sm",
        })}
      />

      {/* Points, Rating, and Reviews Placeholder */}
      <div
        className={cn("flex items-center gap-2.5 text-sm font-semibold", {
          "gap-1.5 text-xs": size === "sm",
        })}
      >
        {/* Trophy Icon Placeholder */}
        <Skeleton
          className={cn("h-4 w-6 rounded-full", { "w-4": size === "sm" })}
        />
        {/* Points Placeholder */}
        <Skeleton
          className={cn("h-4 w-16 rounded", { "w-20": size === "sm" })}
        />
        <span>•</span>
        {/* Star Icon Placeholder */}
        <Skeleton
          className={cn("h-4 w-6 rounded-full", { "w-4": size === "sm" })}
        />
        {/* Rating and Reviews Placeholder */}
        <Skeleton
          className={cn("h-4 w-16 rounded", { "w-20": size === "sm" })}
        />
      </div>

      {/* Title Placeholder */}
      <Skeleton
        className={cn("h-6 w-3/4 rounded", {
          "h-5 w-2/3": size === "sm",
        })}
      />

      {/* Educator name Placeholder */}
      <Skeleton
        className={cn("h-4 w-1/2 rounded", {
          "h-3 w-1/3": size === "sm",
        })}
      />

      {/* Description Placeholder */}
      <Skeleton
        className={cn("h-4 w-full rounded", {
          "h-3 w-4/5": size === "sm",
        })}
      />
      <Skeleton
        className={cn("h-4 w-3/4 rounded", {
          "h-3 w-2/3": size === "sm",
        })}
      />

      {/* Total time and Learners Placeholder */}
      <div
        className={cn("flex items-center gap-2", {
          "text-xs": size === "sm",
        })}
      >
        <Skeleton
          className={cn("h-4 w-24 rounded", { "w-20": size === "sm" })}
        />
        <span>•</span>
        <Skeleton
          className={cn("h-4 w-20 rounded", { "w-16": size === "sm" })}
        />
      </div>
    </div>
  );
}
