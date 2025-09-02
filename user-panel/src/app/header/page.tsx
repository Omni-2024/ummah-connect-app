"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAuthState } from "@/features/auth/context/useAuthState"
import { useCurrentUser } from "@/lib/hooks/useUser"
import { useCategories } from "@/lib/hooks/useCategories"
import { 
  PersonIcon, 
  HamburgerMenuIcon, 
  Cross1Icon, 
  ChevronDownIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon, 
  BellIcon,
  BookmarkIcon,
  GearIcon,
  ExitIcon,
  DashboardIcon,
  ChevronLeftIcon
} from "@radix-ui/react-icons"
import { NAV_LOGO_SRC } from "@/lib/constants"
import envs from "@/lib/env"

const buildAvatarUrl = (img?: string | null) => {
  if (!img) return null;
  if (/^https?:\/\//i.test(img)) return img;
  const base = envs.imageBaseUrl;
  return `${base}/${img}`;
};

export default function Header() {
  const { isAuthenticated, logout } = useAuthState()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [exploreDropdownOpen, setExploreDropdownOpen] = useState(false)
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const { data: user, isFetched, isLoading } = useCurrentUser()
  const [avatarBroken, setAvatarBroken] = useState(false)
  const [mobileExploreOpen, setMobileExploreOpen] = useState(false)
  const [selectedMobileCategory, setSelectedMobileCategory] = useState<string | null>(null)

  
  // Fetch categories dynamically
  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useCategories()

  const avatarUrl = buildAvatarUrl(user?.profileImage)

  useEffect(() => {
    console.log("user data:", user)
  }, [user])

  useEffect(() => {
    console.log("categories data:", categories)
  }, [categories])

  const handleLogout = () => {
    logout()
    router.push("/")
    setProfileDropdownOpen(false)
  }

  // Transform API data to match the expected structure
  const exploreCategories = React.useMemo(() => {
    if (!categories || categoriesLoading || categoriesError) {
      return []
    }

    return categories.map((category: any) => ({
      title: category.name,
      subcategories: category.specialists?.map((sub: any) => ({
        name: sub.name,
        slug: sub.name.toLowerCase().replace(/\s+/g, '-')
      })) || []
    }))
  }, [categories])
  
    const handleMobileNavigation = (path: string) => {
    router.push(path)
    setMobileMenuOpen(false)
    setMobileExploreOpen(false)
    setSelectedMobileCategory(null)
    }

  return (
    <header className="sticky h-20 top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm pt-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 cursor-pointer" onClick={() => router.push("/")}>
              <Image 
                src={NAV_LOGO_SRC} 
                alt="Ummah Community Logo" 
                width={150} 
                height={50} 
                priority
                className="h-10 w-auto"
              />
            </div>
          </div>

          {/* Desktop Navigation - Explore Dropdown */}
          <nav className="hidden lg:flex items-center space-x-1">
            <div className="relative">
              <button
                onClick={() => setExploreDropdownOpen(!exploreDropdownOpen)}
                onMouseEnter={() => setExploreDropdownOpen(true)}
                className="flex items-center space-x-1 text-slate-700 hover:text-emerald-600 px-4 py-2 text-sm font-medium transition-all duration-200 relative group rounded-lg hover:bg-slate-50"
              >
                <span>Explore</span>
                <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${exploreDropdownOpen ? 'rotate-180' : ''}`} />
                <span className="absolute inset-x-3 -bottom-px h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full"></span>
              </button>

              {/* Multi-Level Explore Dropdown Menu */}
              {exploreDropdownOpen && (
                <>
                  {/* Backdrop */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => {
                      setExploreDropdownOpen(false)
                      setHoveredCategory(null)
                    }}
                  />
                  <div 
                    className="absolute left-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 z-50 animate-in slide-in-from-top-2 duration-200 overflow-hidden"
                    onMouseLeave={() => {
                      setExploreDropdownOpen(false)
                      setHoveredCategory(null)
                    }}
                  >
                    <div className="flex min-h-[200px]">
                      {/* Main Categories - Left Side */}
                      <div className="w-64 bg-slate-50 border-r border-slate-200 ">
                        <div className="p-4">
                          <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wide mb-3">
                            Categories
                          </h3>
                          {categoriesLoading ? (
                            <div className="flex items-center justify-center py-8">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
                              <span className="ml-2 text-sm text-slate-600">Loading...</span>
                            </div>
                          ) : categoriesError ? (
                            <div className="text-center py-8 text-red-600 text-sm">
                              Error loading categories
                            </div>
                          ) : exploreCategories.length === 0 ? (
                            <div className="text-center py-8 text-slate-600 text-sm">
                              No categories available
                            </div>
                          ) : (
                            <div className="space-y-1">
                              {exploreCategories.map((category) => (
                                <button
                                  key={category.title}
                                  onMouseEnter={() => setHoveredCategory(category.title)}
                                  onClick={() => {
                                    router.push(`/courses/${category.title.toLowerCase().replace(/\s+/g, '-')}`)
                                    setExploreDropdownOpen(false)
                                    setHoveredCategory(null)
                                  }}
                                  className={`w-full flex items-center justify-between px-3 py-3 text-left text-sm rounded-lg transition-all duration-200 group ${
                                    hoveredCategory === category.title
                                      ? 'bg-emerald-100 text-emerald-700'
                                      : 'text-slate-700 hover:bg-white hover:text-slate-900'
                                  }`}
                                >
                                  <span className="font-medium">{category.title}</span>
                                  <ChevronRightIcon className={`w-4 h-4 transition-colors duration-200 ${
                                    hoveredCategory === category.title
                                      ? 'text-emerald-600'
                                      : 'text-slate-400 group-hover:text-slate-600'
                                  }`} />
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Subcategories - Right Side */}
                      <div className="w-60 bg-white h-min">
                        <div className="p-4">
                          {hoveredCategory ? (
                            <>
                              <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wide mb-3">
                                {hoveredCategory}
                              </h3>
                              <div className="space-y-1">
                                {exploreCategories
                                  .find(cat => cat.title === hoveredCategory)
                                  ?.subcategories?.map((sub: any) => (
                                    <button
                                      key={sub.name}
                                      onClick={() => {
                                        router.push(`/courses/${sub.slug}`)
                                        setExploreDropdownOpen(false)
                                        setHoveredCategory(null)
                                      }}
                                      className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200"
                                    >
                                      {sub.name}
                                    </button>
                                  )) || (
                                    <div className="px-3 py-4 text-sm text-slate-500">
                                      No subcategories available
                                    </div>
                                  )}
                              </div>
                            </>
                          ) : (
                            <div className="flex items-center justify-center h-full text-slate-500">
                              <div className="text-center">
                                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                  <ChevronRightIcon className="w-6 h-6 text-slate-400" />
                                </div>
                                 <p className="text-sm">Hover over a category to see options</p> 
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Bottom section */}
                        {/* <div className="border-t border-slate-100 p-4 bg-slate-50">
                          <button
                            onClick={() => {
                              router.push('/courses')
                              setExploreDropdownOpen(false)
                              setHoveredCategory(null)
                            }}
                            className="w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200"
                          >
                            View All Courses
                          </button>
                        </div> */}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </nav>

          {/* Search Bar - Desktop Only */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search courses, topics, members..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            {!isAuthenticated ? (
              <>
                {/* Unauthenticated buttons */}
                <button
                  onClick={() => router.push("/user/login")}
                  className="hidden sm:block text-slate-600 hover:text-slate-900 px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg hover:bg-slate-50"
                >
                  Sign In
                </button>
                <button
                  onClick={() => router.push("/user/signup")}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-5 py-2 rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                >
                  Join Now
                </button>
              </>
            ) : (
              <>
                {/* Notifications */}
                <button className="p-2 rounded-lg text-slate-600 hover:text-emerald-600 hover:bg-slate-50 transition-all duration-200 relative">
                  <BellIcon className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center">
                    <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                  </span>
                </button>

                {/* Profile dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center space-x-3 p-2 rounded-xl hover:bg-slate-50 transition-all duration-200 group border border-transparent hover:border-slate-200"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center overflow-hidden ring-2 ring-white shadow-sm">
                      {!isFetched || isLoading ? (
                        <div className="animate-pulse w-full h-full bg-slate-300 rounded-full" />
                      ) : !avatarUrl || avatarBroken ? (
                        <PersonIcon className="w-4 h-4 text-white" />
                      ) : (
                        <Image
                          src={avatarUrl}
                          alt="Profile"
                          width={36}
                          height={36}
                          className="w-full h-full object-cover"
                          onError={() => setAvatarBroken(true)}
                          priority
                        />
                      )}
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-medium text-slate-900 truncate max-w-32">
                        {user?.name || 'User'}
                      </div>
                      <div className="text-xs text-slate-500">
                        View profile
                      </div>
                    </div>
                    <ChevronDownIcon className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors duration-200" />
                  </button>

                  {/* Profile dropdown menu */}
                  {profileDropdownOpen && (
                    <>
                      {/* Backdrop */}
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setProfileDropdownOpen(false)}
                      />
                      <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
                        {/* User info header */}
                        <div className="relative bg-gradient-to-br from-emerald-50 to-teal-50 px-6 py-4 border-b border-slate-100">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center overflow-hidden ring-2 ring-white shadow-sm">
                              {!avatarUrl || avatarBroken ? (
                                <PersonIcon className="w-6 h-6 text-white" />
                              ) : (
                                <Image
                                  src={avatarUrl}
                                  alt="Profile"
                                  width={48}
                                  height={48}
                                  className="w-full h-full object-cover"
                                  onError={() => setAvatarBroken(true)}
                                />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-slate-900 truncate">
                                {user?.name || 'User'}
                              </p>
                              <p className="text-xs text-slate-600 truncate">
                                {user?.email}
                              </p>
                              <div className="flex items-center mt-1">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                                <span className="text-xs text-slate-500 ml-1">Online</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Menu items */}
                        <div className="py-2">
                          <button
                            onClick={() => {
                              router.push("/profile")
                              setProfileDropdownOpen(false)
                            }}
                            className="flex items-center w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition-colors duration-200 group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-emerald-100 flex items-center justify-center mr-3 transition-colors duration-200">
                              <PersonIcon className="w-4 h-4 text-slate-600 group-hover:text-emerald-600" />
                            </div>
                            <div>
                              <div className="font-medium">My Profile</div>
                              <div className="text-xs text-slate-500">View and edit profile</div>
                            </div>
                          </button>
                          
                          <button
                            onClick={() => {
                              router.push("/dashboard")
                              setProfileDropdownOpen(false)
                            }}
                            className="flex items-center w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition-colors duration-200 group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-emerald-100 flex items-center justify-center mr-3 transition-colors duration-200">
                              <DashboardIcon className="w-4 h-4 text-slate-600 group-hover:text-emerald-600" />
                            </div>
                            <div>
                              <div className="font-medium">Dashboard</div>
                              <div className="text-xs text-slate-500">Learning progress</div>
                            </div>
                          </button>
                          
                          <button
                            onClick={() => {
                              router.push("/settings")
                              setProfileDropdownOpen(false)
                            }}
                            className="flex items-center w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition-colors duration-200 group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-emerald-100 flex items-center justify-center mr-3 transition-colors duration-200">
                              <GearIcon className="w-4 h-4 text-slate-600 group-hover:text-emerald-600" />
                            </div>
                            <div>
                              <div className="font-medium">Settings</div>
                              <div className="text-xs text-slate-500">Account preferences</div>
                            </div>
                          </button>
                        </div>
                        
                        <div className="border-t border-slate-100 py-2">
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-red-50 group-hover:bg-red-100 flex items-center justify-center mr-3 transition-colors duration-200">
                              <ExitIcon className="w-4 h-4 text-red-600" />
                            </div>
                            <div>
                              <div className="font-medium">Sign Out</div>
                              <div className="text-xs text-red-400">End your session</div>
                            </div>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors duration-200"
              >
                {mobileMenuOpen ? (
                  <Cross1Icon className="w-5 h-5" />
                ) : (
                  <HamburgerMenuIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md">
            {/* Mobile Search */}
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
            
            {/* Mobile Menu Content */}
            <div className="py-2">
            {!mobileExploreOpen && !selectedMobileCategory ? (
                // Main Menu
                <div className="space-y-1 px-4">
                {/* Explore Categories */}
                <button
                    onClick={() => setMobileExploreOpen(true)}
                    className="w-full flex items-center justify-between px-4 py-4 text-left text-base font-medium text-slate-700 hover:text-emerald-600 hover:bg-slate-50 rounded-lg transition-all duration-200"
                >
                    <span>Explore Categories</span>
                    <ChevronRightIcon className="w-5 h-5 text-slate-400" />
                </button>
                
                {/* View All Courses */}
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
                // Categories List
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
                    <div className="text-center py-12 text-red-600">
                    Error loading categories
                    </div>
                ) : exploreCategories.length === 0 ? (
                    <div className="text-center py-12 text-slate-600">
                    No categories available
                    </div>
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
                            <div className="text-base font-medium text-slate-900 group-hover:text-emerald-700">
                                {category.title}
                            </div>
                            <div className="text-sm text-slate-500 mt-0.5">
                                {category.subcategories.length} specializations
                            </div>
                            </div>
                            <ChevronRightIcon className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors duration-200" />
                        </button>
                        </div>
                    ))}
                    </div>
                )}
                </div>
            ) : (
                // Subcategories List
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
                        <h3 className="text-lg font-semibold text-slate-900 truncate max-w-48">
                            {selectedMobileCategory}
                        </h3>
                        <div className="w-16"></div>
                        </div>
                        
                        <button
                        onClick={() => handleMobileNavigation(`/courses/${selectedMobileCategory?.toLowerCase().replace(/\s+/g, '-')}`)}
                        className="w-full px-4 py-4 mb-3 text-left bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg hover:from-emerald-100 hover:to-teal-100 transition-all duration-200"
                        >
                        <div className="text-base font-semibold text-emerald-700">
                            View All {selectedMobileCategory}
                        </div>
                        <div className="text-sm text-emerald-600 mt-0.5">
                            Browse all courses in this category
                        </div>
                        </button>
                        
                        <div className="space-y-1">
                        <h4 className="text-sm font-medium text-slate-600 uppercase tracking-wide px-2 py-2">
                            Specializations
                        </h4>
                        {selectedCategory?.subcategories?.map((sub: any) => (
                            <button
                            key={sub.name}
                            onClick={() => handleMobileNavigation(`/courses/${sub.slug}`)}
                            className="w-full text-left px-4 py-3 text-slate-700 hover:text-emerald-600 hover:bg-slate-50 rounded-lg transition-all duration-200"
                            >
                            <div className="text-base font-medium">{sub.name}</div>
                            </button>
                        )) || (
                            <div className="px-4 py-8 text-center text-slate-500">
                            No specializations available
                            </div>
                        )}
                        </div>
                    </>
                    )
                })()}
                </div>
            )}
            </div>
        </div>
        )}
      </div>
    </header>
  )
}