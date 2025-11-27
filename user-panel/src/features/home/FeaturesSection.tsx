"use client"
import {TargetIcon, StarIcon, GlobeIcon, BookmarkIcon, PersonIcon} from "@radix-ui/react-icons"

export default function FeaturesSection() {
  const features = [
    {
      icon: <BookmarkIcon className="w-6 h-6" />,
      title: "Islamic Ethics Integration",
      description: "Every course designed with Islamic values at its core"
    },
    {
      icon: <PersonIcon className="w-6 h-6" />,
      title: "Certified Islamic Scholars", 
      description: "Learn from qualified ulama and industry professionals"
    },
    {
      icon: <GlobeIcon className="w-6 h-6" />,
      title: "Global Ummah Network",
      description: "Connect with Muslim professionals worldwide"
    },
    {
      icon: <StarIcon className="w-6 h-6" />,
      title: "Blessed Learning",
      description: "Experience barakah through proper Islamic etiquettes"
    }
  ];

  return (
    <section className="py-8 bg-white mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-2 sm:mb-3">
            Why Choose Us?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed px-4">
            More than just education - we nurture Muslim excellence
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-emerald-100 text-emerald-600 rounded-2xl mb-3 sm:mb-4 group-hover:bg-emerald-200 transition-colors duration-300">
                {feature.icon}
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2 px-2">{feature.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed px-2">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}