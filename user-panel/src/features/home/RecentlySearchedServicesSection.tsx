"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Service } from "@/types"
import { Clock, Star, ArrowRight } from "lucide-react"
import { S3_BUCKET_URL } from "@/lib/constants"
import { buildAvatarUrl } from "@/features/app/components/Navbar"

const RECENTLY_VIEWED_KEY = 'recentlyViewedServices'
const MAX_RECENTLY_VIEWED = 5


export const saveRecentlyViewedService = (serviceId: string) => {
  if (typeof window === 'undefined') return
  try {
    const existing = localStorage.getItem(RECENTLY_VIEWED_KEY)
    let list: string[] = existing ? JSON.parse(existing) : []
    list = list.filter(id => id !== serviceId)
    list.unshift(serviceId)
    list = list.slice(0, MAX_RECENTLY_VIEWED)
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(list))
  } catch (e) { console.error(e) }
}

export const getRecentlyViewedServiceIds = (): string[] => {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem(RECENTLY_VIEWED_KEY)
    return data ? JSON.parse(data) : []
  } catch (e) {
    console.error(e)
    return []
  }
}

interface Props {
  allServices?: Service[]
}


const ServiceCard = ({ service, rank }: { service: Service; rank: number }) => {
  const router = useRouter()

  const handleClick = () => {
    saveRecentlyViewedService(service.id)
    router.push(`/service/${service.slug}`)
  }

  return (
    <div
      onClick={handleClick}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 border border-slate-100 h-full flex flex-col"
    >
      {/* Image */}
      <div className="relative h-36 overflow-hidden flex-shrink-0">
        <img
          src={
            service.coverImageUrl
              ? buildAvatarUrl(service.coverImageUrl) || `${S3_BUCKET_URL}/images/coverImage.png`
              : "/images/coverImage.png"
          }
          alt={service.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur px-2.5 py-1 rounded-full">
          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          <span className="text-white text-xs font-medium">{service.averageReviewScore || "New"}</span>
        </div>
      </div>

      {/*Content Area */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-slate-900 line-clamp-2 text-sm group-hover:text-emerald-600 transition-colors min-h-10">
          {service.title}
        </h3>
        <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed flex-grow">
          {service.tagline || "Continue exploring"}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-emerald-600 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            Recent
          </span>
          <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  )
}

export default function RecentlyViewedServicesSection({ allServices = [] }: Props) {
  const [services, setServices] = React.useState<Service[]>([])

  React.useEffect(() => {
    const ids = getRecentlyViewedServiceIds()
    const matched = ids
      .map(id => allServices.find(s => s.id === id))
      .filter((s): s is Service => !!s)
      .slice(0, MAX_RECENTLY_VIEWED)
    setServices(matched)
  }, [allServices])

  if (services.length === 0) return null

  return (
    <section className="py-8 sm:py-10 relative overflow-hidden bg-gradient-to-b from-green-50/30 to-transparent">
      <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-green-200 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-emerald-200 rounded-full opacity-20 blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white rounded-full shadow-md border border-emerald-200 mb-4">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-emerald-700 text-sm">Your Recent Searches</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">
            Recently Viewed Services
          </h2>
          <p className="text-sm sm:text-base text-slate-600">Continue exploring services you recently viewed</p>
        </div>

        {/* Mobile: */}
        <div className="block lg:hidden">
          <div 
            className="overflow-x-auto scrollbar-hide"
            style={{ scrollPaddingInline: '1rem' }}
          >
            <div 
              className="flex gap-4 px-4 py-2"
              style={{ scrollSnapType: 'x mandatory' }}
            >
              {services.map((service, i) => (
                <div
                  key={service.id}
                  className="snap-start flex-shrink-0 w-[280px]"
                >
                  <ServiceCard service={service} rank={i + 1} />
                </div>
              ))}
            </div>
          </div>

          {/*dots*/}
          {services.length > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {services.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === 0 ? 'w-8 bg-emerald-500' : 'w-2 bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Tablet */}
        <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 gap-6 lg:hidden">
          {services.map((service, i) => (
            <ServiceCard key={service.id} service={service} rank={i + 1} />
          ))}
        </div>

        {/* Desktop */}
        <div className="hidden lg:grid lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {services.map((service, i) => (
            <ServiceCard key={service.id} service={service} rank={i + 1} />
          ))}
        </div>
      </div>
    </section>
  )
}