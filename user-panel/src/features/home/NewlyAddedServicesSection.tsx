"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Service } from "@/types"
import { cn } from "@/lib/className"
import { S3_BUCKET_URL } from "@/lib/constants"
import { buildAvatarUrl } from "@/features/app/components/Navbar"
import { formatDurationFromSeconds } from "@/lib/helpers/formatUtils"
import { SkeletonServicesCard } from "@/features/explore/component/SkeletonCourseCard"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"

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
      className="group relative bg-white rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border border-slate-200 max-w-xs mx-auto"
    >
      {/* Image Container with Overlay */}
      <div className="relative h-40 sm:h-44 overflow-hidden">
        <img 
          src={service.coverImageUrl ? buildAvatarUrl(service.coverImageUrl) || `${S3_BUCKET_URL}/images/coverImage.png` : "/images/coverImage.png"}
          alt={service.title} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* New Badge */}
        {daysAgo <= 30 && (
          <div className="absolute top-3 left-3 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
            NEW
          </div>
        )}
        
        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm flex items-center gap-1 px-2.5 py-1.5 rounded-full shadow-lg">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-bold text-slate-800">
            {service.averageReviewScore || '0.0'}
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-xs font-medium text-slate-500">
            {daysAgo === 0 ? 'Added today' : `Added ${daysAgo} day${daysAgo !== 1 ? 's' : ''} ago`}
          </span>
        </div>
        
        <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
          {service.title}
        </h3>
        
        <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed">
          {service.tagline}
        </p>
      </div>
    </div>
  )
}

export default function NewlyAddedServicesSection({ services, loading, error, router }: NewlyAddedServicesSectionProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)

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

  const showCarousel = recentServices.length > 3

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      scrollToIndex(currentIndex - 1)
    }
  }

  const handleNext = () => {
    if (currentIndex < recentServices.length - 3) {
      setCurrentIndex(currentIndex + 1)
      scrollToIndex(currentIndex + 1)
    }
  }

  const scrollToIndex = (index: number) => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.scrollWidth / recentServices.length
      scrollContainerRef.current.scrollTo({
        left: cardWidth * index,
        behavior: 'smooth'
      })
    }
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

        {showCarousel ? (
          <div className="relative">
            {/* Previous Button */}
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className={cn(
                "absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg transition-all duration-300",
                currentIndex === 0 
                  ? "opacity-50 cursor-not-allowed" 
                  : "hover:bg-emerald-50 hover:shadow-xl"
              )}
              aria-label="Previous services"
            >
              <ChevronLeft className="w-6 h-6 text-slate-700" />
            </button>

            {/* Carousel Container */}
            <div 
              ref={scrollContainerRef}
              className="overflow-hidden px-12"
            >
              <div 
                className="flex gap-6 transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
              >
                {recentServices.map((service) => (
                  <div key={service.id} className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3">
                    <ServiceCard service={service} router={router} />
                  </div>
                ))}
              </div>
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              disabled={currentIndex >= recentServices.length - 3}
              className={cn(
                "absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg transition-all duration-300",
                currentIndex >= recentServices.length - 3
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-emerald-50 hover:shadow-xl"
              )}
              aria-label="Next services"
            >
              <ChevronRight className="w-6 h-6 text-slate-700" />
            </button>

            {/* Indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: recentServices.length - 2 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index)
                    scrollToIndex(index)
                  }}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    index === currentIndex
                      ? "bg-emerald-500 w-8"
                      : "bg-slate-300 hover:bg-slate-400"
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {recentServices.map((service) => (
              <ServiceCard key={service.id} service={service} router={router} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}