
"use client"
import {ArrowRightIcon} from "@radix-ui/react-icons"
import Button from "@/components/base/Button";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export default function HeroSection({ isAuthenticated, router }: { isAuthenticated: boolean; router: AppRouterInstance }) {
  const stats = [
    { value: "10K+", label: "Muslim Learners" },
    { value: "500+", label: "Islamic Courses" },
    { value: "100+", label: "Certified Scholars" },
  ]

  return (
    <section className="relative bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-20 overflow-hidden">
      {/* Islamic Pattern Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-emerald-600 rounded-full transform rotate-45"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-teal-600 rounded-full transform rotate-12"></div>
        <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-emerald-500 rounded-full transform -rotate-12"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-4">
            <span className="inline-flex items-center px-4 py-2 sm:py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium">
              🕌 Serving the Ummah Worldwide
            </span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-4 sm:mb-6 leading-tight">
            Grow in{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Islamic Knowledge
            </span>
            <br />& Professional Skills
          </h1>
          
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto px-4 sm:px-0">
            Join thousands of Muslims advancing their careers while staying true to Islamic principles. Learn from certified scholars and industry experts.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            {!isAuthenticated ? (
              <>
                <Button
                  variant="unstyled"
                  onClick={() => router.push("/user/signup")}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-6 rounded-xl transition-all duration-200 text-lg font-semibold shadow-lg hover:from-emerald-600 hover:to-emerald-700 hover:-translate-y-1 hover:shadow-xl transform flex items-center gap-2"
                >
                  Begin Your Journey
                  <ArrowRightIcon className="w-5 h-5" />
                </Button>
                <Button
                  variant="unstyled"
                  onClick={() => router.push("/explore")}
                  className="border-2 border-emerald-500 text-emerald-600 px-8 py-6 rounded-xl transition-all duration-200 text-lg font-semibold hover:bg-emerald-500 hover:text-white hover:-translate-y-1 transform"
                >
                  Explore Services
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="unstyled"
                  onClick={() => router.push("/my-purchases")}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-6 rounded-xl transition-all duration-200 text-lg font-semibold shadow-lg hover:-translate-y-1 hover:shadow-xl hover:text-white transform flex items-center gap-2"
                >
                  Continue Learning
                  <ArrowRightIcon className="w-5 h-5" />
                </Button>
                <Button
                  variant="unstyled"
                  onClick={() => router.push("/explore")}
                  className="border-2 border-emerald-500 text-color px-8 py-6 rounded-xl transition-all duration-200 text-lg font-semibold hover:bg-background-light hover:-translate-y-1 transform"
                >
                  Discover New Paths
                </Button>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-2 sm:mt-16 max-w-2xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-2xl sm:text-3xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors duration-200">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}