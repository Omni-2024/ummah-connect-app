"use client"

import React from "react"
import { ArrowRightIcon } from "@radix-ui/react-icons"
import { useRouter } from "next/navigation"
import ServiceCard from "@/features/app/components/ServiceCard"
import { SkeletonServicesCard } from "@/features/explore/component/SkeletonCourseCard"
import { Service } from "@/types"

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
          <div className="flex justify-center gap-6 overflow-x-auto scrollbar-hide px-1">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-72">
                <SkeletonServicesCard size="sm" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-10 sm:py-16 text-center px-4">
        <p className="text-gray-500 text-sm sm:text-base">
          {error.message || "Failed to load recommended services."}
        </p>
      </section>
    )
  }

  if (!services || services.length === 0) return null

  const isSingleCard = services.length === 1

  return (
    <section className="py-8 sm:py-10 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 lg:mb-8">
          <span className="inline-flex items-center px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
            Personalized Learning Path
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 sm:mb-3 px-4">
            Recommended for You
          </h2>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto px-4">
            Services tailored to your interests and professional goals
          </p>
        </div>

        {/* Horizontal Scroll Carousel - Same as Trending Section */}
        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
          <div
            className={`
              flex gap-6 snap-x snap-mandatory
              ${isSingleCard ? "justify-center" : "justify-start"}
              ${isSingleCard ? "md:justify-start" : ""}
            `}
            style={
              isSingleCard
                ? { width: "fit-content", margin: "0 auto" }
                : undefined
            }
          >
            {services.map((service, index) => (
              <div
                key={service.id}
                className="snap-start flex-shrink-0"
                style={isSingleCard ? { width: "280px" } : undefined} 
              >
                <ServiceCard
                  service={service}
                  size="sm"
                  variant="default"
                  trendingIndex={index} 
                />
              </div>
            ))}
          </div>
        </div>

        {services.length > 1 && (
          <div className="flex justify-center items-center gap-2 mt-4 text-xs sm:text-sm text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            <span>Swipe to explore</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        )}
      </div>
    </section>
  )
}

export default RecommendedServicesSection