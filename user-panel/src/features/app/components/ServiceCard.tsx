import { useRouter } from "next/navigation";

import { Card, CardDescription, CardTitle } from "@/components/base/Card";
import { cn } from "@/lib/className";
import { Service } from "@/types";
import {
  formatDurationFromSeconds} from "@/lib/helpers/formatUtils";
import { S3_BUCKET_URL } from "@/lib/constants";
import StudentCountLabel from "@/components/widgets/StudentCountLabel";
import {useGeneralUser} from "@/lib/hooks/useUser";
import Image from "next/image";
import React from "react";
import {buildAvatarUrl} from "@/features/app/components/Navbar";
import { Star } from "lucide-react";

interface Props {
  size?: "sm" | "md";
  service?: Service; // TODO: Should be changed to required later.
  className?: string;
}

// TODO: Remove hardcoded values later
const ServiceCard = ({ size = "md", service, className }: Props) => {
  const router = useRouter();

  const { data: educator } = useGeneralUser(service ? service?.providerId : "1");

  const handleCardClick = () => {
    if (service) {
      router.push(`/service/${service.slug}`);
    } else {
      router.push(`/course/n-a`); // TODO: Should be changed to 404 page
    }
  };

  return (
    <Card
      onClick={handleCardClick}
      className={cn(
        "flex h-full w-full min-w-80 max-w-[25rem] cursor-pointer select-none flex-col space-y-2 overflow-hidden rounded-3xl p-4 transition-colors duration-300 ease-in-out hover:border-primary-100 hover:bg-primary-50/60 active:border-primary-300 lg:space-y-3.5",
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


        {/* TODO: Temporarily disabled review score */}
        {/* <span>•</span>

        <span
          className={cn("flex items-center gap-2", {
            "gap-1": size === "sm",
          })}
        >
          <StarFilledIcon className="size-4 text-status-yellow" />
          {course ? course?.averageReviewScore : "4.8"}
          <span className="text-xs font-light text-dark-300">
            ({formatReviewCount(course ? course?.totalReviewCount : "4000")}{" "}
            reviews)
          </span>
        </span> */}
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
        {/* <span>
          {formatDurationFromSeconds(service ? service?.duration : 278)} total
          time
        </span> */}

        <StudentCountLabel count={Number(service?.enrollmentCount)} />
      </CardDescription>
    </Card>
  );
};

export default ServiceCard;
