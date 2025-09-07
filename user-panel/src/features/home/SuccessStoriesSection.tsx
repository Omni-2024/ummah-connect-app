"use client"
import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon, ArrowRightIcon, CheckCircledIcon } from "@radix-ui/react-icons";

// Success Stories Section with Carousel
function SuccessStoriesSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [visibleCount, setVisibleCount] = useState(1); // Tracks number of visible stories

  const stories = [
    {
      name: "Ahmed Al-Rashid",
      role: "Islamic Finance Director",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      quote: "Ummah Community helped me transition from conventional banking to Islamic finance. Alhamdulillah, I now lead a Sharia-compliant investment team.",
      course: "Islamic Banking Certification",
      company: "Dubai Islamic Bank"
    },
    {
      name: "Fatima Hassan",
      role: "Tech Entrepreneur",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      quote: "The Islamic Leadership course taught me how to build a successful startup while maintaining Islamic values. My halal tech company now serves 10,000+ Muslims worldwide, and we continue to grow.",
      course: "Islamic Leadership Program",
      company: "HalalTech Solutions"
    },
    {
      name: "Omar Ibn Malik",
      role: "Quran Teacher & Developer",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      quote: "Through the Quran Studies program, I improved my tajweed and now teach 200+ students online. This platform transformed my da'wah journey.",
      course: "Advanced Quran Studies",
      company: "Islamic Learning Academy"
    },
    {
      name: "Aisha Rahman",
      role: "Halal Food Entrepreneur",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      quote: "The Islamic Business Ethics course gave me the knowledge to scale my halal food business nationwide while staying true to Islamic principles.",
      course: "Islamic Business Ethics",
      company: "Pure Halal Foods"
    },
    {
      name: "Yusuf Al-Mansouri",
      role: "Islamic Counselor",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      quote: "The Psychology in Islam course helped me integrate Islamic wisdom with modern counseling. I now help Muslims worldwide overcome mental health challenges.",
      course: "Psychology in Islam",
      company: "Healing Hearts Counseling"
    },
    {
      name: "Maryam Al-Zahra",
      role: "Islamic Fashion Designer",
      image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face",
      quote: "Learning about Islamic art and design principles transformed my fashion brand. We now create modest wear that celebrates Islamic heritage beautifully.",
      course: "Islamic Art & Design",
      company: "Modesty Couture"
    }
  ];

  // Update visibleCount based on window width
  useEffect(() => {
    const updateVisibleCount = () => {
      const width = window.innerWidth;
      if (width >= 1024) setVisibleCount(3);
      else if (width >= 768) setVisibleCount(2);
      else setVisibleCount(1);
    };

    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % stories.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, stories.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % stories.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + stories.length) % stories.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  // Get visible stories
  const getVisibleStories = () => {
    const stories_copy = [...stories, ...stories]; // Duplicate for seamless loop
    return stories_copy.slice(currentSlide, currentSlide + visibleCount);
  };

  return (
    <section className="py-4 bg-white relative overflow-hidden mb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 sm:mb-4 px-4 sm:px-0">
            Success Stories from Our Ummah
          </h2>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto px-4 sm:px-0 leading-relaxed">
            Real transformations from Muslim professionals who chose to grow with us
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white border border-gray-200 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group hover:border-emerald-300"
            onMouseEnter={() => setIsAutoPlaying(false)}
          >
            <ArrowLeftIcon className="w-5 h-5 text-gray-600 group-hover:text-emerald-600" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white border border-gray-200 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group hover:border-emerald-300"
            onMouseEnter={() => setIsAutoPlaying(false)}
          >
            <ArrowRightIcon className="w-5 h-5 text-gray-600 group-hover:text-emerald-600" />
          </button>

          {/* Cards */}
          <div className="mx-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {getVisibleStories().map((story, index) => (
                <div key={`${story.name}-${currentSlide}-${index}`} className="group animate-fadeIn h-full">
                  <div className="bg-gradient-to-br from-emerald-50 to-white p-8 rounded-2xl border border-emerald-100 hover:shadow-xl transition-all duration-300 h-full flex flex-col min-h-[420px]">
                    <div className="flex items-center mb-6 flex-shrink-0">
                      <div className="relative">
                        <img 
                          src={story.image} 
                          alt={story.name}
                          className="w-16 h-16 rounded-full object-cover border-3 border-emerald-200"
                        />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                          <CheckCircledIcon className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <div className="ml-4 flex-1">
                        <h4 className="font-bold text-slate-900 text-lg">{story.name}</h4>
                        <p className="text-sm text-emerald-600 font-medium">{story.role}</p>
                        <p className="text-xs text-slate-500">{story.company}</p>
                      </div>
                    </div>

                    <blockquote className="text-slate-700 mb-6 leading-relaxed italic flex-grow text-sm">
                      "{story.quote}"
                    </blockquote>

                    <div className="mt-auto flex-shrink-0">
                      <div className="inline-flex items-center px-3 py-2 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                        <CheckCircledIcon className="w-3 h-3 mr-2" />
                        Completed: {story.course}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center mt-12 gap-2">
            {Array.from({ length: stories.length }, (_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentSlide 
                    ? 'bg-emerald-500 scale-110' 
                    : 'bg-gray-300 hover:bg-emerald-300'
                }`}
                onMouseEnter={() => setIsAutoPlaying(false)}
              />
            ))}
          </div>

          {/* Auto-play toggle */}
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="text-xs text-slate-500 hover:text-emerald-600 transition-colors duration-200"
            >
              {isAutoPlaying ? '⏸️ Pause' : '▶️ Play'} Auto-scroll
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </section>
  );
}

export default SuccessStoriesSection;
