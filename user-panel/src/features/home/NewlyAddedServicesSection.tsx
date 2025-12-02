"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Service } from "@/types"
import { cn } from "@/lib/className"
import { S3_BUCKET_URL } from "@/lib/constants"
import { buildAvatarUrl } from "@/features/app/components/Navbar"
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
      className="group relative bg-white rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border border-slate-200 h-full flex flex-col"
    >
      {/* Image */}
      <div className="relative h-40 sm:h-44 overflow-hidden flex-shrink-0">
        <img
          src={service.coverImageUrl ? buildAvatarUrl(service.coverImageUrl) || `${S3_BUCKET_URL}/images/coverImage.png` : "/images/coverImage.png"}
          alt={service.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* NEW Badge */}
        {daysAgo <= 30 && (
          <div className="absolute top-3 left-3 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-10">
            NEW
          </div>
        )}

        {/* Rating */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm flex items-center gap-1 px-2.5 py-1.5 rounded-full shadow-lg z-10">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-bold text-slate-800">
          {service.averageReviewScore || '0.0'}

          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-xs font-medium text-slate-500">
            {daysAgo === 0 ? 'Added today' : `Added ${daysAgo} day${daysAgo !== 1 ? 's' : ''} ago`}
          </span>
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors min-h-[3.5rem]">
          {service.title}
        </h3>

        <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed flex-grow">
          {service.tagline || "Explore this new service"}
        </p>
      </div>
    </div>
  )
}

export default function NewlyAddedServicesSection({ services, loading, error, router }: NewlyAddedServicesSectionProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = React.useState(false)
  const [canScrollRight, setCanScrollRight] = React.useState(false)
  const [currentIndex, setCurrentIndex] = React.useState(0)

  const recentServices = React.useMemo(() => {
    return services
      .filter(s => {
        const daysAgo = Math.floor((Date.now() - new Date(s.createdAt).getTime()) / (1000 * 60 * 60 * 24))
        return daysAgo <= 30
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [services])

  // Update scroll buttons state
  const updateScrollButtons = () => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setCanScrollLeft(scrollLeft > 10)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }

  React.useEffect(() => {
    updateScrollButtons()
    const ref = scrollRef.current
    if (ref) {
      ref.addEventListener('scroll', updateScrollButtons)
      window.addEventListener('resize', updateScrollButtons)
      return () => {
        ref.removeEventListener('scroll', updateScrollButtons)
        window.removeEventListener('resize', updateScrollButtons)
      }
    }
  }, [recentServices])

  const scrollToCenter = (index: number) => {
    if (!scrollRef.current) return
    
    const cardWidth = 320 // w-80 (320px)
    const gap = 24 // gap-6
    const container = scrollRef.current
    const containerWidth = container.clientWidth
    
    // Calculate position to center the card
    const scrollPosition = (cardWidth + gap) * index - (containerWidth / 2) + (cardWidth / 2)
    
    container.scrollTo({ left: scrollPosition, behavior: 'smooth' })
    setCurrentIndex(index)
  }

  const scrollLeft = () => {
    const newIndex = Math.max(0, currentIndex - 1)
    scrollToCenter(newIndex)
  }

  const scrollRight = () => {
    const newIndex = Math.min(recentServices.length - 1, currentIndex + 1)
    scrollToCenter(newIndex)
  }

  if (loading) {
    return (
      <section className="py-8 sm:py-16 bg-gradient-to-b from-slate-50/50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-10 bg-slate-200 rounded-lg w-96 mx-auto mb-3 animate-pulse" />
            <div className="h-6 bg-slate-200 rounded-lg w-80 mx-auto animate-pulse" />
          </div>
          <div className="relative">
            <div className="overflow-x-auto scrollbar-hide px-4">
              <div className="flex gap-6 py-4 min-w-max">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-80 flex-shrink-0">
                    <SkeletonServicesCard />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error || recentServices.length === 0) return null

  return (
    <section className="py-8 sm:py-16 bg-gradient-to-b from-slate-50/50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
            Newly Added Services
          </h2>
          <p className="text-lg text-slate-600">Discover the latest services on Ummah Connect</p>
        </div>

        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className={cn(
              "absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-xl transition-all duration-300",
              canScrollLeft
                ? "opacity-100 hover:shadow-2xl hover:bg-emerald-50"
                : "opacity-0 pointer-events-none"
            )}
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6 text-slate-700" />
          </button>

          {/* Scrollable Carousel */}
          <div
            ref={scrollRef}
            className="overflow-x-auto scrollbar-hide scroll-smooth px-4"
            onScroll={updateScrollButtons}
          >
            <div className="flex gap-6 py-4 min-w-max">
              {recentServices.map((service, index) => (
                <div key={service.id} className="w-80 flex-shrink-0">
                  <ServiceCard service={service} router={router} />
                </div>
              ))}
            </div>
          </div>

          {/* Right Arrow */}
          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className={cn(
              "absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-xl transition-all duration-300",
              canScrollRight
                ? "opacity-100 hover:shadow-2xl hover:bg-emerald-50"
                : "opacity-0 pointer-events-none"
            )}
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6 text-slate-700" />
          </button>
        </div>
      </div>
    </section>
  )
}