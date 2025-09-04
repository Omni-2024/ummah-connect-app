
import {ArrowRightIcon} from "@radix-ui/react-icons"
import Button from "@/components/base/Button";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export default function HeroSection({ isAuthenticated, router }: { isAuthenticated: boolean; router: AppRouterInstance }) {

  const stats = [
  { value: "500+", label: "Sellers" },
  { value: "30K+", label: "Buyers" },
  { value: "200+", label: "Experts" },
  ]
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
                <Button
                  variant="unstyled"
                  onClick={() => router.push("/user/signup")}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-6 rounded-xl transition-all duration-200 text-lg font-semibold shadow-lg hover:from-emerald-600 hover:to-emerald-700 hover:-translate-y-1 hover:shadow-xl transform flex items-center gap-2"
                >
                  Start Learning Today
                  <ArrowRightIcon className="w-5 h-5" />
                </Button>
                <Button
                  variant="unstyled"
                  onClick={() => router.push("/courses")}
                  className="border-2 border-emerald-500 text-emerald-600 px-8 py-6 rounded-xl transition-all duration-200 text-lg font-semibold hover:bg-emerald-500 hover:text-white hover:-translate-y-1 transform"
                >
                  Browse Courses
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="unstyled"
                  onClick={() => router.push("/dashboard")}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-6 rounded-xl transition-all duration-200 text-lg font-semibold shadow-lg hover:-translate-y-1 hover:shadow-xl hover:text-white transform flex items-center gap-2"
                >
                  Continue Learning
                  <ArrowRightIcon className="w-5 h-5" />
                </Button>
                <Button
                  variant="unstyled"
                  onClick={() => router.push("/courses")}
                  className="border-2 border-emerald-500 text-color px-8 py-6 rounded-xl transition-all duration-200 text-lg font-semibold hover:bg-background-light hover:-translate-y-1 transform"
                >
                  Explore New Courses
                </Button>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
            {stats.map((stat, index) => (
                <div key={index} className="text-center">
                <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-sm text-slate-600">{stat.label}</div>
                </div>
            ))}
            </div>
        </div>
      </div>
    </section>
  )
}