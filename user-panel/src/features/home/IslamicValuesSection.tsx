"use client"
export default function IslamicValuesSection() {
  return (
    <section className="py-10 sm:py-10 lg:py-16 bg-gradient-to-r from-emerald-900 to-teal-900 relative overflow-hidden">
      {/* Islamic geometric pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4 px-4 sm:px-0">
            Built on Islamic Foundations
          </h2>
          <p className="text-base sm:text-lg text-emerald-100 max-w-2xl mx-auto px-4 sm:px-0 leading-relaxed">
            Every aspect of our platform reflects the beautiful teachings of Islam
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-8">
          {[
            { 
              icon: "🤲", 
              title: "Serve & Earn Halal", 
              desc: "Empower your skills while earning in a lawful, dignified, and ethical way." 
            },
            { 
              icon: "🕌", 
              title: "Faith-Aligned", 
              desc: "Designed to support worship, ethics, and sincere intentions in every interaction." 
            },
            { 
              icon: "💰", 
              title: "Community-First Pricing", 
              desc: "Affordable, flexible pricing designed to support the Ummah" 
            },
            { 
              icon: "🌙", 
              title: "Safe, Secure & Private", 
              desc: "Your data, transactions, and conversations are protected with strong safeguards" 
            }
          ].map((value, index) => (
            <div 
              key={index} 
              className="text-center group p-4 sm:p-6 lg:p-4 rounded-xl hover:bg-white/5 transition-all duration-300"
            >
              {/* Icon */}
              <div className="text-4xl sm:text-5xl lg:text-4xl xl:text-5xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                {value.icon}
              </div>
              
              {/* Title */}
              <h3 className="text-lg sm:text-xl lg:text-lg xl:text-xl font-semibold text-white mb-2 sm:mb-3 leading-tight px-2 sm:px-0">
                {value.title}
              </h3>
              
              {/* Description */}
              <p className="text-emerald-100 text-sm sm:text-base lg:text-sm xl:text-base leading-relaxed px-2 sm:px-0">
                {value.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Quranic Verse Section */}
        <div className="text-center mt-12 sm:mt-16 lg:mt-20">
          <div className="inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 bg-white bg-opacity-10 rounded-full text-white backdrop-blur-sm">
            <span className="text-base sm:text-lg font-medium">
              "وَقُل رَّبِّ زِدْنِي عِلْمًا"
            </span>
          </div>
          <p className="text-emerald-200 text-xs sm:text-sm mt-2 sm:mt-3 italic px-4 sm:px-0 leading-relaxed">
            "And say: My Lord, increase me in knowledge" - Quran 20:114
          </p>
        </div>

        {/* Optional decorative elements for larger screens */}
        <div className="hidden lg:block absolute top-1/2 left-8 transform -translate-y-1/2 text-white/5 text-8xl pointer-events-none select-none">
          ☪
        </div>
        <div className="hidden lg:block absolute top-1/3 right-8 transform -translate-y-1/2 text-white/5 text-6xl pointer-events-none select-none">
          ✦
        </div>
      </div>
    </section>
  )
}