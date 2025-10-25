"use client"

import React from "react"
import { useAuthState } from "@/features/auth/context/useAuthState"
import { useRouter } from "next/navigation"
import Navbar from "../features/app/components/Navbar"
import IconButton from "@/components/base/IconButton"
import Link from "next/link"
import NavbarMobile from "@/features/app/components/Navbar.mobile"
import { useAppState } from "@/features/app/context/useAppState"
import { HambergerMenu } from "iconsax-react"
import { NAV_LOGO_SRC } from "@/lib/constants"
import NavDrawerMobile from "@/features/app/components/NavDrawer.mobile"
import NotLoggedInNavModal from "@/features/app/components/NotLoggedInNavModal.mobile"
import BottomBar from "@/features/app/components/Bottombar"
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
import { useGeneralUser } from "@/lib/hooks/useUser"

export default function HomePage() {
  const { isAuthenticated, id: userId } = useAuthState()
  const router = useRouter()

  // Fetch categories for PopularServicesSection
  const { data: exploreCategories, isLoading: categoriesLoading, error: categoriesError } = useCategories()

  // Fetch ALL services for sections
  const { data: servicesData, isLoading: servicesLoading, error: servicesError } = useServices({
    limit: 100,
    offset: 0,
  })

  // Fetch user profile to get their designations
  const { data: userProfile } = useGeneralUser(userId)

  const {
    setShowNavDrawer,
    setShowNotificationsModal,
    setShowNotLoggedInNavModal,
  } = useAppState()

  const handleNotificationButton = () => {
    setShowNotificationsModal(true)
  }

  const handleShowNavDrawer = () => {
    setShowNavDrawer(true)
  }

  const handleHamBurgerMenu = () => {
    setShowNotLoggedInNavModal(true)
  }

  // Get user's designations from their profile
  const userDesignations = userProfile?.designations || []

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

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <NavbarMobile
        left={
          <Link href="/">
            <img
              alt="Ummah Logo"
              src={NAV_LOGO_SRC}
              className="w-20 cursor-pointer object-contain"
            />
          </Link>
        }
        right={
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <ProfileMenuButton onClick={handleShowNavDrawer} />
              </>
            ) : (
              <IconButton size="lg" onClick={handleHamBurgerMenu}>
                <HambergerMenu className="text-dark-600" />
              </IconButton>
            )}
          </div>
        }
      />

      <NavDrawerMobile />
      <NotLoggedInNavModal />

      <HeroSection isAuthenticated={isAuthenticated} router={router} />
      <PopularServicesSection
        exploreCategories={exploreCategories || []}
        categoriesLoading={categoriesLoading}
        categoriesError={categoriesError}
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
        router={router}
      />
      {isAuthenticated && (
        <RecommendedServicesSection
          services={recommendedServices}
          loading={servicesLoading}
          error={servicesError}
          router={router}
        />
      )}
      <RecentlySearchedServicesSection router={router} />
      <FeaturesSection />
      <IslamicValuesSection />
      <IslamicLearningPathsSection />
      <BottomBar />
      <Footer />
    </div>
  )
}