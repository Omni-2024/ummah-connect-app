"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Service } from "@/types"
import { cn } from "@/lib/className"
import { S3_BUCKET_URL } from "@/lib/constants"
import { buildAvatarUrl } from "@/features/app/components/Navbar"
import { formatDurationFromSeconds } from "@/lib/helpers/formatUtils"
import { SkeletonServicesCard } from "@/features/explore/component/SkeletonCourseCard"
import { Star } from "lucide-react"

interface NewlyAddedServicesSectionProps {
  services: Service[]
  loading: boolean
  error: Error | null
  router: ReturnType<typeof useRouter>
}

const ServiceCard = ({ service, router }: { service: Service; router: ReturnType<typeof useRouter> }) => {
  const handleCardClick = () => {
    router.push(`/service/${service.slug}`)
  }

  const daysAgo = React.useMemo(() => {
    const now = new Date()
    const created = new Date(service.createdAt)
    const diff = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24))
    return diff
  }, [service.createdAt])

  return (
    <div 
      onClick={handleCardClick}
      className="relative bg-white rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer active:scale-95 sm:active:scale-100"
    >
      {/* New badge ribbon */}
      {daysAgo <= 30 && (
        <div className="absolute top-3 sm:top-4 -right-10 sm:-right-12 rotate-45 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-[10px] sm:text-xs font-bold py-0.5 sm:py-1 px-10 sm:px-12 shadow-lg z-10">
          NEW
        </div>
      )}
      
      <div className="relative h-40 sm:h-48 md:h-56 overflow-hidden">
        <img 
          src={service.coverImageUrl ? buildAvatarUrl(service.coverImageUrl) || `${S3_BUCKET_URL}/images/coverImage.png` : "/images/coverImage.png"}
          alt={service.title} 
          className="w-full h-full object-cover" 
        />
      </div>
      
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <span className="text-[10px] sm:text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 sm:px-3 py-1 rounded-full">
            Added {daysAgo === 0 ? 'today' : `${daysAgo} day${daysAgo !== 1 ? 's' : ''} ago`}
          </span>
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-xs sm:text-sm font-semibold text-slate-700">
              {service.averageReviewScore || '0.0'}
            </span>
          </div>
        </div>
        
        <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5 sm:mb-2 line-clamp-2">
          {service.title}
        </h3>
        <p className="text-slate-600 text-xs sm:text-sm mb-3 line-clamp-2">{service.tagline}</p>
      </div>
    </div>
  )
}

export default function NewlyAddedServicesSection({ services, loading, error, router }: NewlyAddedServicesSectionProps) {
  if (loading) {
    return (
      <section className="py-8 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <div className="h-4 sm:h-5 w-32 bg-gray-200 rounded animate-pulse mx-auto mb-3" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            <SkeletonServicesCard />
            <SkeletonServicesCard />
            <SkeletonServicesCard />
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-8 sm:py-16 text-center px-4">
        <p className="text-gray-500 text-sm sm:text-base">{error.message || "Failed to load newly added services."}</p>
      </section>
    )
  }

  if (!services || services.length === 0) {
    return null
  }

  // Filter services to only include those added within the last 30 days
  const recentServices = services.filter((service) => {
    const now = new Date()
    const created = new Date(service.createdAt)
    const diff = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24))
    return diff <= 30
  })

  if (recentServices.length === 0) {
    return null
  }

  return (
    <section className="py-6 sm:py-8 mb-6 sm:mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-2 sm:mb-3 px-4">
            Newly Added Services
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 px-4">Discover the latest services added to our platform</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {recentServices.map((service) => (
            <ServiceCard key={service.id} service={service} router={router} />
          ))}
        </div>
      </div>
    </section>
  )
}