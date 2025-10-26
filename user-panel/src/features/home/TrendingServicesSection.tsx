"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Service } from "@/types"
import { cn } from "@/lib/className"
import { S3_BUCKET_URL } from "@/lib/constants"
import { buildAvatarUrl } from "@/features/app/components/Navbar"
import { SkeletonServicesCard } from "@/features/explore/component/SkeletonCourseCard"
import { TrendingUp, Star } from "lucide-react"
import Button from "@/components/base/Button"

const ServiceCard = ({ service, idx, router }: { service: Service; idx: number; router: ReturnType<typeof useRouter> }) => {
  const handleCardClick = () => router.push(`/service/${service.slug}`);
  const enrollmentCount = typeof service.enrollmentCount === "string" ? parseInt(service.enrollmentCount, 10) : service.enrollmentCount;

  return (
    <div onClick={handleCardClick} className={`relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden ${idx === 0 ? 'w-full max-w-3xl mx-auto' : ''}`}>
      <div className="absolute top-4 left-4 z-10 flex items-center gap-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-2 py-1 rounded-full shadow-md">
        <TrendingUp className="w-4 h-4 text-white" />
        <span className="text-white font-bold text-sm">#{idx + 1} Trending</span>
      </div>
      <div className="relative h-64">
        <img src={service.coverImageUrl ? buildAvatarUrl(service.coverImageUrl) || `${S3_BUCKET_URL}/images/coverImage.png` : "/images/coverImage.png"} alt={service.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-bold">{service.averageReviewScore || '0.0'}</span>
            </span>
            <span className="bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg text-sm">{Number(enrollmentCount).toLocaleString()} enrolled</span>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-slate-900 text-xl mb-2 line-clamp-2">{service.title}</h3>
        <p className="text-slate-600 text-sm mb-4 line-clamp-2">{service.tagline}</p>
        <Button variant="primary" className="w-full text-base py-2">Join the Trend</Button>
      </div>
    </div>
  )
}

export default function TrendingServicesSection({ services, loading, error, router }: { services: Service[]; loading: boolean; error: Error | null; router: ReturnType<typeof useRouter> }) {
  if (loading) return (
    <section className="py-12 bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="h-6 w-48 bg-gray-200 rounded mx-auto mb-2 animate-pulse" />
          <div className="h-6 w-48 bg-gray-200 rounded mx-auto mb-2 animate-pulse" />
          <div className="h-4 w-72 bg-gray-200 rounded mx-auto animate-pulse" />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
        <SkeletonServicesCard /><SkeletonServicesCard /><SkeletonServicesCard />
        </div>
      </div>
    </section>
  );
  if (error) return <section className="py-12 text-center"><p className="text-gray-500">{error.message || "Failed to load trending services."}</p></section>;
  if (!services?.length) return null;

  const trendingServices = [...services]
    .filter(s => (typeof s.enrollmentCount === "string" ? parseInt(s.enrollmentCount, 10) : s.enrollmentCount) >= 1)
    .sort((a, b) => (typeof b.enrollmentCount === "string" ? parseInt(b.enrollmentCount, 10) : b.enrollmentCount) - (typeof a.enrollmentCount === "string" ? parseInt(a.enrollmentCount, 10) : a.enrollmentCount));

  if (!trendingServices.length) return null;
  if (trendingServices.length === 1) return (
    <section className="py-16 bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/4 w-48 h-48 bg-lime-300 rounded-full opacity-20 blur-xl animate-pulse"></div>
      <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-green-300 rounded-full opacity-20 blur-xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center px-2 py-1 bg-white shadow-md rounded-full mb-2 border border-green-200">
            <span className="text-sm font-semibold text-green-700">🔥 Hot Right Now</span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-lime-600 to-green-700 bg-clip-text mb-2">Trending Service</h2>
          <p className="text-base text-slate-700">The most popular service right now</p>
        </div>
        <div className="flex justify-center"><ServiceCard key={trendingServices[0].id} service={trendingServices[0]} idx={0} router={router} /></div>
      </div>
    </section>
  );

  const topServices = trendingServices.slice(0, 2);
  return (
    <section className="py-12 bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-lime-300 rounded-full opacity-20 blur-lg animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-green-300 rounded-full opacity-20 blur-lg animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center px-2 py-1 bg-white shadow-md rounded-full mb-2 border border-green-200">
            <span className="text-sm font-semibold text-green-700">🔥 Hot Right Now</span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-lime-600 to-green-700 bg-clip-text mb-2">Trending Services</h2>
          <p className="text-base text-slate-700">Explore services that are currently popular among users</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4"><ServiceCard key={topServices[0].id} service={topServices[0]} idx={0} router={router} /><ServiceCard key={topServices[1].id} service={topServices[1]} idx={1} router={router} /></div>
      </div>
    </section>
  )
}