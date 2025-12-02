"use client"

import React from "react"
import ServiceCard from "@/features/app/components/ServiceCard"
import { SkeletonServicesCard } from "@/features/explore/component/SkeletonCourseCard"
import { Service } from "@/types"

export default function TrendingServicesSection({
  services,
  loading,
  error
}: {
  services: Service[]
  loading: boolean
  error: Error | null
}) {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = React.useState(0)

  const getEnrollmentCount = (service: Service): number => {
    if (typeof service.enrollmentCount === "string") {
      return parseInt(service.enrollmentCount, 10) || 0
    }
    return service.enrollmentCount ?? 0
  }

  const handleScroll = React.useCallback(() => {
    if (!scrollRef.current) return
    const scrollLeft = scrollRef.current.scrollLeft
    const cardWidth = 304 // 280 + 24 gap
    const index = Math.round(scrollLeft / cardWidth)
    setActiveIndex(Math.max(0, Math.min(index, services.length - 1)))
  }, [services.length])

  React.useEffect(() => {
    const ref = scrollRef.current
    if (ref) {
      ref.addEventListener('scroll', handleScroll)
      return () => ref.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  // LOADING STATE — Full Header + Responsive Skeletons
  if (loading) {
    return (
      <section className="py-8 sm:py-12 bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Skeleton */}
          <div className="text-center mb-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full mb-4 shadow-md border border-green-200">
              <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
            </div>
            {/* Title */}
            <div className="h-8 sm:h-10 w-64 sm:w-80 bg-gray-200 rounded mx-auto mb-3 animate-pulse" />
            {/* Description */}
            <div className="h-4 w-72 max-w-full bg-gray-200 rounded mx-auto animate-pulse" />
          </div>

          {/* Mobile: 1 centered card */}
          <div className="block md:hidden">
            <div className="flex justify-center px-4">
              <div className="w-72">
                <SkeletonServicesCard size="sm" variant="trending" />
              </div>
            </div>
          </div>

          {/* Desktop: 4 cards */}
          <div className="hidden md:flex justify-center gap-6 px-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-72 flex-shrink-0">
                <SkeletonServicesCard size="sm" variant="trending" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error || !services || services.length === 0) return null

  const trendingServices = [...services]
    .map(s => ({ ...s, _enrollmentNum: getEnrollmentCount(s) }))
    .filter(s => s._enrollmentNum > 0)
    .sort((a, b) => b._enrollmentNum - a._enrollmentNum)
    .slice(0, 10)

  if (trendingServices.length === 0) return null

  const isSingleCard = trendingServices.length === 1

  return (
    <section className="py-8 sm:py-12 bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-lime-300 rounded-full opacity-20 blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-green-300 rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: "0.5s" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white shadow-md rounded-full mb-4 border border-green-200">
            <span className="text-sm font-bold text-green-700">
              Hot Right Now
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-lime-600 to-green-700 bg-clip-text text-transparent">
            Trending Services
          </h2>
          <p className="mt-2 text-slate-700">
            Most popular services based on current enrollments
          </p>
        </div>

        {/* Carousel with Perfect Centering for Single Card */}
        <div
          ref={scrollRef}
          className="overflow-x-auto scrollbar-hide scroll-smooth"
        >
          <div
            className="flex gap-6 px-4 py-4"
            style={{
              scrollSnapType: 'x mandatory',
              justifyContent: isSingleCard ? 'center' : 'flex-start',
              minWidth: isSingleCard ? 'fit-content' : 'max-content',
            }}
          >
            {trendingServices.map((service, index) => (
              <div
                key={service.id}
                className="w-72 flex-shrink-0 snap-start"
                style={{ width: "288px" }} // 280 + padding consistency
              >
                <ServiceCard
                  service={service}
                  variant="trending"
                  trendingIndex={index + 1}
                  size="sm"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        {trendingServices.length > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {trendingServices.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  scrollRef.current?.scrollTo({
                    left: 304 * index,
                    behavior: 'smooth'
                  })
                }}
                className={`transition-all duration-300 rounded-full ${
                  index === activeIndex
                    ? 'w-8 h-2 bg-green-600'
                    : 'w-2 h-2 bg-green-300 hover:bg-green-400'
                }`}
                aria-label={`Go to service ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}