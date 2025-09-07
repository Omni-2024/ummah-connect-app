"use client";
import { useRouter, useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
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
import ServiceHeader from "./ServiceHeader";
import ServiceSidebar from "./ServiceSidebar";
import ServiceContent from "./ServiceContent";
import { SkeletonServiceDetailsPage } from "./SkeletonServiceDetailsPage";

export default function ServiceDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { serviceSlug } = useExploreState();

  const {
    data: service,
    isLoading,
    error,
  } = useServiceBySlug(serviceSlug || slug || "");
  const { data: educator } = useGeneralUser(service?.provider?.id ?? undefined);

  // Scroll detection effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      // You can adjust this threshold value as needed
      const scrollThreshold = 100;
      setIsScrolled(scrollPosition > scrollThreshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Check initial scroll position
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
        <SkeletonServiceDetailsPage />
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
            <ServiceHeader
              service={service}
              educator={educator}
              discountedPrice={discountedPrice}
              onEnroll={handleEnroll}
              formatReadableHours={formatReadableHours}
            />

            <ServiceContent service={service} />
          </div>

          <ServiceSidebar
            service={service}
            discountedPrice={discountedPrice}
            isBookmarked={isBookmarked}
            onEnroll={handleEnroll}
            onBookmark={handleBookmark}
            onShare={handleShare}
            formatReadableHours={formatReadableHours}
            // Pass the scroll state to ServiceSidebar if it contains pricing details
            isScrolled={isScrolled}
          />         
        </div>
      </div>

      <Bottombar />
    </div>
  );
}