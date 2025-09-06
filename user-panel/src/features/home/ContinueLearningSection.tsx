"use client"
import React, { JSX } from 'react';
import { ArrowRightIcon, BookmarkIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

const continueServices = [
  {
    id: "4",
    title: "Halal Business Development",
    progress: 65,
    totalLessons: 24,
    completedLessons: 16,
    nextLesson: "Ethical Marketing Strategies",
    instructor: "Ustadh Omar Malik",
    coverImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop"
  },
  {
    id: "5",
    title: "Arabic Language Fundamentals",
    progress: 40,
    totalLessons: 32,
    completedLessons: 13,
    nextLesson: "Grammar Foundations",
    instructor: "Dr. Amina Yusuf",
    coverImageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop"
  },
  {
    id: "6",
    title: "Islamic Psychology",
    progress: 80,
    totalLessons: 18,
    completedLessons: 14,
    nextLesson: "Counseling Techniques",
    instructor: "Dr. Sarah Al-Mansouri",
    coverImageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop"
  }
];

function ContinueLearningSection(): JSX.Element {
  const router = useRouter();

  return (
    <section className="py-8 sm:py-12 lg:py-14 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 sm:mb-10 lg:mb-8">
          <div className="lg:mb-2 mb-0">
            <span className="inline-flex items-center px-3 sm:px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
              <BookmarkIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Your Progress
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-1 sm:mb-0">
              Continue Learning
            </h2>
            <p className="text-base sm:text-lg text-slate-600 mt-1 sm:mt-2">
              Pick up where you left off
            </p>
          </div>
          <button 
            onClick={() => router.push('/my-purchases')}
            className="hidden sm:flex text-emerald-600 hover:text-emerald-700 font-medium items-center gap-1 transition-colors self-start sm:self-auto text-sm sm:text-base"
          >
            View All
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {continueServices.map((course) => (
            <div key={course.id} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col h-full">
              <div className="flex items-start gap-3 sm:gap-4 mb-4">
                <img 
                  src={course.coverImageUrl} 
                  alt={course.title}
                  className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg sm:rounded-xl flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 mb-1 text-sm sm:text-base line-clamp-2 leading-tight sm:leading-normal">
                    {course.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mb-2">
                    by {course.instructor}
                  </p>
                  <div className="text-xs text-slate-500">
                    {course.completedLessons} of {course.totalLessons} lessons completed
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-3 sm:mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs sm:text-sm font-medium text-slate-700">Progress</span>
                  <span className="text-xs sm:text-sm font-bold text-emerald-600">{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-1.5 sm:h-2 rounded-full transition-all duration-500"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Next Lesson */}
              <div className="bg-emerald-50 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 border border-emerald-100 flex-grow">
                <div className="text-xs text-emerald-700 mb-1 font-medium">Next Lesson:</div>
                <div className="font-medium text-slate-900 text-xs sm:text-sm leading-tight">
                  {course.nextLesson}
                </div>
              </div>

              {/* Continue Button */}
              <button 
                onClick={() => router.push(`/service/${course.id}/continue`)}
                className="w-full bg-emerald-500 text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium hover:bg-emerald-600 transition-colors shadow-sm mt-auto text-sm sm:text-base"
              >
                Continue Learning
              </button>
            </div>
          ))}
        </div>
        
        {/* Mobile View All */}
        <div className="flex justify-center sm:hidden mt-6">
          <button 
            onClick={() => router.push('/my-purchases')}
            className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 transition-colors text-sm border border-emerald-200 px-4 py-2 rounded-lg hover:bg-emerald-50"
          >
            View All Services
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default ContinueLearningSection;
