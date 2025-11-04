"use client"
import { ArrowRightIcon } from "@radix-ui/react-icons"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { useRouter } from "next/navigation"


export default function IslamicLearningPathsSection() {
    const router = useRouter()

  const paths = [
    {
      title: "Islamic Finance & Business",
      description: "Master halal business practices and Islamic finance principles",
      color: "from-emerald-500 to-emerald-600",
      textColor: "text-emerald-600",
      bgColor: "bg-emerald-50",
      hoverBg: "group-hover:bg-emerald-100",
      icon: "💰"
    },
    {
      title: "Quran & Arabic Studies", 
      description: "Deepen your understanding of the Quran and Arabic language",
      color: "from-blue-500 to-blue-600",
      textColor: "text-blue-600", 
      bgColor: "bg-blue-50",
      hoverBg: "group-hover:bg-blue-100",
      icon: "📖"
    },
    {
      title: "Islamic Leadership",
      description: "Lead with Islamic principles in modern organizations", 
      color: "from-purple-500 to-purple-600",
      textColor: "text-purple-600",
      bgColor: "bg-purple-50",
      hoverBg: "group-hover:bg-purple-100",
      icon: "👑"
    },
    {
      title: "Halal Technology",
      description: "Navigate tech careers while maintaining Islamic values",
      color: "from-teal-500 to-teal-600",
      textColor: "text-teal-600",
      bgColor: "bg-teal-50",
      hoverBg: "group-hover:bg-teal-100",
      icon: "💻"
    }
  ];

  return (
    <section className="py-12 sm:py-12 lg:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 sm:mb-4 px-4 sm:px-0">
            Choose Your Path
          </h2>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto px-4 sm:px-0 leading-relaxed">
            Structured learning journeys for every Muslim professional
          </p>
        </div>

        {/* Learning Paths Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {paths.map((path, index) => (
            <div 
              key={index} 
              className={`group cursor-pointer ${path.bgColor} ${path.hoverBg} rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 active:scale-[0.98] sm:active:scale-100`}
            >
              {/* Mobile Layout (Stacked) */}
              <div className="sm:hidden">
                <div className="flex justify-center mb-4">
                  <div className="text-3xl p-3 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                    {path.icon}
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight">{path.title}</h3>
                  <p className="text-slate-600 mb-4 text-sm leading-relaxed px-2">{path.description}</p>
                </div>
              </div>

              {/* Tablet & Desktop Layout (Side by Side) */}
              <div className="hidden sm:flex items-start gap-4 lg:gap-6">
                <div className="flex-shrink-0">
                  <div className="text-4xl lg:text-5xl p-3 lg:p-4 bg-white rounded-xl lg:rounded-2xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                    {path.icon}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl lg:text-2xl font-bold text-slate-900 mb-2 leading-tight">{path.title}</h3>
                  <p className="text-slate-600 mb-4 leading-relaxed text-sm lg:text-base">{path.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Optional CTA Section */}
        <div className="text-center mt-8 sm:mt-12 lg:mt-16">
          <p className="text-slate-600 mb-4 sm:mb-6 text-sm sm:text-base px-4 sm:px-0">
            Not sure which path to choose? Take our quick assessment
          </p>
          <button onClick={() => router.push("/explore")} className="bg-slate-900 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl hover:bg-slate-800 transition-all duration-200 font-semibold shadow-lg inline-flex items-center gap-2 text-sm sm:text-base">
            Find My Path
            <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}