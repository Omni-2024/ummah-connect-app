"use client"

import React, { useState, useEffect, useMemo } from "react"
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
import Logo from "../../../app/header/subcomponents/Logo"
import Navigation from "../../../app/header/subcomponents/Navigation"
import SearchBar from "../../../app/header/subcomponents/SearchBar"
import AuthButtons from "../../../app/header/subcomponents/AuthButtons"
import ProfileDropdown from "../../../app/header/subcomponents/ProfileDropdown"
import MobileMenu from "../../../app/header/subcomponents/MobileMenu"
import NavSearchbar from "@/features/explore/component/search/NavSearchbar";
import { CategoryData } from "@/types";

export const buildAvatarUrl = (img?: string | null) => {
  if (!img) return null;
  if (/^https?:\/\//i.test(img)) return img;
  const base = envs.imageBaseUrl;
  return `${base}/${img}`;
};

type NavbarProps = {
  clearPage?: () => void;
};

export default function Navbar(props: NavbarProps) {
  const { isAuthenticated, logout } = useAuthState()
  const router = useRouter()
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [exploreDropdownOpen, setExploreDropdownOpen] = useState(false)
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const { data: user, isFetched, isLoading } = useCurrentUser()
  const [avatarBroken, setAvatarBroken] = useState(false)



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

  const exploreCategoriesForNav: CategoryData[] = useMemo(
    () => (categories && !categoriesError ? categories : []),
    [categories, categoriesError]
  );


  return (
    <header className="hidden lg:block sticky h-20 top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm pt-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Logo logoSrc={NAV_LOGO_SRC} router={router} />
          <Navigation
            exploreDropdownOpen={exploreDropdownOpen}
            setExploreDropdownOpen={setExploreDropdownOpen}
            hoveredCategory={hoveredCategory}
            setHoveredCategory={setHoveredCategory}
            exploreCategories={exploreCategoriesForNav}
            categoriesLoading={categoriesLoading}
            categoriesError={categoriesError}
          />
          <NavSearchbar onSearch={props.clearPage} />
          {/*<SearchBar />*/}
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
          </div>
        </div>
      </div>
    </header>
  )
}