import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardDescription, CardTitle } from "@/components/base/Card";
import { cn } from "@/lib/className";
import { Service } from "@/types";
import { buildAvatarUrl } from "@/features/app/components/Navbar";
import StudentCountLabel from "@/components/widgets/StudentCountLabel";
import { useGeneralUser } from "@/lib/hooks/useUser";
import { Star, TrendingUp } from "lucide-react";
import Button from "@/components/base/Button";

interface Props {
  size?: "sm" | "md";
  service?: Service;
  className?: string;
  variant?: "default" | "trending";
  trendingIndex?: number;
}

const ServiceCard = ({ 
  size = "md", 
  service, 
  className,
  variant = "default",
  trendingIndex 
}: Props) => {
  const router = useRouter();
  const { data: educator } = useGeneralUser(service ? service?.providerId : "1");

  const handleCardClick = () => {
    if (service) {
      router.push(`/service/${service.slug}`);
    } else {
      router.push(`/course/n-a`);
    }
  };

  const enrollmentCount = typeof service?.enrollmentCount === "string" 
    ? parseInt(service.enrollmentCount, 10) 
    : service?.enrollmentCount;

  // Default variant
  if (variant === "default") {
    return (
      <Card
        onClick={handleCardClick}
        className={cn(
          "flex h-full w-full min-w-64 max-w-[18rem] sm:min-w-72 sm:max-w-[22rem] md:min-w-80 md:max-w-[25rem] cursor-pointer select-none flex-col space-y-2 overflow-hidden rounded-3xl p-4 transition-colors duration-300 ease-in-out hover:border-primary-100 hover:bg-primary-50/60 active:border-primary-300 lg:space-y-3.5",
          {
            "space-y-3 p-3.5 lg:min-w-72 lg:max-w-72": size === "sm",
          },
          className,
        )}
      >
        <img
          alt="cover"
          src={
            service?.coverImageUrl
              ? buildAvatarUrl(service.coverImageUrl)!!
              : "/images/coverImage.png"
          }
          className={cn("h-44 w-full rounded-2xl object-cover", {
            "h-36": size === "sm",
          })}
        />

        <div
          className={cn("flex items-center gap-2.5 text-sm font-semibold", {
            "gap-1.5 text-xs": size === "sm",
          })}
        >
          <span
            className={cn("flex items-center gap-2", {
              "gap-1": size === "sm",
            })}
          >
            <img
              alt="trophy"
              src="/icons/filled/trophy.svg"
              className={cn("size-5 object-cover", {
                "size-4": size === "sm",
              })}
            />
            {service?.averageReviewScore ?? 5}
            <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
            <span className="">
              ({service?.totalReviewCount ?? 0} reviews)
            </span>
          </span>
        </div>

        <div
          className={cn("space-y-1", {
            "space-y-0.5": size === "sm",
          })}
        >
          <CardTitle
            className={cn("line-clamp-2 text-base leading-tight lg:text-lg", {
              "text-[.92rem] font-medium leading-tight": size === "sm",
            })}
          >
            {service
              ? service?.title
              : "Vivamus ex augue tempus id diam at, dictum cursus metus"}
          </CardTitle>

          <CardDescription
            className={cn("line-clamp-1 font-normal", {
              "text-xs": size === "sm",
            })}
          >
            {educator?.name || "N/A"}
          </CardDescription>
        </div>

        <CardDescription
          className={cn("line-clamp-3", {
            "text-xs": size === "sm",
          })}
        >
          {service
            ? service?.tagline
            : "Praesent non orci eu augue egestas lobortis. Fusce dapibus, urna non dignissim ultrices, libero dolor porta tellus, eget tincidunt mi."}
        </CardDescription>

        <CardDescription
          className={cn("!mt-auto flex items-center gap-2 pt-3", {
            "pt-3 text-xs": size === "sm",
          })}
        >
          <StudentCountLabel count={Number(enrollmentCount)} />
        </CardDescription>
      </Card>
    );
  }

  // Trending variant
  return (
    <Card
        onClick={handleCardClick}
        className={cn(
          "relative flex h-full w-full min-w-64 max-w-[18rem] sm:min-w-72 sm:max-w-[22rem] md:min-w-80 md:max-w-[25rem] cursor-pointer select-none flex-col space-y-0 overflow-hidden rounded-3xl p-0 bg-white transition-all duration-300 ease-in-out hover:border-primary-100 hover:shadow-xl active:border-primary-300",
          {
            "lg:min-w-72 lg:max-w-72": size === "sm",
          },
          className,
        )}
      >

      {trendingIndex !== undefined && (
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-3 py-1.5 rounded-full shadow-lg border border-white/20">
        <TrendingUp 
          className={cn("w-4 h-4 text-white", {
            "w-3.5 h-3.5": size === "sm",
          })} 
        />
        <span className={cn("font-bold tracking-wider", {
          "text-sm": size === "md",
          "text-xs": size === "sm",
        })}>
          Trending #{trendingIndex + 1} 
        </span>
      </div>
      )}
      
      <div className={cn("relative m-0 h-44 w-full rounded-t-3xl overflow-hidden", {
        "h-36": size === "sm",
      })}>
        <img 
          src={
            service?.coverImageUrl
              ? buildAvatarUrl(service.coverImageUrl) || "/images/coverImage.png"
              : "/images/coverImage.png"
          }
          alt={service?.title || "Service"} 
          className="block w-full h-full object-cover m-0" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className={cn("absolute bottom-3 left-3 right-3 text-white", {
          "bottom-2 left-2 right-2": size === "sm",
        })}>
          <div className={cn("flex items-center gap-3", {
            "gap-2": size === "sm",
          })}>
            <span className={cn("flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg", {
              "px-1.5 py-0.5": size === "sm",
            })}>
              <Star className={cn("w-4 h-4 fill-yellow-400 text-yellow-400", {
                "w-3 h-3": size === "sm",
              })} />
              <span className={cn("font-bold text-sm", {
                "text-xs": size === "sm",
              })}>
                {service?.averageReviewScore || '0.0'}
              </span>
            </span>
            <span className={cn("bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg text-sm", {
              "px-1.5 py-0.5 text-xs": size === "sm",
            })}>
              {Number(enrollmentCount).toLocaleString()} enrolled
            </span>
          </div>
        </div>
      </div>
      
      <div className={cn("pt-0 space-y-0 px-4", {
        "pt-0 space-y-0 px-3.5": size === "sm",
      })}>
        <CardTitle
          className={cn("mt-4 line-clamp-2 text-base leading-tight lg:text-lg font-bold text-slate-900", {
            "text-[.92rem] font-medium leading-tight": size === "sm",
          })}
        >
          {service?.title || "Untitled Service"}
        </CardTitle>
      </div>

      <CardDescription
        className={cn("pt-1 line-clamp-3 px-4", {
          "pt-1 text-xs px-3.5": size === "sm",
        })}
      >
        {service?.tagline || "No description available"}
      </CardDescription>

      <div className={cn("!mt-auto pt-3 px-4 pb-4", {
        "pt-3 px-3.5 pb-3.5": size === "sm",
      })}>
        <Button variant="primary" className={cn("mt-4 w-full text-sm lg:text-base py-2", {
          "text-xs py-1.5": size === "sm",
        })}>
          Join the Trend
        </Button>
      </div>
    </Card>
  );
};

export default ServiceCard;