"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Service } from "@/types"
import { cn } from "@/lib/className"
import { S3_BUCKET_URL } from "@/lib/constants"
import { buildAvatarUrl } from "@/features/app/components/Navbar"
import { formatDurationFromSeconds } from "@/lib/helpers/formatUtils"
import { Clock, Star, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
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
    averageReviewScore: "4.5",
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
    duration: 3600,
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
    averageReviewScore: "4.8",
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
    duration: 5400,
    deletedAt: null,
    description: "",
    cmePoints: 0,
    cmeId: "",
    typeId: ""
  },
  {
    id: "placeholder-3",
    title: "Sample Service 3",
    tagline: "Yet another recently searched service",
    coverImageUrl: "/images/coverImage.png",
    providerId: "placeholder-provider",
    price: 60,
    totalReviewScore: "0",
    totalReviewCount: "0",
    averageReviewScore: "4.2",
    enrollmentCount: "15",
    specialtyId: "placeholder-specialty",
    professionId: "placeholder-profession",
    slug: "sample-service-3",
    createdAt: "2025-10-25T12:00:00.000Z",
    updatedAt: "2025-10-25T12:00:00.000Z",
    version: 1,
    isPublished: true,
    isArchived: false,
    learningPoints: [],
    whyMe: [],
    discount: 0,
    discountEnabled: false,
    duration: 4200,
    deletedAt: null,
    description: "",
    cmePoints: 0,
    cmeId: "",
    typeId: ""
  },
  {
    id: "placeholder-4",
    title: "Sample Service 4",
    tagline: "More recently searched service",
    coverImageUrl: "/images/coverImage.png",
    providerId: "placeholder-provider",
    price: 85,
    totalReviewScore: "0",
    totalReviewCount: "0",
    averageReviewScore: "4.7",
    enrollmentCount: "20",
    specialtyId: "placeholder-specialty",
    professionId: "placeholder-profession",
    slug: "sample-service-4",
    createdAt: "2025-10-25T12:00:00.000Z",
    updatedAt: "2025-10-25T12:00:00.000Z",
    version: 1,
    isPublished: true,
    isArchived: false,
    learningPoints: [],
    whyMe: [],
    discount: 0,
    discountEnabled: false,
    duration: 7200,
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

  const timeLabels = ['2 hours ago', '1 day ago', '2 days ago', '3 days ago']

  return (
    <div 
      onClick={handleCardClick}
      className="group relative bg-gradient-to-br from-white to-slate-50 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] border border-slate-200"
    >
      {/* Compact Image Section */}
      <div className="relative h-32 overflow-hidden">
        <img 
          src={service.coverImageUrl ? buildAvatarUrl(service.coverImageUrl) || `${S3_BUCKET_URL}/images/coverImage.png` : "/images/coverImage.png"}
          alt={service.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Time Badge */}
        <div className="absolute top-2 right-2 bg-green-500 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-lg">
          {timeLabels[idx] || '1 week ago'}
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-4">
        <h3 className="text-base font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-green-600 transition-colors">
          {service.title}
        </h3>
        
        <p className="text-slate-600 text-xs line-clamp-2 mb-3 leading-relaxed">
          {service.tagline}
        </p>
        
        {/* Stats Row */}
        <div className="flex items-center justify-end text-medium mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="font-semibold text-slate-700">{service.averageReviewScore}</span>
          </div>
        </div>
        
        {/* CTA Button */}
        <Button variant="primary" className="mt-2 w-full text-sm lg:text-base py-2">
          Continue Exploring
          <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
        </Button>
      </div>
    </div>
  )
}

export default function RecentlySearchedServicesSection({ router }: RecentlySearchedServicesSectionProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)

  const showCarousel = placeholderServices.length > 4

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleNext = () => {
    if (currentIndex < placeholderServices.length - 4) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  return (
    <section className="py-8 sm:py-10 relative overflow-hidden bg-gradient-to-b from-green-50/30 to-transparent">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-green-200 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-emerald-200 rounded-full opacity-20 blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white shadow-md rounded-full mb-4 border border-green-200">
            <Clock className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold text-green-700">Your Recent Searches</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-2 px-4">
            Recently Searched Services
          </h2>
          <p className="text-sm sm:text-base text-slate-600">Continue exploring services you recently viewed</p>
        </div>

        {/* Carousel or Grid */}
        {showCarousel ? (
          <div className="relative">
            {/* Previous Button */}
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className={cn(
                "absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2.5 shadow-xl transition-all duration-300",
                currentIndex === 0 
                  ? "opacity-0 cursor-not-allowed" 
                  : "hover:bg-green-50 hover:shadow-2xl opacity-100"
              )}
              aria-label="Previous services"
            >
              <ChevronLeft className="w-5 h-5 text-slate-700" />
            </button>

            {/* Carousel Container */}
            <div 
              ref={scrollContainerRef}
              className="overflow-hidden px-2"
            >
              <div 
                className="flex gap-4 transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 25}%)` }}
              >
                {placeholderServices.map((service, idx) => (
                  <div key={service.id} className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
                    <ServiceCard service={service} idx={idx} />
                  </div>
                ))}
              </div>
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              disabled={currentIndex >= placeholderServices.length - 4}
              className={cn(
                "absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2.5 shadow-xl transition-all duration-300",
                currentIndex >= placeholderServices.length - 4
                  ? "opacity-0 cursor-not-allowed"
                  : "hover:bg-green-50 hover:shadow-2xl opacity-100"
              )}
              aria-label="Next services"
            >
              <ChevronRight className="w-5 h-5 text-slate-700" />
            </button>

            {/* Indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: Math.max(1, placeholderServices.length - 3) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    index === currentIndex
                      ? "bg-green-500 w-8"
                      : "bg-slate-300 w-1.5 hover:bg-slate-400"
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {placeholderServices.map((service, idx) => (
              <ServiceCard key={service.id} service={service} idx={idx} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
