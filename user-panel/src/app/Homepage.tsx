"use client"

import React, { useState } from "react"
import { useAuthState } from "@/features/auth/context/useAuthState"
import { useRouter } from "next/navigation"
import Navbar from "../features/app/components/Navbar"
import Link from "next/link"
import NavbarMobile, { NavbarTitle } from "@/features/app/components/Navbar.mobile"
import { useAppState } from "@/features/app/context/useAppState"
import { NAV_LOGO_SRC } from "@/lib/constants"
import Bottombar from "@/features/app/components/Bottombar"
import ProfileMenuButton from "@/features/app/components/ProfileMenuButton"
import HeroSection from "@/features/home/HeroSection"
import FeaturesSection from "@/features/home/FeaturesSection"
import IslamicLearningPathsSection from "@/features/home/IslamicLearningPathsSection"
import IslamicValuesSection from "@/features/home/IslamicValuesSection"
import RecommendedServicesSection from "@/features/home/RecommendedServicesSection"
import NewlyAddedServicesSection from "@/features/home/NewlyAddedServicesSection"
import TrendingServicesSection from "@/features/home/TrendingServicesSection"
import RecentlySearchedServicesSection from "@/features/home/RecentlySearchedServicesSection"
import Footer from "@/features/app/components/Footer"
import PopularServicesSection from "@/features/home/PopularServicesSection"
import { useCategories } from "@/lib/hooks/useCategories"
import { useServices } from "@/lib/hooks/useServices"
import { useCurrentUser } from "@/lib/hooks/useUser"
import envs from "@/lib/env"
import Button from "@/components/base/Button"
import { ArrowRightIcon } from "@radix-ui/react-icons"
import { buildAvatarUrl } from "@/lib/buildAvatarUrl";


export default function HomePage() {
  const { isAuthenticated, id: userId, logout } = useAuthState()
  const router = useRouter()
  const [avatarBroken, setAvatarBroken] = useState(false)

  // Fetch categories for PopularServicesSection
  const { data: exploreCategories, isLoading: categoriesLoading, error: categoriesError } = useCategories()

  // Fetch ALL services for sections
  const { data: servicesData, isLoading: servicesLoading, error: servicesError } = useServices({
    limit: 100,
    offset: 0,
  })

  // Fetch user profile to get their profile image and designations
  const { data: user } = useCurrentUser()

  const {
    setShowNavDrawer,
    setShowNotificationsModal,
  } = useAppState()

  const avatarUrl = buildAvatarUrl(user?.profileImage)

  const handleNotificationButton = () => {
    setShowNotificationsModal(true)
  }

  const handleShowNavDrawer = () => {
    setShowNavDrawer(true)
  }

  const handleLogout = () => {
    logout()
    router.push("/user/login")
  }

  // Get user's designations from their profile
  const userDesignations = user?.designations || []

  // Filter services based on user's designations for RecommendedServicesSection
  const recommendedServices = React.useMemo(() => {
    if (!servicesData?.data) return []

    if (!userDesignations || userDesignations.length === 0) {
      console.log('User has no designations set')
      return []
    }

    console.log('User designations from profile:', userDesignations)
    console.log('Total services available:', servicesData.data.length)

    const filtered = servicesData.data.filter(service => {
      return userDesignations.includes(service.professionId)
    })

    console.log('Services matching user designations:', filtered)
    console.log('Matching services count:', filtered.length)

    if (filtered.length === 0) {
      console.warn('No services match user designations! Showing all published services.')
      return servicesData.data.filter(s => s.isPublished && !s.isArchived)
    }

    return filtered
  }, [servicesData, userDesignations])

  // Sort services by createdAt for NewlyAddedServicesSection
  const newlyAddedServices = React.useMemo(() => {
    if (!servicesData?.data) return []

    return [...servicesData.data]
      .filter(s => s.isPublished && !s.isArchived)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10) // Limit to 10 services for performance
  }, [servicesData])

  // Sort services by enrollmentCount for TrendingServicesSection
  const trendingServices = React.useMemo(() => {
    if (!servicesData?.data) return []

    return [...servicesData.data]
      .filter(s => s.isPublished && !s.isArchived)
      .sort((a, b) => Number(b.enrollmentCount) - Number(a.enrollmentCount))
      .slice(0, 10) // Limit to 10 services for performance
  }, [servicesData])

  // Get all published services for recently viewed section
  const allServices = React.useMemo(() => {
    if (!servicesData?.data) return []
    return servicesData.data.filter(s => s.isPublished && !s.isArchived)
  }, [servicesData])

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <NavbarMobile
        className="px-4 bg-white border-b border-gray-100 sticky top-0 z-40"
        left={
          <Link href="/" className="flex items-center">
            <img
              alt="Ummah Logo"
              src={NAV_LOGO_SRC}
              className="h-8 w-auto cursor-pointer object-contain"
            />
          </Link>
        }
        right={
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Link href="/start-selling">
                <Button variant="unstyled" className="text-sm font-medium h-9 pr-0">
                  Become a Seller
                </Button>
              </Link>) : (
              <>
                <Link href="/start-selling">
                  <Button variant="unstyled" className="text-sm font-medium h-9 ">
                    Become a Seller
                  </Button>
                </Link>
                <Link href="/user/login">
                  <Button variant="primary" size="sm" className="text-sm font-medium h-9">
                    Login
                  </Button>
                </Link>
              </>
            )}
          </div>
        }
      />

      <HeroSection isAuthenticated={isAuthenticated} router={router} />
      <PopularServicesSection
        exploreCategories={exploreCategories || []}
        categoriesLoading={categoriesLoading}
        categoriesError={categoriesError}
      />
      <RecentlySearchedServicesSection
        // router={router} 
        allServices={allServices}
      />
      <NewlyAddedServicesSection
        services={newlyAddedServices}
        loading={servicesLoading}
        error={servicesError}
        router={router}
      />
      <TrendingServicesSection
        services={trendingServices}
        loading={servicesLoading}
        error={servicesError}
      // router={router}
      />
      {isAuthenticated && (
        <RecommendedServicesSection
          services={recommendedServices}
          loading={servicesLoading}
          error={servicesError}
        // router={router}
        />
      )}
      <FeaturesSection />
      <IslamicValuesSection />
      <IslamicLearningPathsSection />
      <Bottombar
        user={user}
        avatarUrl={avatarUrl}
        avatarBroken={avatarBroken}
        setAvatarBroken={setAvatarBroken}
        handleLogout={handleLogout}
      />
      <Footer />
    </div>
  )
}