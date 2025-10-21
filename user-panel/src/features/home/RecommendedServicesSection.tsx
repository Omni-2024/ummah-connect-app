"use client"

import React from "react"
import { ArrowRightIcon, StarIcon } from "@radix-ui/react-icons"
import { useRouter } from "next/navigation"
import { S3_BUCKET_URL } from "@/lib/constants"
import { buildAvatarUrl } from "@/features/app/components/Navbar"
import { Service } from "@/types"

interface RecommendedServicesSectionProps {
  services: Service[]
  loading: boolean
  error: Error | null
  router: ReturnType<typeof useRouter>
}

function RecommendedServicesSection({
  services,
  loading,
  error,
  router,
}: RecommendedServicesSectionProps) {
  const calculateDiscountedPrice = (price: number, discount = 0, discountEnabled = false) => {
    return discountEnabled ? price - (price * discount) / 100 : price
  }

  const getCoverImageUrl = (coverImageUrl: string) => {
    if (!coverImageUrl) return `${S3_BUCKET_URL}/images/coverImage.png`
    
    // If it's already a full URL, return as is
    if (coverImageUrl.startsWith('http://') || coverImageUrl.startsWith('https://')) {
      return coverImageUrl
    }
    
    // Otherwise, use buildAvatarUrl
    return buildAvatarUrl(coverImageUrl) || `${S3_BUCKET_URL}/images/coverImage.png`
  }

  if (loading) {
    return (
      <section className="py-16 text-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-emerald-600" />
          <p className="text-gray-500 mt-4 text-sm">Loading recommended services...</p>
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
    return null // Don't show section if no services
  }

  return (
    <section className="py-8 sm:py-10 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <span className="inline-flex items-center px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium mb-4">
            Recommended for You
          </span>
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Personalized Learning Path</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Services tailored to your interests and professional goals
          </p>
        </div>

        {/* Recommended Services */}
        <div className="space-y-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:border-emerald-200 cursor-pointer"
              onClick={() => router.push(`/service/${service.slug}`)}
            >
              <div className="grid sm:grid-cols-4 gap-6 items-center">
                <img
                  src={getCoverImageUrl(service.coverImageUrl)}
                  alt={service.title}
                  className="sm:col-span-1 w-full h-32 object-cover rounded-xl"
                />
                <div className="sm:col-span-2">
                  <h3 className="text-xl font-bold text-slate-900 mb-1 hover:text-emerald-600 transition">
                    {service.title}
                  </h3>
                  <p className="text-emerald-600 text-sm font-medium mb-2">{service.tagline}</p>
                  <p className="text-slate-600 text-sm mb-3 line-clamp-2">{service.description}</p>
                  
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <StarIcon className="w-3 h-3 text-yellow-500" />
                      <span>{service.averageReviewScore || "0"}</span>
                      <span>({service.totalReviewCount || "0"})</span>
                    </div>
                    <span>·</span>
                    <span>{service.enrollmentCount || "0"} enrolled</span>
                    {service.duration && (
                      <>
                        <span>·</span>
                        <span>{service.duration} hours</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="sm:col-span-1 flex flex-col items-end justify-center">
                  <div className="text-right mb-4">
                    <span className="text-2xl font-bold text-slate-900">
                      ${calculateDiscountedPrice(service.price, service.discount, service.discountEnabled).toFixed(2)}
                    </span>
                    {service.discountEnabled && service.discount > 0 && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-slate-400 line-through">${service.price.toFixed(2)}</span>
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                          {service.discount}% OFF
                        </span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/service/${service.slug}`)
                    }}
                    className="bg-emerald-500 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-emerald-600 transition w-full sm:w-auto"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-12">
          <button
            onClick={() => router.push("/explore")}
            className="bg-slate-900 text-white px-8 py-4 rounded-2xl hover:bg-slate-800 transition font-semibold inline-flex items-center gap-2"
          >
            View All Services
            <ArrowRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  )
}

export default RecommendedServicesSection