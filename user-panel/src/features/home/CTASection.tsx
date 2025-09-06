import React from "react"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"


export default function CTASection({ router }: { router: AppRouterInstance }) {
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