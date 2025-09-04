import {TargetIcon, StarIcon, GlobeIcon} from "@radix-ui/react-icons"
import FeatureCard from "./FeatureCard"

export default function FeaturesSection() {
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