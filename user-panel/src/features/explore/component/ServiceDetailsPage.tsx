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
import { useExploreState } from "@/features/explore/context/useExploreState";
import ServiceHeader from "./ServiceHeader";
import ServiceSidebar from "./ServiceSidebar";
import ServiceContent from "./ServiceContent";
import { SkeletonServiceDetailsPage } from "./SkeletonServiceDetailsPage";
import ServiceFAQ from "./ServiceFAQ";
import ShareServiceModal from "@/features/explore/component/ShareServiceModal";
import {setServiceId, setShowServiceShareModal} from "@/features/app/context/AppState";
import ReviewCarousel from "@/components/widgets/ReviewCarousel";
import { useReviewByService} from "@/lib/hooks/useReview";

export default function ServiceDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { serviceSlug } = useExploreState();
  const [pageLimit, setPageLimit] = useState(4);
  const [pageOffset, setPageOffset] = useState(0);
  const [starFilter, setStarFilter] = useState<number>(0);


  const {
    data: service,
    isLoading,
    error,
  } = useServiceBySlug(serviceSlug || slug || "");
  const { data: educator,isLoading:educatorLoading } = useGeneralUser(service?.serviceDetails?.data.provider.id ?? undefined);

  const serviceId  = service?.serviceDetails?.data?.id;


  const {
    data: reviews,
    isLoading: reviewLoading,
    error: reviewError,
  } = useReviewByService(
      { serviceId: serviceId!, stars: starFilter, limit: pageLimit, offset: pageOffset },
  );


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
      console.log("Enrolling in service:", service.serviceDetails.data.id);
    }
  };

  useEffect(() => {
    if (service) {
      setServiceId(service.serviceDetails.data.id)
    }
  }, [service]);


  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleShareService = () => {
    setShowServiceShareModal(true)
  };

  const handleContact = () => {
    // Add your contact/chat functionality here
    console.log("Opening contact/chat with provider:", service?.serviceDetails?.data.provider.id);
    // For example, you might want to:
    // - Open a chat modal
    // - Navigate to a chat page
    // - Show a contact form
    // - etc.
  };

  if (isLoading || educatorLoading ||reviewLoading) {
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

  if (error || !service || !educator || !reviews) {
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

  const discountedPrice = service.serviceDetails.data.discountEnabled
    ? service.serviceDetails.data.price - (service.serviceDetails.data.price * service.serviceDetails.data.discount) / 100
    : service.serviceDetails.data.price;

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
            <IconButton onClick={handleShareService}>
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
              service={service.serviceDetails.data}
              educator={educator}
              discountedPrice={discountedPrice}
              onEnroll={handleEnroll}
              formatReadableHours={formatReadableHours}
              onContact={handleContact}

            />

            <ReviewCarousel apiReviews={reviews.data}/>

            <ServiceContent service={service.serviceDetails.data} educator={educator} />
             {/* FAQ Section*/}
            <ServiceFAQ faqs={service.faqData} />
          </div>

          <ServiceSidebar
            service={service.serviceDetails.data}
            discountedPrice={discountedPrice}
            isBookmarked={isBookmarked}
            onEnroll={handleEnroll}
            onBookmark={handleBookmark}
            onShare={handleShareService}
            onContact={handleContact}
            formatReadableHours={formatReadableHours}
            isScrolled={isScrolled}
            providerId={service.serviceDetails.data.provider.id}
            educator={educator}
          />         
        </div>
      </div>
      <ShareServiceModal />


      <Bottombar />
    </div>
  );
}