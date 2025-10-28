"use client"

import React from "react"
import { useRouter } from "next/navigation"
import useEmblaCarousel from "embla-carousel-react"
import { Service } from "@/types"
import { Card, CardDescription, CardTitle } from "@/components/base/Card"
import { cn } from "@/lib/className"
import { S3_BUCKET_URL } from "@/lib/constants"
import StudentCountLabel from "@/components/widgets/StudentCountLabel"
import { buildAvatarUrl } from "@/features/app/components/Navbar"
import { formatDurationFromSeconds } from "@/lib/helpers/formatUtils"
import { SkeletonServicesCard } from "@/features/explore/component/SkeletonCourseCard"
import { Clock, Star } from "lucide-react"
import Button from "@/components/base/Button"

// Placeholder data for UI purposes
const placeholderServices: Service[] = [
  {
    id: "placeholder-1",
    title: "Sample Service 1",
    tagline: "Explore this recently searched service",
    coverImageUrl: "/images/coverImage.png",
    providerId: "placeholder-provider",
    price: 50,
    totalReviewScore: "0",
    totalReviewCount: "0",
    averageReviewScore: "0.0",
    enrollmentCount: "10",
    specialtyId: "placeholder-specialty",
    professionId: "placeholder-profession",
    slug: "sample-service-1",
    createdAt: "2025-10-25T12:00:00.000Z",
    updatedAt: "2025-10-25T12:00:00.000Z",
    version: 1,
    isPublished: true,
    isArchived: false,
    learningPoints: [],
    whyMe: [],
    discount: 0,
    discountEnabled: false,
    duration: 0,
    deletedAt: null,
    description: "",
    cmePoints: 0,
    cmeId: "",
    typeId: ""
  },
  {
    id: "placeholder-2",
    title: "Sample Service 2",
    tagline: "Another recently searched service",
    coverImageUrl: "/images/coverImage.png",
    providerId: "placeholder-provider",
    price: 75,
    totalReviewScore: "0",
    totalReviewCount: "0",
    averageReviewScore: "0.0",
    enrollmentCount: "5",
    specialtyId: "placeholder-specialty",
    professionId: "placeholder-profession",
    slug: "sample-service-2",
    createdAt: "2025-10-25T12:00:00.000Z",
    updatedAt: "2025-10-25T12:00:00.000Z",
    version: 1,
    isPublished: true,
    isArchived: false,
    learningPoints: [],
    whyMe: [],
    discount: 0,
    discountEnabled: false,
    duration: 0,
    deletedAt: null,
    description: "",
    cmePoints: 0,
    cmeId: "",
    typeId: ""
  },
]

interface RecentlySearchedServicesSectionProps {
  router: ReturnType<typeof useRouter>
}

const ServiceCard = ({ service, idx }: { service: Service; idx: number }) => {
  const router = useRouter()

  const handleCardClick = () => {
    router.push(`/service/${service.slug}`)
  }

  return (
    <div className="relative">
      {/* Timeline connector */}
      {idx === 0 && (
        <div className="hidden md:block absolute top-1/2 left-full w-8 h-0.5 bg-green-300"></div>
      )}
      
      <div 
        onClick={handleCardClick}
        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-green-100 hover:border-green-300 cursor-pointer"
      >
        <div className="relative h-40 sm:h-48">
          <img 
            src={service.coverImageUrl ? buildAvatarUrl(service.coverImageUrl) || `${S3_BUCKET_URL}/images/coverImage.png` : "/images/coverImage.png"}
            alt={service.title} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white/90 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-semibold text-green-700">
            {idx === 0 ? '2 hours ago' : '1 day ago'}
          </div>
        </div>
        <div className="p-4 sm:p-5">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-3 flex-wrap">
            {/* <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" /> */}
            {/* <span className="text-xs sm:text-sm font-medium text-slate-600">
              {formatDurationFromSeconds(service.duration)}
            </span> */}
            {/* <span className="text-slate-300">•</span> */}
            <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium text-slate-700">
              {service.averageReviewScore || '0.0'}
            </span>
            <span className="text-xs text-slate-500">
              ({service.totalReviewCount || 0} reviews)
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 line-clamp-2">
            {service.title}
          </h3>
          <p className="text-slate-600 text-xs sm:text-sm line-clamp-2 mb-3 sm:mb-4">
            {service.tagline}
          </p>
          <Button variant="primary" className="w-full text-sm sm:text-base py-2">
            Continue Exploring
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function RecentlySearchedServicesSection({ router }: RecentlySearchedServicesSectionProps) {
  return (
    <section className="py-8 sm:py-10 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-green-200 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-emerald-200 rounded-full opacity-20 blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header with timeline aesthetic */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white shadow-md rounded-full mb-3 sm:mb-4 border border-green-200">
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
            <span className="text-xs sm:text-sm font-semibold text-green-700">Your Recent Searches</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-2 sm:mb-3 px-4">
            Recently Searched Services
          </h2>
        </div>

        {/* Timeline-style cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {placeholderServices.map((service, idx) => (
            <ServiceCard key={service.id} service={service} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  )
}