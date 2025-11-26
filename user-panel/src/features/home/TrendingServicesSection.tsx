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
  const getEnrollmentCount = (service: Service): number => {
    if (typeof service.enrollmentCount === "string") {
      return parseInt(service.enrollmentCount, 10) || 0
    }
    return service.enrollmentCount ?? 0
  }

  if (loading) {
    return (
      <section className="py-8 sm:py-12 bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8">
            <div className="h-6 w-48 bg-gray-200 rounded mx-auto mb-3 animate-pulse" />
            <div className="h-4 w-64 bg-gray-200 rounded mx-auto animate-pulse" />
          </div>
          <div className="flex justify-center gap-4">
            {[...Array(4)].map((_, i) => (
              <SkeletonServicesCard key={i} size="sm" variant="trending" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-12 text-center">
        <p className="text-red-600">Failed to load trending services</p>
      </section>
    )
  }

  if (!services || services.length === 0) return null

  const trendingServices = [...services]
    .map(s => ({
      ...s,
      _enrollmentNum: getEnrollmentCount(s)
    }))
    .filter(s => s._enrollmentNum > 0)
    .sort((a, b) => b._enrollmentNum - a._enrollmentNum)
    .slice(0, 10)

  if (trendingServices.length === 0) return null

  const isSingleCard = trendingServices.length === 1

  return (
    <section className="py-8 sm:py-12 bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 relative overflow-hidden">

      <div className="absolute top-1/4 left-1/4 w-28 h-28 sm:w-40 sm:h-40 bg-lime-300 rounded-full opacity-20 blur-lg animate-pulse" />
      <div
        className="absolute bottom-1/4 right-1/4 w-28 h-28 sm:w-40 sm:h-40 bg-green-300 rounded-full opacity-20 blur-lg animate-pulse"
        style={{ animationDelay: "0.5s" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white shadow-md rounded-full mb-3 border border-green-200">
            <span className="text-xs sm:text-sm font-bold text-green-700">
             🔥 Hot Right Now
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-lime-600 to-green-700 bg-clip-text text-transparent">
            Trending Services
          </h2>

          <p className="mt-2 text-sm sm:text-base text-slate-700">
            Most popular services based on current enrollments
          </p>
        </div>

        {/* Horizontal scroll carousel – centers single card on mobile */}
        <div className="overflow-x-auto scrollbar-hide">
          <div
            className={`
              flex gap-6 snap-x snap-mandatory px-1
              ${isSingleCard ? "justify-center" : "justify-start"}
              ${isSingleCard ? "md:justify-start" : ""}   {/* revert to normal layout on larger screens */}
            `}
            // When there is only one card we force the flex container width so the outer overflow container centers it perfectly
            style={
              isSingleCard
                ? { width: "fit-content", margin: "0 auto" }
                : undefined
            }
          >
            {trendingServices.map((service, index) => (
              <div
                key={service.id}
                className="snap-start flex-shrink-0"
                // optional: give a fixed width on mobile so centering works reliably
                style={isSingleCard ? { width: "280px" } : undefined}  
              >
                <ServiceCard
                  service={service}
                  variant="trending"
                  trendingIndex={index}
                  size="sm"
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}