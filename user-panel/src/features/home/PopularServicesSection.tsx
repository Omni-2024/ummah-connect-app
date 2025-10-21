"use client"

import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useExploreState } from "@/features/explore/context/useExploreState"
import type { CategoryData } from "@/types"

type PopularServicesSectionProps = {
  exploreCategories: CategoryData[]
  categoriesLoading: boolean
  categoriesError: any
}

// Helper function to get appropriate icon for each category
const getCategoryIcon = (categoryName: string) => {
  const iconClass = "w-7 h-7 text-emerald-600"
  const name = categoryName.toLowerCase()

  if (name.includes("spiritual") || name.includes("religious")) {
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )
  }

  if (name.includes("community") || name.includes("lifestyle")) {
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  }

  if (name.includes("education") || name.includes("skill") || name.includes("learn")) {
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )
  }

  // Default star icon
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  )
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
    <section className="py-16" aria-labelledby="popular-services-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 id="popular-services-heading" className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
            Popular Services
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            Explore our most sought-after categories and find the perfect service for your needs
          </p>
        </div>

        {categoriesLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-emerald-600 mb-4" />
            <span className="text-base text-slate-600 font-medium">Loading services...</span>
          </div>
        ) : categoriesError ? (
          <div className="text-center py-16 text-red-600">Error loading categories</div>
        ) : (
          <div className="flex justify-center items-center flex-wrap gap-6">
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
                  <p className="text-sm font-semibold text-slate-700 group-hover:text-emerald-600 transition-colors duration-300 leading-tight">
                    {category.name}
                  </p>
                </button>
              ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default PopularServicesSection
