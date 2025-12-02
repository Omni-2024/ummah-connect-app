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
  const iconClass = "w-6 h-6 transition-transform duration-300 group-hover:scale-110"
  const name = categoryName.toLowerCase()

  if (name.includes("spiritual") || name.includes("religious")) return <ReaderIcon className={iconClass} />
  if (name.includes("community") || name.includes("lifestyle")) return <GlobeIcon className={iconClass} />
  if (name.includes("education") || name.includes("skill") || name.includes("learn")) return <LightningBoltIcon className={iconClass} />
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
    <section className="py-8 sm:py-12 bg-gradient-to-b from-slate-50/50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {categoriesLoading ? (
          <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
            <div className="flex gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex-shrink-0 w-36 animate-pulse rounded-2xl ">
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 aspect-square flex flex-col items-center justify-center">
                    <Skeleton className="w-14 h-14 rounded-full mb-3" />
                    <Skeleton className="h-3 w-20 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : categoriesError ? (
          <div className="text-center py-12 text-red-600 text-sm">Error loading categories</div>
        ) : (
          <>
            {/* Horizontal Scrollable Carousel – Always Left-Aligned */}
            <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
              <div className="flex gap-4 snap-x snap-mandatory">
                {exploreCategories
                  .sort((a, b) => a.order - b.order)
                  .map((category) => (
                    <div
                      key={category.id}
                      className="snap-start flex-shrink-0 w-36" // Fixed width → clean & predictable
                    >
                      <button
                        onClick={() => handleRedirect(category)}
                        className="group relative w-full bg-white hover:bg-emerald-50/80 rounded-2xl p-5 border border-slate-200 hover:border-emerald-400 hover:shadow-xl transition-all duration-300 active:scale-95 flex flex-col items-center justify-center text-center aspect-square"
                        aria-label={`Explore ${category.name}`}
                      >
                        {/* Subtle hover glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-teal-400/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Icon*/}
                        <div className="relative z-10 mb-3 flex items-center justify-center w-14 h-14 bg-gradient-to-br from-emerald-100 to-teal-100 group-hover:from-emerald-200 group-hover:to-teal-200 rounded-full transition-all duration-300 shadow-md">
                          <div className="text-emerald-600 group-hover:text-emerald-700">
                            {getCategoryIcon(category.name)}
                          </div>
                        </div>

                        {/* Name*/}
                        <div className="relative z-10 mt-2 h-8 flex items-center justify-center px-2">
                          <p className="text-xs font-bold text-slate-700 group-hover:text-emerald-700 transition-colors duration-300 leading-tight line-clamp-2 text-center w-full">
                            {category.name}
                          </p>
                        </div>
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default PopularServicesSection