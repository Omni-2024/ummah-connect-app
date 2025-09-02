"use client"

import React from "react"
import { useAuthState } from "@/features/auth/context/useAuthState"
import { useRouter } from "next/navigation"
import { ArrowRightIcon, PersonIcon, TargetIcon, StarIcon, GlobeIcon } from "@radix-ui/react-icons"
import Header from "./header/page"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import type { ReactNode, MouseEventHandler } from "react"

interface DashboardCardProps {
  icon: ReactNode
  title: string
  description: string
  action: string
  onClick?: MouseEventHandler<HTMLDivElement>
}
export default function HomePage() {
  const { isAuthenticated } = useAuthState()
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <HeroSection isAuthenticated={isAuthenticated} router={router} />
      
      {/* Features Section - shown to everyone */}
      <FeaturesSection />
      
      {/* Categories Section - shown to everyone */}
      <CategoriesSection router={router} />
      
      {/* Dashboard/Stats Section - shown only to authenticated users */}
      {isAuthenticated && <DashboardSection router={router} />}
      
      {/* CTA Section - shown to unauthenticated users */}
      {!isAuthenticated && <CTASection router={router} />}
      
      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600"></div>
              <span className="text-xl font-bold">Ummah Community</span>
            </div>
            <div className="text-slate-400">© 2025 Ummah Community. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function HeroSection({ isAuthenticated, router }: { isAuthenticated: boolean; router: AppRouterInstance }) {
  return (
    <section className="relative bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Advance Your{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Medical Career
            </span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed max-w-2xl mx-auto">
            Join thousands of healthcare professionals learning from world-class courses in medicine, dentistry, and allied health sciences.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => router.push("/user/signup")}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2"
                >
                  Start Learning Today
                  <ArrowRightIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => router.push("/courses")}
                  className="border-2 border-slate-300 text-slate-700 px-8 py-4 rounded-xl hover:border-emerald-500 hover:text-emerald-600 transition-all duration-200 text-lg font-semibold"
                >
                  Browse Courses
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push("/dashboard")}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2"
                >
                  Continue Learning
                  <ArrowRightIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => router.push("/courses")}
                  className="border-2 border-slate-300 text-slate-700 px-8 py-4 rounded-xl hover:border-emerald-500 hover:text-emerald-600 transition-all duration-200 text-lg font-semibold"
                >
                  Explore New Courses
                </button>
              </>
            )}
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900">500+</div>
              <div className="text-sm text-slate-600">Courses</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900">50K+</div>
              <div className="text-sm text-slate-600">Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900">200+</div>
              <div className="text-sm text-slate-600">Experts</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  const features = [
    {
      icon: <StarIcon className="w-8 h-8 text-emerald-600" />,
      title: "Expert-Led Courses",
      description: "Learn from practicing physicians, specialists, and healthcare professionals with years of experience."
    },
    {
      icon: <TargetIcon className="w-8 h-8 text-emerald-600" />,
      title: "Practical Learning",
      description: "Apply knowledge through case studies, simulations, and real-world scenarios relevant to your practice."
    },
    {
      icon: <StarIcon className="w-8 h-8 text-emerald-600" />,
      title: "Certified Programs",
      description: "Earn certificates and continuing education credits recognized by professional medical bodies."
    },
    {
      icon: <GlobeIcon className="w-8 h-8 text-emerald-600" />,
      title: "Global Community",
      description: "Connect with healthcare professionals worldwide and share knowledge across cultures and practices."
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Why Choose Ummah Community?</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            We're dedicated to advancing healthcare education through innovative learning experiences.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  )
}

function CategoriesSection({ router }: { router: AppRouterInstance }) {
  const categories = [
    {
      title: "Physicians",
      description: "General Medicine, Surgery, Pediatrics, Psychiatry",
      icon: <PersonIcon className="w-12 h-12 text-emerald-600" />,
      courses: "150+ courses",
      bgColor: "from-emerald-50 to-teal-50"
    },
    {
      title: "Dentistry", 
      description: "General Dentistry, Orthodontics, Oral Surgery",
      icon: <StarIcon className="w-12 h-12 text-blue-600" />,
      courses: "80+ courses",
      bgColor: "from-blue-50 to-indigo-50"
    },
    {
      title: "Allied Health",
      description: "Nursing, Physical Therapy, Medical Technology",
      icon: <TargetIcon className="w-12 h-12 text-purple-600" />,
      courses: "120+ courses", 
      bgColor: "from-purple-50 to-pink-50"
    }
  ]

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Explore by Specialty</h2>
          <p className="text-lg text-slate-600">
            Find courses tailored to your healthcare profession and specialty.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <div
              key={index}
              onClick={() => router.push(`/courses/${category.title.toLowerCase()}`)}
              className={`bg-gradient-to-br ${category.bgColor} p-8 rounded-2xl cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-white`}
            >
              <div className="mb-6">{category.icon}</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">{category.title}</h3>
              <p className="text-slate-600 mb-4">{category.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">{category.courses}</span>
                <ArrowRightIcon className="w-5 h-5 text-slate-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function DashboardSection({ router }: { router: AppRouterInstance }) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Your Learning Journey</h2>
          <p className="text-lg text-slate-600">Continue where you left off and discover new opportunities.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <DashboardCard
            icon={<StarIcon className="w-8 h-8 text-emerald-600" />}
            title="Continue Learning"
            description="Resume your in-progress courses and keep building your expertise."
            action="View Dashboard"
            onClick={() => router.push("/dashboard")}
          />
          <DashboardCard
            icon={<StarIcon className="w-8 h-8 text-blue-600" />}
            title="Recommended for You"
            description="Discover courses curated based on your learning history and interests."
            action="See Recommendations"
            onClick={() => router.push("/recommendations")}
          />
          <DashboardCard
            icon={<TargetIcon className="w-8 h-8 text-purple-600" />}
            title="Your Achievements"
            description="Track your progress, certificates, and learning milestones."
            action="View Progress"
            onClick={() => router.push("/achievements")}
          />
        </div>
      </div>
    </section>
  )
}

function CTASection({ router }: { router: AppRouterInstance }) {
  return (
    <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-700">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-white mb-6">
          Ready to Advance Your Medical Career?
        </h2>
        <p className="text-xl text-emerald-100 mb-8">
          Join thousands of healthcare professionals who trust Ummah Community for their continuing education.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push("/user/signup")}
            className="bg-white text-emerald-600 px-8 py-4 rounded-xl hover:bg-slate-50 transition-all duration-200 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Get Started Free
          </button>
          <button
            onClick={() => router.push("/courses")}
            className="border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-emerald-600 transition-all duration-200 text-lg font-semibold"
          >
            Browse Courses
          </button>
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <div className="mb-6">{icon}</div>
      <h3 className="text-xl font-semibold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  )
}

function DashboardCard({ icon, title, description, action, onClick }: DashboardCardProps) {
  return (
    <div
      className={`bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300 hover:-translate-y-1 ${
        onClick ? "cursor-pointer" : ""
      }`}
      onClick={onClick}
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 text-sm mb-4">{description}</p>
      <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center gap-1 transition-colors duration-200">
        {action}
        <ArrowRightIcon className="w-4 h-4" />
      </button>
    </div>
  )
}

