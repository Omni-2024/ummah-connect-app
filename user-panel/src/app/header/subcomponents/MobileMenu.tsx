import React from "react"
import { ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons"
import { useRouter } from "next/navigation"

const MobileMenu = ({
  mobileExploreOpen,
  setMobileExploreOpen,
  selectedMobileCategory,
  setSelectedMobileCategory,
  exploreCategories,
  categoriesLoading,
  categoriesError,
  handleMobileNavigation,
  router,
  isAuthenticated
}: {
  mobileExploreOpen: boolean;
  setMobileExploreOpen: (open: boolean) => void;
  selectedMobileCategory: string | null;
  setSelectedMobileCategory: (category: string | null) => void;
  exploreCategories: any[];
  categoriesLoading: boolean;
  categoriesError: any;
  handleMobileNavigation: (path: string) => void;
  router: any;
  isAuthenticated: boolean;
}) => {
  return (
    <div className="lg:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="px-4 py-4 border-b border-slate-100">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search courses, topics, members..."
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>
      <div className="py-2">
        {!mobileExploreOpen && !selectedMobileCategory ? (
          <div className="space-y-1 px-4">
            <button
              onClick={() => setMobileExploreOpen(true)}
              className="w-full flex items-center justify-between px-4 py-4 text-left text-base font-medium text-slate-700 hover:text-emerald-600 hover:bg-slate-50 rounded-lg transition-all duration-200"
            >
              <span>Explore Categories</span>
              <ChevronRightIcon className="w-5 h-5 text-slate-400" />
            </button>
            <button
              onClick={() => handleMobileNavigation("/courses")}
              className="w-full text-left px-4 py-4 text-base font-medium text-slate-700 hover:text-emerald-600 hover:bg-slate-50 rounded-lg transition-colors duration-200"
            >
              View All Courses
            </button>
            {!isAuthenticated && (
              <>
                <div className="border-t border-slate-100 my-2"></div>
                <button
                  onClick={() => handleMobileNavigation("/user/login")}
                  className="w-full text-left px-4 py-4 text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors duration-200"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleMobileNavigation("/user/signup")}
                  className="mx-4 mt-2 mb-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-4 rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 text-center font-medium"
                >
                  Join Now
                </button>
              </>
            )}
          </div>
        ) : mobileExploreOpen && !selectedMobileCategory ? (
          <div className="px-4">
            <div className="flex items-center justify-between py-4 border-b border-slate-100 mb-2">
              <button
                onClick={() => setMobileExploreOpen(false)}
                className="flex items-center text-emerald-600 hover:text-emerald-700 transition-colors duration-200"
              >
                <ChevronLeftIcon className="w-5 h-5 mr-1" />
                <span className="font-medium">Back</span>
              </button>
              <h3 className="text-lg font-semibold text-slate-900">Categories</h3>
              <div className="w-16"></div>
            </div>
            {categoriesLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                <span className="ml-3 text-slate-600">Loading categories...</span>
              </div>
            ) : categoriesError ? (
              <div className="text-center py-12 text-red-600">Error loading categories</div>
            ) : exploreCategories.length === 0 ? (
              <div className="text-center py-12 text-slate-600">No categories available</div>
            ) : (
              <div className="space-y-2">
                {exploreCategories.map((category) => (
                  <div key={category.title}>
                    <button
                      onClick={() => {
                        if (category.subcategories.length > 0) {
                          setSelectedMobileCategory(category.title)
                        } else {
                          handleMobileNavigation(`/courses/${category.title.toLowerCase().replace(/\s+/g, '-')}`)
                        }
                      }}
                      className="w-full flex items-center justify-between px-4 py-4 text-left rounded-lg hover:bg-slate-50 transition-all duration-200 group"
                    >
                      <div className="flex-1">
                        <div className="text-base font-medium text-slate-900 group-hover:text-emerald-700">{category.title}</div>
                        <div className="text-sm text-slate-500 mt-0.5">{category.subcategories.length} specializations</div>
                      </div>
                      <ChevronRightIcon className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors duration-200" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="px-4">
            {(() => {
              const selectedCategory = exploreCategories.find(cat => cat.title === selectedMobileCategory)
              return (
                <>
                  <div className="flex items-center justify-between py-4 border-b border-slate-100 mb-2">
                    <button
                      onClick={() => setSelectedMobileCategory(null)}
                      className="flex items-center text-emerald-600 hover:text-emerald-700 transition-colors duration-200"
                    >
                      <ChevronLeftIcon className="w-5 h-5 mr-1" />
                      <span className="font-medium">Back</span>
                    </button>
                    <h3 className="text-lg font-semibold text-slate-900 truncate max-w-48">{selectedMobileCategory}</h3>
                    <div className="w-16"></div>
                  </div>
                  <button
                    onClick={() => handleMobileNavigation(`/courses/${selectedMobileCategory?.toLowerCase().replace(/\s+/g, '-')}`)}
                    className="w-full px-4 py-4 mb-3 text-left bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg hover:from-emerald-100 hover:to-teal-100 transition-all duration-200"
                  >
                    <div className="text-base font-semibold text-emerald-700">View All {selectedMobileCategory}</div>
                    <div className="text-sm text-emerald-600 mt-0.5">Browse all courses in this category</div>
                  </button>
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-slate-600 uppercase tracking-wide px-2 py-2">Specializations</h4>
                    {selectedCategory?.subcategories?.map((sub: any) => (
                      <button
                        key={sub.name}
                        onClick={() => handleMobileNavigation(`/courses/${sub.slug}`)}
                        className="w-full text-left px-4 py-3 text-slate-700 hover:text-emerald-600 hover:bg-slate-50 rounded-lg transition-all duration-200"
                      >
                        <div className="text-base font-medium">{sub.name}</div>
                      </button>
                    )) || (
                      <div className="px-4 py-8 text-center text-slate-500">No specializations available</div>
                    )}
                  </div>
                </>
              )
            })()}
          </div>
        )}
      </div>
    </div>
  )
}

export default MobileMenu