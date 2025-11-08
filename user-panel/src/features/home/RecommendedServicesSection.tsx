"use client"

import React from "react"
import { ArrowRightIcon } from "@radix-ui/react-icons"
import { useRouter } from "next/navigation"
import useEmblaCarousel from "embla-carousel-react"
import { Service } from "@/types"
import { SkeletonServicesCard } from "@/features/explore/component/SkeletonCourseCard"
import ServiceCard from "@/features/app/components/ServiceCard"

interface RecommendedServicesSectionProps {
  services: Service[]
  loading: boolean
  error: Error | null
}

function RecommendedServicesSection({
  services,
  loading,
  error,
}: RecommendedServicesSectionProps) {
  const router = useRouter()
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
              <div className="h-4 sm:h-5 w-24 sm:w-32 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="h-6 sm:h-8 w-48 sm:w-64 bg-gray-200 rounded mx-auto mb-3 animate-pulse" />
            <div className="h-4 sm:h-5 w-72 sm:w-96 max-w-full bg-gray-200 rounded mx-auto animate-pulse" />
          </div>
          <div className="flex flex-col sm:flex-row sm:gap-6 lg:gap-8 justify-center">
            <div className="flex-[0_0_100%] sm:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)] mb-6 sm:mb-0">
              <SkeletonServicesCard size="sm" />
            </div>
            <div className="hidden sm:block flex-[0_0_100%] sm:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)] mb-6 lg:mb-0">
              <SkeletonServicesCard size="sm" />
            </div>
            <div className="hidden lg:block flex-[0_0_100%] lg:flex-[0_0_calc(33.333%-16px)]">
              <SkeletonServicesCard size="sm" />
            </div>
          </div>
        </div>
      </section>
    )
  }
  if (error) {
    return (
      <section className="py-10 sm:py-16 text-center px-4">
        <p className="text-gray-500 text-sm sm:text-base">{error.message || "Failed to load recommended services."}</p>
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
          <span className="inline-flex items-center px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
            Personalized Learning Path
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 sm:mb-3 px-4">Recommended for You</h2>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto px-4">
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
            <div className="flex gap-4 sm:gap-6">
              {services.map((service) => (
                <div key={service.id} className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)]">
                  <ServiceCard service={service} size="sm" variant="default" />
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
            <div className="flex justify-center items-center gap-2 mt-4 text-xs sm:text-sm text-gray-500 md:hidden">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              <span>Swipe to explore more</span>
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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