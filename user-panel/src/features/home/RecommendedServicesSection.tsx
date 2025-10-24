"use client"

import React from "react"
import { ArrowRightIcon } from "@radix-ui/react-icons"
import { useRouter } from "next/navigation"
import useEmblaCarousel from "embla-carousel-react"
import { Service } from "@/types"
import { Card, CardDescription, CardTitle } from "@/components/base/Card"
import { cn } from "@/lib/className"
import { S3_BUCKET_URL } from "@/lib/constants"
import StudentCountLabel from "@/components/widgets/StudentCountLabel"
import { useGeneralUser } from "@/lib/hooks/useUser"
import Image from "next/image"
import { buildAvatarUrl } from "@/features/app/components/Navbar"
import { formatDurationFromSeconds } from "@/lib/helpers/formatUtils"
import { SkeletonServicesCard } from "@/features/explore/component/SkeletonCourseCard"
import ServiceCard from "@/features/app/components/ServiceCard"

interface RecommendedServicesSectionProps {
  services: Service[]
  loading: boolean
  error: Error | null
  router: ReturnType<typeof useRouter>
}

interface ServiceCardProps {
  size?: "sm" | "md"
  service?: Service
  className?: string
}

const ServiceCardComponent = ({ size = "md", service, className }: ServiceCardProps) => {
  const router = useRouter()
  const { data: educator } = useGeneralUser(service ? service?.providerId : "1")

  const handleCardClick = () => {
    if (service) {
      router.push(`/service/${service.slug}`)
    } else {
      router.push(`/course/n-a`)
    }
  }

  return (
    <Card
      onClick={handleCardClick}
      className={cn(
        "flex h-full w-full min-w-80 max-w-[25rem] cursor-pointer select-none flex-col space-y-2 overflow-hidden rounded-3xl p-4 transition-colors duration-300 ease-in-out hover:border-primary-100 hover:bg-primary-50/60 active:border-primary-300 lg:space-y-3.5",
        {
          "space-y-3 p-3.5 lg:min-w-72 lg:max-w-72": size === "sm",
        },
        className
      )}
    >
      <img
        alt="cover"
        src={
          service?.coverImageUrl
            ? buildAvatarUrl(service.coverImageUrl) || `${S3_BUCKET_URL}/images/coverImage.png`
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
          {service?.averageReviewScore ?? 5} ★
          <span>({service?.totalReviewCount ?? 0} reviews)</span>
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
        <span>
          {formatDurationFromSeconds(service ? service?.duration : 278)} total
          time
        </span>
        <StudentCountLabel count={Number(service?.enrollmentCount)} />
      </CardDescription>
    </Card>
  )
}

function RecommendedServicesSection({
  services,
  loading,
  error,
  router,
}: RecommendedServicesSectionProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    breakpoints: {
      "(min-width: 768px)": { slidesToScroll: 2 },
      "(min-width: 1024px)": { slidesToScroll: 3 },
    },
  })

  const [selectedIndex, setSelectedIndex] = React.useState(0)

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const onSelect = React.useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  React.useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on("select", onSelect)
    return () => {
      emblaApi.off("select", onSelect)
    }
  }, [emblaApi, onSelect])

  if (loading) {
    return (
      <section className="py-8 sm:py-10 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <div className="inline-flex items-center px-3 py-1.5 bg-emerald-50 rounded-full mb-4">
              <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="h-8 w-64 bg-gray-200 rounded mx-auto mb-3 animate-pulse" />
            <div className="h-5 w-96 bg-gray-200 rounded mx-auto animate-pulse" />
          </div>
          <div className="flex flex-col sm:flex-row sm:gap-6 lg:gap-8 justify-center">
            <div className="flex-[0_0_100%] sm:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)] mb-6 sm:mb-0">
              <SkeletonServicesCard />
            </div>
            <div className="flex-[0_0_100%] sm:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)] mb-6 sm:mb-0">
              <SkeletonServicesCard />
            </div>
            <div className="flex-[0_0_100%] sm:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)]">
              <SkeletonServicesCard />
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 text-center">
        <p className="text-gray-500">{error.message || "Failed to load recommended services."}</p>
      </section>
    )
  }

  if (!services || services.length === 0) {
    return null
  }

  return (
    <section className="py-8 sm:py-10 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <span className="inline-flex items-center px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium mb-4">
            Recommended for You
          </span>
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Personalized Learning Path</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Services tailored to your interests and professional goals
          </p>
        </div>

        <div className="relative">
          {services.length > 1 && (
            <>
              <button
                onClick={scrollPrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-all duration-200 hidden md:block"
                aria-label="Previous slide"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={scrollNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-all duration-200 hidden md:block"
                aria-label="Next slide"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {services.map((service) => (
                <div key={service.id} className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)]">
                  <ServiceCard service={service} size="md" />
                </div>
              ))}
            </div>
          </div>

          {services.length > 1 && (
            <div className="flex justify-center gap-2 mt-6 md:hidden">
              {services.map((_, index) => (
                <button
                  key={index}
                  onClick={() => emblaApi?.scrollTo(index)}
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: index === (emblaApi?.selectedScrollSnap() || 0) ? '24px' : '8px',
                    backgroundColor: index === (emblaApi?.selectedScrollSnap() || 0) ? '#10b981' : '#d1d5db',
                  }}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}

          {services.length > 1 && (
            <div className="flex justify-center items-center gap-2 mt-4 text-sm text-gray-500 md:hidden">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              <span>Swipe to explore more</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          )}
        </div>

        {/* <div className="text-center mt-12">
          <button
            onClick={() => router.push("/explore")}
            className="bg-slate-900 text-white px-8 py-4 rounded-2xl hover:bg-slate-800 transition font-semibold inline-flex items-center gap-2"
          >
            View All Services
            <ArrowRightIcon className="w-5 h-5" />
          </button>
        </div> */}
      </div>
    </section>
  )
}

export default RecommendedServicesSection