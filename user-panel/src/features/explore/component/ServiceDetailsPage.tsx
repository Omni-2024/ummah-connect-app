"use client";
import { useRouter, useParams } from "next/navigation";
import React, { useState } from "react";
import { useGeneralUser } from "@/lib/hooks/useUser";
import { useServiceBySlug } from "@/lib/hooks/useServices";
import { formatDurationFromSeconds } from "@/lib/helpers/formatUtils";
import { buildAvatarUrl } from "@/features/app/components/Navbar";
import Navbar from "@/features/app/components/Navbar";
import NavbarMobile, {
  NavbarTitle,
} from "@/features/app/components/Navbar.mobile";
import Bottombar from "@/features/app/components/Bottombar";
import { Card, CardContent } from "@/components/base/Card";
import Button from "@/components/base/Button";
import Badge from "@/components/base/Badge";
import IconButton from "@/components/base/IconButton";
import {
  ArrowLeftIcon,
  StarFilledIcon,
  ClockIcon,
  BookmarkIcon,
  Share1Icon,
} from "@radix-ui/react-icons";
import StudentCountLabel from "@/components/widgets/StudentCountLabel";
import { useExploreState } from "@/features/explore/context/exploreState";

export default function ServiceDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { serviceSlug } = useExploreState();

  const {
    data: service,
    isLoading,
    error,
  } = useServiceBySlug(serviceSlug || slug || "");
  const { data: educator } = useGeneralUser(service?.provider?.id ?? undefined);

  function formatReadableHours(minutes: number): string {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs > 0 && mins > 0) return `${hrs} hr ${mins} min`;
    if (hrs > 0) return `${hrs} hr${hrs > 1 ? "s" : ""}`;
    return `${mins} min`;
  }

  const handleBack = () => {
    router.back();
  };

  const handleEnroll = () => {
    if (service) {
      console.log("Enrolling in service:", service.id);
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: service?.title,
        text: service?.tagline,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-white pb-16 lg:pb-0">
        <Navbar />
        <NavbarMobile
          className="px-4"
          left={
            <div className="flex items-center gap-3">
              <IconButton onClick={handleBack}>
                <ArrowLeftIcon className="size-5" />
              </IconButton>
              <NavbarTitle title="Loading..." size="md" />
            </div>
          }
        />
        <div className="container px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-48 w-full bg-gray-200 rounded-2xl lg:h-40"></div>
            <div className="h-8 w-3/4 bg-gray-200 rounded"></div>
            <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
            <div className="h-32 w-full bg-gray-200 rounded"></div>
          </div>
        </div>
        <Bottombar />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen w-full bg-white pb-16 lg:pb-0">
        <Navbar />
        <NavbarMobile
          className="px-4"
          left={
            <div className="flex items-center gap-3">
              <IconButton onClick={handleBack}>
                <ArrowLeftIcon className="size-5" />
              </IconButton>
              <NavbarTitle title="Error" size="md" />
            </div>
          }
        />
        <div className="container px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Service Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The service you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => router.push("/explore")}>
              Explore Services
            </Button>
          </div>
        </div>
        <Bottombar />
      </div>
    );
  }

  const discountedPrice = service.discountEnabled
    ? service.price - (service.price * service.discount) / 100
    : service.price;

  return (
    <div className="min-h-screen w-full bg-white pb-16 lg:pb-0">
      <Navbar />
      <NavbarMobile
        className="px-4"
        left={
          <div className="flex items-center gap-3">
            <IconButton onClick={handleBack}>
              <ArrowLeftIcon className="size-5" />
            </IconButton>
            <NavbarTitle title="Service" size="md" />
          </div>
        }
        right={
          <div className="flex items-center gap-2">
            <IconButton onClick={handleBookmark}>
              <BookmarkIcon
                className={`size-5 ${
                  isBookmarked ? "fill-primary-500 text-primary-500" : ""
                }`}
              />
            </IconButton>
            <IconButton onClick={handleShare}>
              <Share1Icon className="size-5" />
            </IconButton>
          </div>
        }
      />

      <div className="container py-4 lg:px-20 lg:py-10">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
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

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <ClockIcon className="size-4" />
                      {formatReadableHours(service.duration)}
                    </div>
                    <div className="flex items-center gap-1">
                      <StarFilledIcon className="size-4" />
                      {service.cmePoints} CME Points
                    </div>
                    <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                      CME ID: {service.cmeId}
                    </div>
                  </div>
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
                      onClick={handleEnroll}
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
                    <p className="text-sm text-gray-600">Course Instructor</p>
                  </div>
                  <Button variant="primary" size="sm">
                    View Profile
                  </Button>
                </div>
              </Card>
            )}

            {/* Content Tabs */}
            <div className="space-y-6">
              {/* Description */}
              <Card className="p-6 pt-0 bg-white shadow-none border-none lg:shadow-sm lg:border lg:border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  About this Service
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {service.description}
                </p>
              </Card>

              {/* Learning Points */}
              {service.learningPoints && service.learningPoints.length > 0 && (
                <Card className="lg:p-6 p-6 pt-0 bg-white shadow-none border-none lg:shadow-sm lg:border lg:border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    What You'll Learn
                  </h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {service.learningPoints.map((point, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 rounded-lg bg-green-50"
                      >
                        <div className="size-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs font-bold">
                            ✓
                          </span>
                        </div>
                        <span className="text-gray-700 text-sm">{point}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </div>

          {/* Sticky Sidebar */}
          {/* Sidebar - only visible on large screens */}
          <div className="hidden lg:block lg:col-span-1 mt-6 lg:mt-0">
            <div className="sticky top-16">
              <Card className="m-6 p-4 lg:m-0 bg-white lg:shadow-lg border border-gray-200">
                {/* Heading */}
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Pricing Details
                </h2>

                {/* Pricing */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-bold text-gray-900">
                      ${discountedPrice}
                    </span>
                    {service.discountEnabled && (
                      <span className="text-lg text-gray-400 line-through">
                        ${service.price}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">One-time payment</p>
                </div>

                {/* Enrollment Button */}
                <Button
                  onClick={handleEnroll}
                  className="w-full mb-4"
                  size="lg"
                >
                  Enroll Now
                </Button>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-xl font-bold text-gray-900">
                      {formatReadableHours(service.duration)}
                    </div>
                    <div className="text-xs text-gray-600">Duration</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-xl font-bold text-gray-900">
                      {service.cmePoints}
                    </div>
                    <div className="text-xs text-gray-600">CME Points</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-6 pt-4 border-t border-gray-200">
                  <Button
                    variant="primary"
                    onClick={handleBookmark}
                    className="flex-1"
                  >
                    <BookmarkIcon className="size-4 mr-1" />
                    {isBookmarked ? "Saved" : "Save"}
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleShare}
                    className="flex-1"
                  >
                    <Share1Icon className="size-4 mr-1" />
                    Share
                  </Button>
                </div>
              </Card>
            </div>
          </div>

          {/* Mobile Buttons */}
          <div className="flex gap-2 m-6 lg:hidden">
            <Button
              variant="primary"
              onClick={handleBookmark}
              className="flex-1"
            >
              <BookmarkIcon className="size-4 mr-1" />
              {isBookmarked ? "Saved" : "Save"}
            </Button>
            <Button variant="primary" onClick={handleShare} className="flex-1">
              <Share1Icon className="size-4 mr-1" />
              Share
            </Button>
          </div>
        </div>
      </div>

      <Bottombar />
    </div>
  );
}
