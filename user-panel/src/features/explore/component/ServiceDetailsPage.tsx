"use client"

import { useRouter, useParams, usePathname, useSearchParams } from "next/navigation"
import React, { useState, useEffect, useRef } from "react"
import { useCurrentUser, useGeneralUser } from "@/lib/hooks/useUser"
import { useServiceBySlug, useServiceEnrollmentStatus } from "@/lib/hooks/useServices"
import Navbar from "@/features/app/components/Navbar"
import NavbarMobile, { NavbarTitle } from "@/features/app/components/Navbar.mobile"
import Bottombar from "@/features/app/components/Bottombar"
import { Card } from "@/components/base/Card"
import Button from "@/components/base/Button"
import IconButton from "@/components/base/IconButton"
import {
  ArrowLeftIcon,
  BookmarkIcon,
  Share1Icon,
  ArrowRightIcon,
} from "@radix-ui/react-icons"
import { useExploreState } from "@/features/explore/context/useExploreState"
import ServiceHeader from "./ServiceHeader"
import ServiceSidebar from "./ServiceSidebar"
import ServiceContent from "./ServiceContent"
import { SkeletonServiceDetailsPage } from "./SkeletonServiceDetailsPage"
import ServiceFAQ from "./ServiceFAQ"
import ShareServiceModal from "@/features/explore/component/ShareServiceModal"
import { setServiceId, setShowServiceShareModal } from "@/features/app/context/AppState"
import ReviewCarousel from "@/components/widgets/ReviewCarousel"
import AllReviews from "./reviews/AllReviews"
import { useReviewByService } from "@/lib/hooks/useReview"
import { createLoginUrl } from "@/lib/helpers/urls"
import { useAuthState } from "@/features/auth/context/useAuthState"
import Footer from "@/features/app/components/Footer"
import { ServiceEnrollmentStatus } from "@/lib/endpoints/serviceFns"
import {completeUserToServiceFn, enrollUserToServiceFn} from "@/lib/endpoints/enrollmentFns"
import {useMutation, useQueryClient} from "@tanstack/react-query"
import { Toast } from "@/components/base/Toast"
import { generateSlug } from "@/lib/helpers/strings"
import { buildAvatarUrl } from "@/features/app/components/Navbar"
import { getInitials } from "@/features/explore/component/ServiceHeader"
import ProviderServices from "./ProviderServices"
import { saveRecentlyViewedService } from "@/features/home/RecentlySearchedServicesSection"


export default function ServiceDetailsPage() {
  const queryClient = useQueryClient()
  const params = useParams()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const slug = params?.slug as string
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [avatarBroken, setAvatarBroken] = useState(false)
  const allReviewsRef = useRef<HTMLDivElement>(null)
  const { serviceSlug } = useExploreState()
  const [pageLimit, setPageLimit] = useState(4)
  const [pageOffset, setPageOffset] = useState(0)
  const [starFilter, setStarFilter] = useState<number[]>([])
  const { logout } = useAuthState()

  const {
    data: service,
    isLoading,
    error,
  } = useServiceBySlug(serviceSlug || slug || "")

  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false)

  const openCompleteConfirm = () => setShowCompleteConfirm(true)
  const closeCompleteConfirm = () => setShowCompleteConfirm(false)

  const confirmComplete = () => {
    if (!isAuthenticated) return router.push("/user/login")

    completeEnrollUser({
      serviceId: service?.serviceDetails.data?.id ?? "",
      userId: currentUser?.id ?? "",
    })

    closeCompleteConfirm()
  }


  // Only fetch educator data when we have the service and provider ID
  const { data: educator, isLoading: educatorLoading } = useGeneralUser(
    service?.serviceDetails?.data?.provider?.id ?? undefined
  )

  const serviceId = service?.serviceDetails?.data?.id

  const { data: currentUser, isLoading: isCurrentUserLoading } = useCurrentUser()
  const { isAuthenticated } = useAuthState()

  const avatarUrl = buildAvatarUrl(currentUser?.profileImage)

  const {
    data: enrollmentStatus,
    isLoading: isEnrollmentStatusLoading,
    isPending: isEnrollmentStatusPending,
    refetch: refetchEnrollmentStatus,
  } = useServiceEnrollmentStatus({
    uid: currentUser?.id,
    service: service?.serviceDetails.data,
  })

  const { mutate: enrollUser, isPending: isUserEnrolling } = useMutation({
    mutationFn: enrollUserToServiceFn,
    onSuccess: async() => {
      Toast.success("Enrolled successfully!")
      await refetchEnrollmentStatus()

    },
    onError: () => {
      Toast.error("Enrollment failed. Please try again.")
    },
  })

  const { mutate: completeEnrollUser, isPending: isUserCompleteEnrolling } = useMutation({
    mutationFn: completeUserToServiceFn,
    onSuccess: async() => {
      await refetchEnrollmentStatus()
      Toast.success("Service completed successfully!")
    },
    onError: () => {
      Toast.error("Service Completion failed. Please try again.")
    },
  })

  // Track service view when service data is loaded
  useEffect(() => {
    if (service?.serviceDetails?.data?.id) {
      saveRecentlyViewedService(service.serviceDetails.data.id)
    }
  }, [service?.serviceDetails?.data?.id])

  // Fetch ALL reviews for statistics (unfiltered)
  const {
    data: allReviewsForStats,
    isLoading: allReviewsLoading,
  } = useReviewByService({
    serviceId: serviceId!,
    stars: 0, // 0 means get all reviews
    limit: 1000, // High limit to get all reviews for statistics
    offset: 0,
  }, {
    enabled: !!serviceId // Only fetch when serviceId exists
  })

  // Fetch filtered reviews for display
  const {
    data: reviews,
    isLoading: reviewLoading,
    error: reviewError,
  } = useReviewByService({
    serviceId: serviceId!,
    stars: starFilter.length === 1 ? starFilter[0] : 0,
    limit: pageLimit,
    offset: pageOffset,
  }, {
    enabled: !!serviceId // Only fetch when serviceId exists
  })

  const handleLogout = () => {
    logout()
    router.push("/user/login")
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const scrollThreshold = 100
      setIsScrolled(scrollPosition > scrollThreshold)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  function formatReadableHours(minutes: number): string {
    const hrs = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hrs > 0 && mins > 0) return `${hrs} hr ${mins} min`
    if (hrs > 0) return `${hrs} hr${hrs > 1 ? "s" : ""}`
    return `${mins} min`
  }

  const handleBack = () => {
    router.back()
  }

  const handlePurchaseNow = () => {
    if (service) {
      console.log("Enrolling in service:", service.serviceDetails.data.id)
    }
    if (!isAuthenticated) {
      handleAuthRedirect("purchase")
    }
    router.push(`/checkout/service/${service?.serviceDetails.data.id}`)
  }

  const goToService = () =>
    router.push(
      `/learn/${generateSlug(service?.serviceDetails.data?.title ?? "")}_${service?.serviceDetails.data?.id}`
    )

  const EnrollmentButton = () => {
    if (isEnrollmentStatusLoading || isCurrentUserLoading || isLoading)
      return <Button className="h-12 w-full" size="lg" disabled isLoading></Button>

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
        )
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
        )
    }

    if (enrollmentStatus === ServiceEnrollmentStatus.ENROLL_NOW && !service?.serviceDetails.data?.isArchived)
      return (
        <Button
          className="h-12 w-full"
          size="lg"
          onClick={() => {
            if (!isAuthenticated) return router.push("/user/login")
            enrollUser({
              serviceId: service?.serviceDetails.data?.id ?? "",
              userId: currentUser?.id ?? "",
            })
          }}
          disabled={isUserEnrolling}
          isLoading={isUserEnrolling}
        >
          Enroll now <ArrowRightIcon className="size-4" />
        </Button>
      )

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
      )

    if (enrollmentStatus === ServiceEnrollmentStatus.COMPLETE_NOW)
      return (
          <Button
              className="h-12 w-full"
              size="lg"
              onClick={openCompleteConfirm}
              disabled={isUserCompleteEnrolling}
              isLoading={isUserCompleteEnrolling}
          >
            Mark as Complete <ArrowRightIcon className="size-4" />
          </Button>
      )


    return (
      <Button className="h-12 w-full" size="lg" disabled>
        Enroll now
      </Button>
    )
  }

  useEffect(() => {
    if (service) {
      setServiceId(service.serviceDetails.data.id)
    }
  }, [service])

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  const handleShareService = () => {
    setShowServiceShareModal(true)
  }

  const handleAuthRedirect = (action: "enroll" | "purchase") => {
    const currentPath =
      pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "")
    router.push(createLoginUrl(currentPath, action))
  }

  const handleContact = () => {
    console.log("Opening contact/chat with provider:", service?.serviceDetails.data.provider.id)
  }

  // Calculate rating breakdown from ALL reviews (unfiltered)
  const ratingBreakdown = React.useMemo(() => {
    if (!allReviewsForStats?.data) return { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }

    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    allReviewsForStats.data.forEach((review) => {
      if (review.stars >= 1 && review.stars <= 5) {
        breakdown[review.stars as keyof typeof breakdown]++
      }
    })
    return breakdown
  }, [allReviewsForStats?.data])

  // Calculate average rating from ALL reviews
  const averageRating = React.useMemo(() => {
    if (!allReviewsForStats?.data || allReviewsForStats.data.length === 0) return 0

    const total = allReviewsForStats.data.reduce((sum, review) => sum + review.stars, 0)
    return total / allReviewsForStats.data.length
  }, [allReviewsForStats?.data])

  const handleStarFilter = (stars: number[]) => {
    setStarFilter(stars)
    setPageOffset(0)
  }

  const handleSeeAllReviews = () => {
    setTimeout(() => {
      if (allReviewsRef.current) {
        const offset = 64
        const elementPosition = allReviewsRef.current.getBoundingClientRect().top + window.scrollY
        window.scrollTo({
          top: elementPosition - offset,
          behavior: "smooth",
        })
      }
    }, 100)
  }

  // Show loading state while any critical data is loading
  if (isLoading || educatorLoading) {
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
        <Bottombar
          user={currentUser}
          avatarUrl={avatarUrl}
          avatarBroken={avatarBroken}
          setAvatarBroken={setAvatarBroken}
          handleLogout={handleLogout}
        />
      </div>
    )
  }

  if (error || !service || !educator) {
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
        <Bottombar
          user={currentUser}
          avatarUrl={avatarUrl}
          avatarBroken={avatarBroken}
          setAvatarBroken={setAvatarBroken}
          handleLogout={handleLogout}
        />
      </div>
    )
  }

  const discountedPrice = service.serviceDetails.data.discountEnabled
    ? service.serviceDetails.data.price - (service.serviceDetails.data.price * service.serviceDetails.data.discount) / 100
    : service.serviceDetails.data.price

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
              {/* <BookmarkIcon
                className={`size-5 ${isBookmarked ? "fill-primary-500 text-primary-500" : ""}`}
              /> */}
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
          <div className="lg:col-span-2">
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

            <div className="px-4 lg:px-0 mt-4 space-y-4">
              {service.serviceDetails.data.learningPoints &&
                service.serviceDetails.data.learningPoints.length > 0 && (
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

              {reviews && <ReviewCarousel apiReviews={reviews.data} onSeeAllReviews={handleSeeAllReviews} />}

              <ServiceContent
                service={service.serviceDetails.data}
                educator={educator}
                providerId={service.serviceDetails.data.provider.id}
              />

              <ServiceFAQ faqs={service.faqData} />

              {reviews && allReviewsForStats && (
                <AllReviews
                  reviews={reviews.data}
                  ref={allReviewsRef}
                  totalReviews={allReviewsForStats?.data?.length || 0}
                  onLoadMore={() => {
                    setPageOffset((prevOffset) => prevOffset + pageLimit)
                  }}
                  isLoadingMore={reviewLoading}
                  averageRating={averageRating}
                  ratingBreakdown={ratingBreakdown}
                  onStarFilter={handleStarFilter}
                  activeStarFilter={starFilter}
                />
              )}

              <ProviderServices
                providerId={service.serviceDetails.data.provider.id}
                currentServiceId={service.serviceDetails.data.id}
                providerName={""}
              />
              <div className="lg:hidden h-6"></div>
            </div>
          </div>

          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 self-start">
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
      </div>

      <div className="lg:hidden fixed bottom-16 left-0 right-0 p-4 bg-white border-t border-gray-200 z-30 shadow-lg">
        <div className="flex items-center gap-3">
          <EnrollmentButton />
        </div>
      </div>

      <ShareServiceModal />
      <Bottombar
        user={currentUser}
        avatarUrl={avatarUrl}
        avatarBroken={avatarBroken}
        setAvatarBroken={setAvatarBroken}
        handleLogout={handleLogout}
      />
      <Footer />

      {showCompleteConfirm && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900">
                  Mark this service as complete?
                </h3>

                <p className="mt-2 text-sm text-gray-600">
                  By continuing, you confirm the service has been completed. This action may affect your access,
                  progress, certificates, or refunds (depending on your rules).
                </p>

                <div className="mt-5 flex items-center justify-end gap-3">
                  <Button
                      className="h-11"
                      variant="secondary"
                      onClick={closeCompleteConfirm}
                      disabled={isUserCompleteEnrolling}
                  >
                    Cancel
                  </Button>

                  <Button
                      className="h-11"
                      onClick={confirmComplete}
                      isLoading={isUserCompleteEnrolling}
                      disabled={isUserCompleteEnrolling}
                  >
                    Yes, Complete
                  </Button>
                </div>
              </div>
            </div>
          </div>
      )}


    </div>
  )
}