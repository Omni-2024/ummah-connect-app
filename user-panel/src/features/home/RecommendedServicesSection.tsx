"use client"
import React from 'react';
import { ArrowRightIcon, StarIcon, PlayIcon, CheckCircledIcon } from "@radix-ui/react-icons";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

// Mock data based on your API structure
const mockServices = [
  {
    id: "824a20a3-1363-4fca-a16f-5dbfcd21e589",
    title: "Advanced Islamic Finance",
    tagline: "Master Shariah-compliant banking",
    description: "Comprehensive training in Islamic banking principles, sukuk, takaful, and modern Islamic financial instruments.",
    cmePoints: 10,
    coverImageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop",
    price: 150,
    totalReviewScore: "48",
    totalReviewCount: "12",
    averageReviewScore: "4.8",
    enrollmentCount: "2,450",
    learningPoints: [
      "Master Islamic banking principles",
      "Understand Sukuk structures",
      "Apply Shariah compliance frameworks",
      "Analyze Islamic investment products"
    ],
    discount: 20,
    discountEnabled: true,
    duration: 120,
    instructor: "Dr. Ahmad Al-Rashid",
    level: "Advanced"
  },
  {
    id: "2",
    title: "Quran Recitation Mastery",
    tagline: "Perfect your tajweed skills",
    description: "Learn proper Quranic recitation with certified qaris. Covers all tajweed rules and practical exercises.",
    cmePoints: 8,
    coverImageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
    price: 89,
    totalReviewScore: "95",
    totalReviewCount: "19",
    averageReviewScore: "4.9",
    enrollmentCount: "1,890",
    learningPoints: [
      "Master all tajweed rules",
      "Improve Quran memorization",
      "Practice with certified qaris",
      "Record and review sessions"
    ],
    discount: 15,
    discountEnabled: true,
    duration: 90,
    instructor: "Qari Muhammad Hassan",
    level: "Beginner"
  },
  {
    id: "3",
    title: "Islamic Leadership Excellence",
    tagline: "Lead with Islamic principles",
    description: "Develop leadership skills rooted in Islamic values. Perfect for Muslim executives and entrepreneurs.",
    cmePoints: 12,
    coverImageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
    price: 199,
    totalReviewScore: "72",
    totalReviewCount: "18",
    averageReviewScore: "4.7",
    enrollmentCount: "3,200",
    learningPoints: [
      "Islamic leadership principles",
      "Ethical decision making",
      "Team management in Islam",
      "Conflict resolution strategies"
    ],
    discount: 25,
    discountEnabled: true,
    duration: 150,
    instructor: "Dr. Fatima Al-Zahra",
    level: "Intermediate"
  }
];

// Main RecommendedServicesSection Component
function RecommendedServicesSection({ router }: { router: AppRouterInstance }) {
  const featuredService = mockServices[0];
  const otherServices = mockServices.slice(1);

  const calculateDiscountedPrice = (price: number, discount: number, discountEnabled: boolean) => {
    return discountEnabled ? price - (price * discount / 100) : price;
  };

  return (
    <section className="py-8 sm:py-10 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <span className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-emerald-50 text-emerald-700 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
            <StarIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
            Featured Service
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 sm:mb-4 px-4 sm:px-0">
            Start Your Islamic Journey
          </h2>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto px-4 sm:px-0">
            Handpicked services designed for Muslim professionals
          </p>
        </div>

        {/* Featured Service - Hero Layout */}
        <div className="mb-8 sm:mb-12 lg:mb-16">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl">
            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-0">
              {/* Content Section */}
              <div className="p-6 sm:p-8 lg:p-12 text-white order-2 lg:order-1">
                <div className="mb-3 sm:mb-4">
                  <span className="bg-white/20 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                    {featuredService.level}
                  </span>
                  {featuredService.discountEnabled && featuredService.discount > 0 && (
                    <span className="bg-red-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold ml-2">
                      {featuredService.discount}% OFF
                    </span>
                  )}
                </div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3">{featuredService.title}</h3>
                <p className="text-emerald-100 mb-1 sm:mb-2 font-medium text-sm sm:text-base">{featuredService.tagline}</p>
                <p className="text-white/80 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">{featuredService.description}</p>
                
                {/* Learning Points */}
                <div className="mb-4 sm:mb-6">
                  <h4 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">What you'll gain:</h4>
                  <div className="grid grid-cols-1 gap-1.5 sm:gap-2">
                    {featuredService.learningPoints.slice(0, 3).map((point, index) => (
                      <div key={index} className="flex items-start text-xs sm:text-sm text-white/90">
                        <CheckCircledIcon className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-200 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Stats */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8 text-xs sm:text-sm">
                  <div className="flex items-center gap-1">
                    <StarIcon className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                    <span>{featuredService.averageReviewScore}</span>
                    <span className="text-white/60">({featuredService.totalReviewCount})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <PlayIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">{featuredService.enrollmentCount} users</span>
                    <span className="sm:hidden">{featuredService.enrollmentCount}</span>
                  </div>
                  <div className="text-white/80">
                    {featuredService.duration} min
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <span className="text-2xl sm:text-3xl font-bold">
                      ${calculateDiscountedPrice(featuredService.price, featuredService.discount, featuredService.discountEnabled)}
                    </span>
                    {featuredService.discountEnabled && featuredService.discount > 0 && (
                      <span className="text-white/60 line-through ml-2 text-lg sm:text-xl">${featuredService.price}</span>
                    )}
                    <div className="text-xs sm:text-sm text-emerald-200 mt-1">
                      by {featuredService.instructor}
                    </div>
                  </div>
                  <button 
                    onClick={() => router.push(`/services/${featuredService.id}`)}
                    className="bg-white text-emerald-600 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg text-sm sm:text-base w-full sm:w-auto"
                  >
                    Book Now
                  </button>
                </div>
              </div>
              
              {/* Image Section */}
              <div className="relative order-1 lg:order-2 h-48 sm:h-64 lg:h-auto">
                <img 
                  src={featuredService.coverImageUrl} 
                  alt={featuredService.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/20"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Other Services - Responsive List */}
        <div className="space-y-3 sm:space-y-4">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6 px-4 sm:px-0">More Recommended Services</h3>
          {otherServices.map((service) => (
            <div 
              key={service.id} 
              className="bg-white border border-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300 hover:border-emerald-200 cursor-pointer mx-2 sm:mx-0"
              onClick={() => router.push(`/services/${service.id}`)}
            >
              <div className="flex flex-col sm:grid sm:grid-cols-4 gap-4 sm:gap-6 sm:items-center">
                {/* Image */}
                <div className="sm:col-span-1">
                  <img 
                    src={service.coverImageUrl} 
                    alt={service.title}
                    className="w-full h-40 sm:h-32 object-cover rounded-lg sm:rounded-xl"
                  />
                </div>
                
                {/* Content */}
                <div className="sm:col-span-2">
                  <div className="mb-2">
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                      {service.level}
                    </span>
                    {service.discountEnabled && service.discount > 0 && (
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full ml-2">
                        {service.discount}% OFF
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1 hover:text-emerald-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-emerald-600 text-sm font-medium mb-2">{service.tagline}</p>
                  <p className="text-slate-600 text-sm mb-3 leading-relaxed line-clamp-2 sm:line-clamp-3 lg:line-clamp-2">
                    {service.description}
                  </p>
                  <p className="text-xs text-slate-500 mb-2">by {service.instructor}</p>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <StarIcon className="w-3 h-3 text-yellow-500" />
                      {service.averageReviewScore} ({service.totalReviewCount})
                    </div>
                    <span className="hidden sm:inline">{service.enrollmentCount} users</span>
                    <span className="sm:hidden">{service.enrollmentCount}</span>
                    <span>{service.duration} min</span>
                  </div>
                </div>
                
                {/* Price and CTA */}
                <div className="sm:col-span-1 flex sm:flex-col justify-between sm:text-right items-end sm:items-end gap-4">
                  <div className="sm:mb-4">
                    <span className="text-xl sm:text-2xl font-bold text-slate-900">
                      ${calculateDiscountedPrice(service.price, service.discount, service.discountEnabled)}
                    </span>
                    {service.discountEnabled && service.discount > 0 && (
                      <div className="text-sm text-slate-400 line-through">${service.price}</div>
                    )}
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/services/${service.id}`);
                    }}
                    className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors whitespace-nowrap"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-8 sm:mt-12">
          <button 
            onClick={() => router.push('/explore')}
            className="bg-slate-900 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl hover:bg-slate-800 transition-all duration-200 font-semibold shadow-lg inline-flex items-center gap-2 text-sm sm:text-base"
          >
            View All Services
            <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default RecommendedServicesSection;
