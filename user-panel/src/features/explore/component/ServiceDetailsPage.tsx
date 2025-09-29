"use client";
import { useRouter, useParams, usePathname, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useCurrentUser, useGeneralUser } from "@/lib/hooks/useUser";
import { useServiceBySlug, useServiceEnrollmentStatus } from "@/lib/hooks/useServices";
import Navbar from "@/features/app/components/Navbar";
import NavbarMobile, {
  NavbarTitle,
} from "@/features/app/components/Navbar.mobile";
import Bottombar from "@/features/app/components/Bottombar";
import { Card, CardContent } from "@/components/base/Card";
import Button from "@/components/base/Button";
import IconButton from "@/components/base/IconButton";
import {
  ArrowLeftIcon,
  StarFilledIcon,
  ClockIcon,
  BookmarkIcon,
  Share1Icon, ArrowRightIcon,
} from "@radix-ui/react-icons";
import StudentCountLabel from "@/components/widgets/StudentCountLabel";
import { useExploreState } from "@/features/explore/context/useExploreState";
import ServiceHeader from "./ServiceHeader";
import ServiceSidebar from "./ServiceSidebar";
import ServiceContent from "./ServiceContent";
import { SkeletonServiceDetailsPage } from "./SkeletonServiceDetailsPage";
import ServiceFAQ from "./ServiceFAQ";
import ShareServiceModal from "@/features/explore/component/ShareServiceModal";
import { setServiceId, setShowServiceShareModal } from "@/features/app/context/AppState";
import ReviewCarousel from "@/components/widgets/ReviewCarousel";
import { useReviewByService } from "@/lib/hooks/useReview";
import { createLoginUrl } from "@/lib/helpers/urls";
import { useAuthState } from "@/features/auth/context/useAuthState";
import Footer from "@/features/app/components/Footer";
import { ServiceEnrollmentStatus } from "@/lib/endpoints/serviceFns";
import { enrollUserToServiceFn } from "@/lib/endpoints/enrollmentFns";
import { useMutation } from "@tanstack/react-query";
import { Toast } from "@/components/base/Toast";
import { generateSlug } from "@/lib/helpers/strings";

export default function ServiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
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
  const { data: educator, isLoading: educatorLoading } = useGeneralUser(service?.serviceDetails?.data.provider.id ?? undefined);

  const serviceId = service?.serviceDetails?.data?.id;

  const { data: currentUser, isLoading: isCurrentUserLoading } =
    useCurrentUser();

  const { isAuthenticated } = useAuthState()

  const {
    data: enrollmentStatus,
    isLoading: isEnrollmentStatusLoading,
    isPending: isEnrollmentStatusPending,
  } = useServiceEnrollmentStatus({
    uid: currentUser?.id,
    service: service?.serviceDetails.data,
  });

  const { mutate: enrollUser, isPending: isUserEnrolling } = useMutation({
    mutationFn: enrollUserToServiceFn,
    onSuccess: () => {
      Toast.success("Enrolled successfully!");
      // router.push(`/learn/${generateSlug(course?.title ?? "")}_${course?.id}`);
    },
    onError: () => {
      Toast.error("Enrollment failed. Please try again.");
    },
  });


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
      const scrollThreshold = 100;
      setIsScrolled(scrollPosition > scrollThreshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
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

  const handlePurchaseNow = () => {
    if (service) {
      console.log("Enrolling in service:", service.serviceDetails.data.id);
    }
    if (!isAuthenticated) {
      handleAuthRedirect("purchase");
    }

    router.push(`/checkout/service/${service?.serviceDetails.data.id}`);
  };

  const goToService = () =>
    router.push(`/learn/${generateSlug(service?.serviceDetails.data?.title ?? "")}_${service?.serviceDetails.data?.id}`);



  const EnrollmentButton = () => {
    if (isEnrollmentStatusLoading || isCurrentUserLoading || isLoading)
      return (
        <Button className="h-12 w-full" size="lg" disabled isLoading></Button>
      );

    if (!isAuthenticated && !service?.serviceDetails.data?.isArchived) {
      if (service?.serviceDetails.data.price === 0)
        return (
          <Button
            className="h-12 w-full"
            size="lg"
            onClick={() => handleAuthRedirect("enroll")}
            isLoading={isAuthenticated ? isEnrollmentStatusPending : false}
          >
            Enroll now
          </Button>
        );
      else
        return (
          <Button
            className="h-12 w-full"
            size="lg"
            onClick={() => handleAuthRedirect("purchase")}
            isLoading={isAuthenticated ? isEnrollmentStatusPending : false}
          >
            Purchase now
          </Button>
        );
    }

    if (enrollmentStatus === ServiceEnrollmentStatus.ENROLL_NOW && !service?.serviceDetails.data?.isArchived)
      return (
        <Button
          className="h-12 w-full"
          size="lg"
          onClick={() => {
            if (!isAuthenticated) return router.push("/user/login");
            enrollUser({
              serviceId: service?.serviceDetails.data?.id ?? "",
              userId: currentUser?.id ?? "",
            });
          }}
          disabled={isUserEnrolling}
          isLoading={isUserEnrolling}
        >
          Enroll now <ArrowRightIcon className="size-4" />
        </Button>
      );

    if (enrollmentStatus === ServiceEnrollmentStatus.PURCHASE_NOW)
      return (
        <Button
          className="h-12 w-full"
          size="lg"
          onClick={handlePurchaseNow}
          isLoading={isAuthenticated ? isEnrollmentStatusPending : false}
        >
          Purchase now
        </Button>
      );

    if (enrollmentStatus === ServiceEnrollmentStatus.GO_TO_COURSE)
      return (
        <Button
          className="h-12 w-full"
          size="lg"
          onClick={goToService}
          isLoading={isEnrollmentStatusPending}
        >
          Go to Service <ArrowRightIcon className="size-4" />
        </Button>
      );

    return (
      <Button className="h-12 w-full" size="lg" disabled>
        Enroll now
      </Button>
    );
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

  const handleAuthRedirect = (action: "enroll" | "purchase") => {
    const currentPath = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
    router.push(createLoginUrl(currentPath, action));
  };


  const handleContact = () => {
    console.log("Opening contact/chat with provider:", service?.serviceDetails?.data.provider.id);
  };

  if (isLoading || educatorLoading || reviewLoading) {
    return (
      <div className="min-h-screen w-full bg-gray-50 pb-16 lg:pb-0">
        <Navbar />
        <NavbarMobile
          className="px-4 bg-white border-b border-gray-100"
          left={
            <div className="flex items-center gap-3">
              <IconButton onClick={handleBack} className="hover:bg-gray-100">
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
      <div className="min-h-screen w-full bg-gray-50 pb-16 lg:pb-0">
        <Navbar />
        <NavbarMobile
          className="px-4 bg-white border-b border-gray-100"
          left={
            <div className="flex items-center gap-3">
              <IconButton onClick={handleBack} className="hover:bg-gray-100">
                <ArrowLeftIcon className="size-5" />
              </IconButton>
              <NavbarTitle title="Error" size="md" />
            </div>
          }
        />
        <div className="container px-4 py-8">
          <div className="text-center bg-white rounded-xl p-8 shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-gray-400">!</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Service Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The service you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => router.push("/explore")} className="px-6">
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
    <div className="min-h-screen w-full bg-gray-50 pb-20 lg:pb-0">
      <Navbar />
      <NavbarMobile
        className="px-4 bg-white border-b border-gray-100 sticky top-0 z-40"
        left={
          <div className="flex items-center gap-3">
            <IconButton onClick={handleBack} className="hover:bg-gray-100 transition-colors">
              <ArrowLeftIcon className="size-5" />
            </IconButton>
            <NavbarTitle title="Service" size="md" />
          </div>
        }
        right={
          <div className="flex items-center gap-2">
            <IconButton
              onClick={handleBookmark}
              className="hover:bg-gray-100 transition-colors"
            >
              <BookmarkIcon
                className={`size-5 ${isBookmarked ? "fill-primary-500 text-primary-500" : ""
                  }`}
              />
            </IconButton>
            <IconButton
              onClick={handleShareService}
              className="hover:bg-gray-100 transition-colors"
            >
              <Share1Icon className="size-5" />
            </IconButton>
          </div>
        }
      />

      <div className="lg:container lg:py-10 lg:px-20">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* ServiceHeader - Contains title, educator info, image, and contact functionality */}
            <div className="bg-white lg:bg-transparent px-4 lg:px-0">
              <ServiceHeader
                service={service.serviceDetails.data}
                educator={educator}
                discountedPrice={discountedPrice}
                enrollmentButton={<EnrollmentButton />}
                formatReadableHours={formatReadableHours}
                onContact={handleContact}
                providerId={service.serviceDetails.data.provider.id}
              />
            </div>

            {/* Mobile content with proper spacing */}
            <div className="px-4 lg:px-0 mt-4 space-y-4">
              {/* Learning Points Section - Mobile Only (since desktop has it in sidebar) */}
              {service.serviceDetails.data.learningPoints && service.serviceDetails.data.learningPoints.length > 0 && (
                <Card className="lg:hidden p-4 bg-white">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Learning Points
                  </h2>
                  <div className="space-y-3">
                    {service.serviceDetails.data.learningPoints.map((point: string, index: number) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="size-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-green-600 text-xs font-medium">✓</span>
                        </div>
                        <span className="text-gray-700 text-sm">{point}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Reviews Carousel */}
              <ReviewCarousel apiReviews={reviews.data} />

              {/* Service Content */}
              <ServiceContent
                service={service.serviceDetails.data}
                educator={educator}
                providerId={service.serviceDetails.data.provider.id}
              />

              {/* FAQ Section */}
              <ServiceFAQ faqs={service.faqData} />

              {/* Extra spacing for mobile bottom bar */}
              <div className="lg:hidden h-6"></div>
            </div>
          </div>

          {/* Desktop Sidebar - Hidden on mobile */}
          <div className="hidden lg:block lg:col-span-1">
            <ServiceSidebar
              service={service.serviceDetails.data}
              discountedPrice={discountedPrice}
              isBookmarked={isBookmarked}
              enrollmentButton={<EnrollmentButton />}
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
      </div>

      {/* Mobile bottom action bar */}
      <div className="lg:hidden fixed bottom-16 left-0 right-0 p-4 bg-white border-t border-gray-200 z-30 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="text-xs text-gray-500 mb-1">Price</div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-gray-900">
                ${discountedPrice.toFixed(2)}
              </span>
              {service.serviceDetails.data.discountEnabled && (
                <span className="text-sm text-gray-400 line-through">
                  ${service.serviceDetails.data.price.toFixed(2)}
                </span>
              )}
            </div>
          </div>
          {/*<Button*/}
          {/*  onClick={handleEnroll}*/}
          {/*  className="px-8 py-3 text-base font-semibold shadow-sm"*/}
          {/*  size="lg"*/}
          {/*>*/}
          {/*  Enroll Now*/}
          {/*</Button>*/}
          <EnrollmentButton />
        </div>
      </div>

      <ShareServiceModal />
      <Bottombar />
      <Footer />
    </div>
  );
}