export default function IslamicValuesSection() {
  return (
    <section className="py-20 bg-gradient-to-r from-emerald-900 to-teal-900 relative overflow-hidden">
      {/* Islamic geometric pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Built on Islamic Foundations
          </h2>
          <p className="text-lg text-emerald-100 max-w-2xl mx-auto">
            Every aspect of our platform reflects the beautiful teachings of Islam
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: "🤲", title: "Du'a Before Learning", desc: "Every session begins with seeking Allah's guidance" },
            { icon: "🕌", title: "Prayer-Friendly Schedule", desc: "Course timings respect Islamic prayer times" },
            { icon: "💰", title: "Zakat-Conscious Pricing", desc: "Affordable education with sliding scale for those in need" },
            { icon: "🌙", title: "Ramadan Adaptations", desc: "Special schedules and content during holy months" }
          ].map((value, index) => (
            <div key={index} className="text-center group">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {value.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{value.title}</h3>
              <p className="text-emerald-100 text-sm leading-relaxed">{value.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="inline-flex items-center px-6 py-3 bg-white bg-opacity-10 rounded-full text-white">
            <span className="text-lg font-medium">
              "وَقُل رَّبِّ زِدْنِي عِلْمًا"
            </span>
          </div>
          <p className="text-emerald-200 text-sm mt-2 italic">
            "And say: My Lord, increase me in knowledge" - Quran 20:114
          </p>
        </div>
      </div>
    </section>
  )
}
