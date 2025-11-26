"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { useExploreState } from "@/features/explore/context/useExploreState"
import type { CategoryData } from "@/types"
import { ReaderIcon, GlobeIcon, LightningBoltIcon, StarIcon } from "@radix-ui/react-icons"
import { Skeleton } from "@/components/base/skeleton"

type PopularServicesSectionProps = {
  exploreCategories: CategoryData[]
  categoriesLoading: boolean
  categoriesError: any
}

const getCategoryIcon = (categoryName: string) => {
  const iconClass = "w-5 h-5 transition-transform duration-300 group-hover:scale-110"
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
    <section className="py-8 sm:py-12" aria-labelledby="popular-services-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {categoriesLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gradient-to-br from-slate-100 to-slate-50 rounded-2xl p-4 sm:p-5 aspect-square flex flex-col items-center justify-center">
                  <Skeleton className="w-12 h-12 sm:w-14 sm:h-14 rounded-full mb-2.5 sm:mb-3" />
                  <Skeleton className="h-3 w-20 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : categoriesError ? (
          <div className="text-center py-8 sm:py-14 text-red-600 text-sm sm:text-base">
            Error loading categories
          </div>
        ) : (
          <>
            {/* Responsive Grid - 2 cols mobile, 3 cols tablet, 6 cols desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {exploreCategories
                .sort((a, b) => a.order - b.order)
                .map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleRedirect(category)}
                    className="group relative overflow-hidden bg-gradient-to-br from-white to-slate-50/50 hover:from-emerald-50 hover:to-teal-50 rounded-2xl p-4 sm:p-5 border border-slate-400 hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-100/50 transition-all duration-300 aspect-square flex flex-col items-center justify-center text-center active:scale-95"
                    aria-label={`Explore ${category.name}`}
                  >
                    {/* Subtle background gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/0 to-teal-400/0 group-hover:from-emerald-400/5 group-hover:to-teal-400/5 transition-all duration-300"></div>
                    
                    {/* Icon container */}
                    <div className="relative z-10 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 mb-2.5 sm:mb-3 bg-gradient-to-br from-emerald-100 to-teal-100 group-hover:from-emerald-200 group-hover:to-teal-200 rounded-full transition-all duration-300 group-hover:rotate-6">
                      <div className="text-emerald-600 group-hover:text-emerald-700">
                        {getCategoryIcon(category.name)}
                      </div>
                    </div>
                    
                    {/* Text */}
                    <p className="relative z-10 text-xs sm:text-sm font-semibold text-slate-700 group-hover:text-emerald-700 transition-colors duration-300 leading-snug px-1 line-clamp-2">
                      {category.name}
                    </p>

                    {/* Decorative corner accent */}
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-emerald-400/0 to-teal-400/0 group-hover:from-emerald-400/10 group-hover:to-teal-400/10 rounded-bl-full transition-all duration-300"></div>
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