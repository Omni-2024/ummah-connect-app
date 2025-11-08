import { Skeleton } from "@/components/base/skeleton";
import { cn } from "@/lib/className";

interface Props {
  size?: "sm" | "md";
  variant?: "default" | "trending";
}

export function SkeletonServicesCard({ size = "md", variant = "default" }: Props) {
  if (variant === "trending") {
    return (
      <div
        className={cn(
          "relative w-full min-w-80 max-w-[25rem] overflow-hidden rounded-3xl p-0 bg-gray-100 transition-colors duration-300 ease-in-out",
          {
            "lg:min-w-72 lg:max-w-72": size === "sm",
          },
        )}
      >
        {/* Trending Badge Placeholder */}
        <div className="absolute top-0 left-0 z-10 p-1">
          <Skeleton className={cn("h-6 w-24 rounded-full", {
            "h-5 w-20": size === "sm",
          })} />
        </div>

        {/* Image Placeholder with Overlay Placeholders */}
        <div className={cn("relative h-44 w-full rounded-t-3xl overflow-hidden", {
          "h-36": size === "sm",
        })}>
          <Skeleton className="absolute inset-0 h-full w-full" />
          <div className={cn("absolute bottom-3 left-3 right-3 flex items-center justify-between", {
            "bottom-2 left-2 right-2": size === "sm",
          })}>
            <Skeleton className={cn("h-6 w-12 rounded-lg", {
              "h-5 w-10": size === "sm",
            })} />
            <Skeleton className={cn("h-6 w-20 rounded-lg", {
              "h-5 w-16": size === "sm",
            })} />
          </div>
        </div>

        {/* Title Placeholder */}
        <div className={cn("mt-4 pt-0 space-y-1 px-4", {
          "space-y-0.5 px-3.5": size === "sm",
        })}>
          <Skeleton
            className={cn("h-6 w-3/4 rounded", {
              "h-5 w-2/3": size === "sm",
            })}
          />
        </div>

        {/* Description Placeholder */}
        <div className={cn("mt-4 space-y-1 px-4 pb-4", {
          "space-y-0.5 px-3.5 pb-3.5": size === "sm",
        })}>
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
        </div>

        {/* Button Placeholder */}
        <div className={cn("mt-4 px-4 pb-4", {
          "px-3.5 pb-3.5": size === "sm",
        })}>
          <Skeleton className={cn("mt-4 h-10 w-full rounded-lg", {
            "h-8": size === "sm",
          })} />
        </div>
      </div>
    );
  }

  // Default variant
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
        className={cn("h-44 w-full rounded-2xl", {
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