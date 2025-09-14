import React from "react";
import { Card } from "@/components/base/card";
import Button from "@/components/base/button";
import {Badge} from "@/components/base/badge";
import {
  StarFilledIcon,
  ClockIcon,
} from "@radix-ui/react-icons";
import StudentCountLabel from "@/components/widget/StudentCountLabel";
import envs from "@/lib/env";

interface ServiceHeaderProps {
  service: any;
  educator: any;
  discountedPrice: number;
}

export const buildAvatarUrl = (img?: string | null): string | null => {
  if (!img) return null;
  if (/^https?:\/\//i.test(img)) return img;
  const base = envs.imageBaseUrl;
  return `${base}/${img}`;
};

export default function ServiceHeader({
  service,
  educator,
  discountedPrice,
}: ServiceHeaderProps) {
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
      <Card className="mb-6 p-6 lm:p-0 pt-0 bg-white shadow-none border-none ">
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

            <p className="text-lg text-gray-600 mb-4">
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
            <div className="h-14 w-14 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold text-lg">
              {educator.name?.charAt(0) || "E"}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-lg">
                {educator.name}
              </h3>
              <p className="text-sm text-gray-600">Service Provider</p>
            </div>
            <Button variant="primary" size="sm">
              View Profile
            </Button>
          </div>
        </Card>
      )}
    </>
  );
}