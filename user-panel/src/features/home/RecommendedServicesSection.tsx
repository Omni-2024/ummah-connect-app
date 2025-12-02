"use client"

import React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import ServiceCard from "@/features/app/components/ServiceCard"
import { SkeletonServicesCard } from "@/features/explore/component/SkeletonCourseCard"
import { Service } from "@/types"
import { cn } from "@/lib/className"

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
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = React.useState(false)
  const [canScrollRight, setCanScrollRight] = React.useState(false)

  const updateArrows = () => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setCanScrollLeft(scrollLeft > 10)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }

  React.useEffect(() => {
    updateArrows()
    const ref = scrollRef.current
    if (ref) {
      ref.addEventListener("scroll", updateArrows)
      window.addEventListener("resize", updateArrows)
      return () => {
        ref.removeEventListener("scroll", updateArrows)
        window.removeEventListener("resize", updateArrows)
      }
    }
  }, [services, loading])

  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" })
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" })

  const isSingleCard = services.length === 1

  // FULL LOADING STATE — With Header Skeleton + Single Card Centered
  if (loading) {
    return (
      <section className="py-8 sm:py-10 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Skeleton */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-emerald-50 rounded-full mb-4">
              <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="h-8 sm:h-10 w-64 sm:w-80 bg-gray-200 rounded mx-auto mb-3 animate-pulse" />
            <div className="h-5 w-72 sm:w-96 max-w-full bg-gray-200 rounded mx-auto animate-pulse" />
          </div>

          {/* Mobile & Desktop: 1 centered skeleton when loading */}
          <div className="flex justify-center px-4">
            <div className="w-72">
              <SkeletonServicesCard size="sm" />
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error || !services || services.length === 0) return null

  return (
    <section className="py-8 sm:py-10 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <span className="inline-flex items-center px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium mb-4">
            Personalized Learning Path
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3">
            Recommended for You
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Services tailored to your interests and professional goals
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className={cn(
              "absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2.5 shadow-lg transition-all duration-300",
              canScrollLeft
                ? "opacity-100 hover:shadow-xl hover:bg-emerald-50"
                : "opacity-0 pointer-events-none"
            )}
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6 text-slate-700" />
          </button>

          {/* Scrollable Area */}
          <div
            ref={scrollRef}
            className="overflow-x-auto scrollbar-hide scroll-smooth px-4"
            onScroll={updateArrows}
          >
            <div
              className={cn(
                "flex gap-6 py-4",
                isSingleCard && "justify-center"
              )}
              style={{
                // This ensures perfect centering when only one card exists
                minWidth: isSingleCard ? "fit-content" : "max-content",
              }}
            >
              {services.map((service, index) => (
                <div
                  key={service.id}
                  className="w-72 flex-shrink-0 snap-start"
                  // Force fixed width so centering works perfectly
                  style={{ width: "288px" }}
                >
                  <ServiceCard
                    service={service}
                    size="sm"
                    variant="default"
                    trendingIndex={index + 1}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Arrow */}
          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className={cn(
              "absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2.5 shadow-lg transition-all duration-300",
              canScrollRight
                ? "opacity-100 hover:shadow-xl hover:bg-emerald-50"
                : "opacity-0 pointer-events-none"
            )}
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6 text-slate-700" />
          </button>
        </div>
      </div>
    </section>
  )
}

export default RecommendedServicesSection