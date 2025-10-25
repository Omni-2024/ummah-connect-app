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
      className="relative bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer"
    >
      {/* New badge ribbon */}
      {daysAgo <= 30 && (
        <div className="absolute top-4 -right-12 rotate-45 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs font-bold py-1 px-12 shadow-lg z-10">
          NEW
        </div>
      )}
      
      <div className="relative h-56 overflow-hidden">
        <img 
          src={service.coverImageUrl ? buildAvatarUrl(service.coverImageUrl) || `${S3_BUCKET_URL}/images/coverImage.png` : "/images/coverImage.png"}
          alt={service.title} 
          className="w-full h-full object-cover" 
        />
      </div>
      
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            Added {daysAgo === 0 ? 'today' : `${daysAgo} day${daysAgo !== 1 ? 's' : ''} ago`}
          </span>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold text-slate-700">
              {service.averageReviewScore || '0.0'}
            </span>
          </div>
        </div>
        
        <h3 className="text-lg font-bold text-slate-900 mb-2">
          {service.title}
        </h3>
        <p className="text-slate-600 text-sm mb-3">{service.tagline}</p>
        
        {/* <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <span className="text-xs text-slate-500">
            {formatDurationFromSeconds(service.duration)}
          </span>
          <span className="text-xs font-semibold text-slate-700">
            {Number(service.enrollmentCount).toLocaleString()} learners
          </span>
        </div> */}
      </div>
    </div>
  )
}

export default function NewlyAddedServicesSection({ services, loading, error, router }: NewlyAddedServicesSectionProps) {
  if (loading) {
    return (
      <section className="py-16 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mx-auto mb-3" />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
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
      <section className="py-16 text-center">
        <p className="text-gray-500">{error.message || "Failed to load newly added services."}</p>
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
    <section className="py-8  mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-3">
            Newly Added Services
          </h2>
          <p className="text-lg text-slate-600">Discover the latest services added to our platform</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentServices.map((service) => (
            <ServiceCard key={service.id} service={service} router={router} />
          ))}
        </div>
      </div>
    </section>
  )
}