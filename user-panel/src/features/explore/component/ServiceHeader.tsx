import React from "react";
import { Card } from "@/components/base/Card";
import Button from "@/components/base/Button";
import Badge from "@/components/base/Badge";
import {
  StarFilledIcon,
  ClockIcon,
} from "@radix-ui/react-icons";
import StudentCountLabel from "@/components/widgets/StudentCountLabel";
import { buildAvatarUrl } from "@/features/app/components/Navbar";

interface ServiceHeaderProps {
  service: any;
  educator: any;
  discountedPrice: number;
  onEnroll: () => void;
  formatReadableHours: (minutes: number) => string;
}

export default function ServiceHeader({
  service,
  educator,
  discountedPrice,
  onEnroll,
  formatReadableHours,
}: ServiceHeaderProps) {

    const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  return (
    <>
      {/* Compact Hero Section */}
      <div className="relative mb-6">
        <div className="relative h-48 lg:h-56 lg:rounded-2xl overflow-hidden bg-gradient-to-br from-primary-100 to-secondary-100">
          
          <img
            alt="service cover"
            src={
              service.coverImageUrl
                ? buildAvatarUrl(service.coverImageUrl)!!
                : "/images/coverImage.png"
            }
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>

          {/* Discount badge */}
          {service.discountEnabled && (
            <div className="absolute top-4 right-4">
              <Badge className="bg-red-500 text-white font-semibold px-3 py-1">
                {service.discount}% OFF
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Title and Quick Info Card */}
      <Card className=" p-6 lm:p-0 pt-0 bg-white shadow-none border-none ">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex-1">
            <div className="mb-3 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <StarFilledIcon className="size-4 text-yellow-500" />
                <span className="font-semibold">
                  {service.averageReviewScore}
                </span>
                <span className="text-gray-600">
                  ({service.totalReviewCount} reviews)
                </span>
              </div>
              <StudentCountLabel
                count={Number(service.enrollmentCount)}
              />
            </div>

            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              {service.title}
            </h1>

            <p className="text-lg text-gray-600 ">
              {service.tagline}
            </p>
          </div>

          {/* Mobile pricing preview */}
          <div className="lg:hidden w-full">
            <div className="w-full">
              <div className="text-2xl font-bold text-gray-900">
                ${discountedPrice.toFixed(2)}
              </div>
              {service.discountEnabled && (
                <div className="text-sm text-gray-400 line-through">
                  ${service.price.toFixed(2)}
                </div>
              )}
              <Button
                onClick={onEnroll}
                className="w-full mt-3"
                size="lg"
              >
                Enroll Now
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Educator Info */}
{educator && (
  <Card className="mb-6 p-4 bg-white shadow-none border-none lg:shadow-sm lg:border lg:border-gray-200">
    <div className="flex items-center gap-3">
      {educator.profileImage ? (
        <img
          src={
            educator.profileImage
            ? buildAvatarUrl(educator.profileImage)!!
            : "/images/coverImage.png"
          } 
          alt={educator.name}
          className="size-16 rounded-full object-cover"
        />
      ) : (
        <div className="size-16 rounded-full bg-gray-100 flex items-center justify-center">
          <span className="text-gray-600 font-medium">
            {getInitials(educator.name)}
          </span>
        </div>
      )}
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 text-lg">
          {educator.name}
        </h3>
        <p className="text-sm text-gray-600">Service Provider</p>
      </div>
      <Button
        variant="primary"
        size="sm"
        onClick={() => {
          document
            .getElementById("provider-section")
            ?.scrollIntoView({ behavior: "smooth", block: "start"  });
        }}
      >
        View Profile
      </Button>

    </div>
  </Card>
)}

    </>
  );
}