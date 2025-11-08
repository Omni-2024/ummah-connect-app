"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Service } from "@/types"
import { SkeletonServicesCard } from "@/features/explore/component/SkeletonCourseCard"
import ServiceCard from "@/features/app/components/ServiceCard";

export default function TrendingServicesSection({ 
  services, 
  loading, 
  error 
}: { 
  services: Service[]; 
  loading: boolean; 
  error: Error | null;
}) {
  const router = useRouter();

  if (loading) return (
    <section className="py-8 sm:py-12 bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8">
          <div className="h-4 sm:h-6 w-32 sm:w-48 bg-gray-200 rounded mx-auto mb-2 animate-pulse" />
          <div className="h-4 sm:h-6 w-32 sm:w-48 bg-gray-200 rounded mx-auto mb-2 animate-pulse" />
          <div className="h-3 sm:h-4 w-48 sm:w-72 bg-gray-200 rounded mx-auto animate-pulse" />
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <SkeletonServicesCard size="sm" variant="trending" />
          <SkeletonServicesCard size="sm" variant="trending" />
          <SkeletonServicesCard size="sm" variant="trending" />
          <SkeletonServicesCard size="sm" variant="trending" />
        </div>
      </div>
    </section>
  );
  
  if (error) return (
    <section className="py-8 sm:py-12 text-center px-4">
      <p className="text-gray-500 text-sm sm:text-base">{error.message || "Failed to load trending services."}</p>
    </section>
  );
  
  if (!services?.length) return null;

  const trendingServices = [...services]
    .filter(s => (typeof s.enrollmentCount === "string" ? parseInt(s.enrollmentCount, 10) : s.enrollmentCount) >= 1)
    .sort((a, b) => (typeof b.enrollmentCount === "string" ? parseInt(b.enrollmentCount, 10) : b.enrollmentCount) - (typeof a.enrollmentCount === "string" ? parseInt(a.enrollmentCount, 10) : a.enrollmentCount));

  if (!trendingServices.length) return null;
  
  if (trendingServices.length === 1) return (
    <section className="py-10 sm:py-16 bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/4 w-32 h-32 sm:w-48 sm:h-48 bg-lime-300 rounded-full opacity-20 blur-xl animate-pulse"></div>
      <div className="absolute bottom-1/3 right-1/4 w-32 h-32 sm:w-48 sm:h-48 bg-green-300 rounded-full opacity-20 blur-xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4 sm:mb-6">
          <div className="inline-flex items-center px-2 py-1 bg-white shadow-md rounded-full mb-2 border border-green-200">
            <span className="text-xs sm:text-sm font-semibold text-green-700">🔥 Hot Right Now</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-lime-600 to-green-700 bg-clip-text text-transparent mb-2">Trending Service</h2>
          <p className="text-sm sm:text-base text-slate-700">The most popular service right now</p>
        </div>
        <div className="flex justify-center">
          <ServiceCard 
            key={trendingServices[0].id} 
            service={trendingServices[0]} 
            variant="trending"
            trendingIndex={0}
            size="sm"
          />
        </div>
      </div>
    </section>
  );

  const topServices = trendingServices.slice(0, 4);
  return (
    <section className="py-8 sm:py-12 bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-28 h-28 sm:w-40 sm:h-40 bg-lime-300 rounded-full opacity-20 blur-lg animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-28 h-28 sm:w-40 sm:h-40 bg-green-300 rounded-full opacity-20 blur-lg animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4 sm:mb-6">
          <div className="inline-flex items-center px-2 py-1 bg-white shadow-md rounded-full mb-2 border border-green-200">
            <span className="text-xs sm:text-sm font-semibold text-green-700">🔥 Hot Right Now</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-lime-600 to-green-700 bg-clip-text text-transparent mb-2">Trending Services</h2>
          <p className="text-sm sm:text-base text-slate-700">Explore services that are currently popular among users</p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {topServices.map((service, idx) => (
            <ServiceCard 
              key={service.id} 
              service={service} 
              variant="trending"
              trendingIndex={idx}
              size="sm"
            />
          ))}
        </div>
      </div>
    </section>
  )
}