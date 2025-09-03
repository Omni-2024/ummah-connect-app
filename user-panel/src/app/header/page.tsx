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
import Logo from "./subcomponents/Logo"
import Navigation from "./subcomponents/Navigation"
import SearchBar from "./subcomponents/SearchBar"
import AuthButtons from "./subcomponents/AuthButtons"
import ProfileDropdown from "./subcomponents/ProfileDropdown"
import MobileMenu from "./subcomponents/MobileMenu"

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
          <Logo logoSrc={NAV_LOGO_SRC} router={router} />
          <Navigation 
            exploreDropdownOpen={exploreDropdownOpen} 
            setExploreDropdownOpen={setExploreDropdownOpen} 
            hoveredCategory={hoveredCategory} 
            setHoveredCategory={setHoveredCategory} 
            exploreCategories={exploreCategories} 
            router={router} 
            categoriesLoading={categoriesLoading} 
            categoriesError={categoriesError}
          />
          <SearchBar />
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <button className="p-2 rounded-lg text-slate-600 hover:text-emerald-600 hover:bg-slate-50 transition-all duration-200 relative">
                  <BellIcon className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center">
                    <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                  </span>
                </button>
                <ProfileDropdown 
                  profileDropdownOpen={profileDropdownOpen} 
                  setProfileDropdownOpen={setProfileDropdownOpen} 
                  user={user} 
                  avatarUrl={avatarUrl} 
                  avatarBroken={avatarBroken} 
                  setAvatarBroken={setAvatarBroken} 
                  isFetched={isFetched} 
                  isLoading={isLoading} 
                  router={router} 
                  handleLogout={handleLogout}
                />
              </>
            ) : (
              <AuthButtons router={router} />
            )}
            <div className="lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors duration-200"
              >
                {mobileMenuOpen ? <Cross1Icon className="w-5 h-5" /> : <HamburgerMenuIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
        {mobileMenuOpen && <MobileMenu 
          mobileExploreOpen={mobileExploreOpen} 
          setMobileExploreOpen={setMobileExploreOpen} 
          selectedMobileCategory={selectedMobileCategory} 
          setSelectedMobileCategory={setSelectedMobileCategory} 
          exploreCategories={exploreCategories} 
          categoriesLoading={categoriesLoading} 
          categoriesError={categoriesError} 
          handleMobileNavigation={handleMobileNavigation} 
          router={router} 
          isAuthenticated={isAuthenticated}
        />}
      </div>
    </header>
  )
}