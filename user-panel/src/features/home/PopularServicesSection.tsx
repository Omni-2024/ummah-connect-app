"use client"

import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useExploreState } from "@/features/explore/context/useExploreState"
import type { CategoryData } from "@/types"
import { ReaderIcon, GlobeIcon, LightningBoltIcon, StarIcon } from "@radix-ui/react-icons"
import { Skeleton } from "@/components/base/skeleton"
import { cn } from "@/lib/className"

type PopularServicesSectionProps = {
  exploreCategories: CategoryData[]
  categoriesLoading: boolean
  categoriesError: any
}

// Helper function to get appropriate icon for each category
const getCategoryIcon = (categoryName: string) => {
  const iconClass = "w-5 h-5 sm:w-7 sm:h-7 text-emerald-600"
  const name = categoryName.toLowerCase()

  if (name.includes("spiritual") || name.includes("religious")) {
    return <ReaderIcon className={iconClass} />
  }

  if (name.includes("community") || name.includes("lifestyle")) {
    return <GlobeIcon className={iconClass} />
  }

  if (name.includes("education") || name.includes("skill") || name.includes("learn")) {
    return <LightningBoltIcon className={iconClass} />
  }

  // Default star icon
  return <StarIcon className={iconClass} />
}

const PopularServicesSection: React.FC<PopularServicesSectionProps> = ({
  exploreCategories,
  categoriesLoading,
  categoriesError,
}) => {
  const router = useRouter()
  const { setProfession, setProfessionName, setSpecialties } = useExploreState()

  const handleRedirect = (category: CategoryData) => {
    setProfession(category.id)
    setProfessionName(category.name)
    setSpecialties([])
    router.push(`/explore?profession=${encodeURIComponent(category.id)}`)
  }

  return (
    <section className="py-6 sm:py-10" aria-labelledby="popular-services-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {categoriesLoading ? (
          <>
            {/* Desktop Loading State with Skeletons */}
            <div className="hidden sm:flex justify-center items-center flex-wrap gap-6">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center justify-center w-52 h-52 bg-white rounded-xl border border-slate-200"
                >
                  <Skeleton className="w-14 h-14 mb-3 rounded-full" />
                  <Skeleton className="h-4 w-32 rounded" />
                </div>
              ))}
            </div>
            
            {/* Mobile Loading State - Grid with Skeletons */}
            <div className="sm:hidden grid grid-cols-3 gap-3">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center justify-center h-24 bg-white rounded-lg border border-slate-200 max-w-full sm:max-w-none"
                >
                  <Skeleton className="w-10 h-10 mb-2 rounded-full" />
                  <Skeleton className="h-3 w-16 rounded" />
                </div>
              ))}
            </div>

          </>
        ) : categoriesError ? (
          <div className="text-center py-8 sm:py-14 text-red-600 text-sm sm:text-base">Error loading categories</div>
        ) : (
          <>
            {/* Desktop View */}
            <div className="hidden sm:flex justify-center items-center flex-wrap gap-6">
              {exploreCategories
                .sort((a, b) => a.order - b.order)
                .map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleRedirect(category)}
                    className="group flex flex-col items-center justify-center w-52 h-52 bg-white rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-100 transition-all duration-300 text-center hover:-translate-y-1"
                    aria-label={`Explore ${category.name}`}
                  >
                    <div className="flex items-center justify-center w-14 h-14 mb-3 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-full group-hover:from-emerald-100 group-hover:to-teal-100 transition-colors duration-300">
                      {getCategoryIcon(category.name)}
                    </div>
                    <p className="text-sm font-semibold text-slate-700 group-hover:text-emerald-600 transition-colors duration-300 leading-tight px-2">
                      {category.name}
                    </p>
                  </button>
                ))}
            </div>

            {/* Mobile View - Compact Grid Layout */}
            <div className="sm:hidden grid grid-cols-3 gap-3">
              {exploreCategories
                .sort((a, b) => a.order - b.order)
                .map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleRedirect(category)}
                    className="group flex flex-col items-center justify-center h-24 bg-white rounded-lg border border-slate-200 hover:border-emerald-500 hover:shadow-md hover:shadow-emerald-100 transition-all duration-300 text-center active:scale-95"
                    aria-label={`Explore ${category.name}`}
                  >
                    <div className="flex items-center justify-center w-10 h-10 mb-1.5 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-full group-hover:from-emerald-100 group-hover:to-teal-100 transition-colors duration-300">
                      {getCategoryIcon(category.name)}
                    </div>
                    <p className="text-[11px] font-semibold text-slate-700 group-hover:text-emerald-600 transition-colors duration-300 leading-tight px-2 line-clamp-2">
                      {category.name}
                    </p>
                  </button>
                ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default PopularServicesSection