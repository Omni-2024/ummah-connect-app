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

  // Fetch ALL services for RecommendedServicesSection
  const { data: servicesData, isLoading: servicesLoading, error: servicesError } = useServices({
    limit: 100, // Fetch more services to have a better pool for filtering
    offset: 0,
  })

  // Fetch user profile to get their interests
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

  // Get user's interests from their profile (or use empty array if not available)
  const userInterests = userProfile?.interests || []

  // Filter services based on user's interests
  // Match interests against specialtyId, professionId, or typeId
  const recommendedServices = React.useMemo(() => {
    if (!servicesData?.data) return []
    
    // If user has no interests, return empty
    if (!userInterests || userInterests.length === 0) {
      console.log('User has no interests set')
      return []
    }
    
    // Debug logs
    console.log('User interests from profile:', userInterests)
    console.log('Total services available:', servicesData.data.length)
    
    // Filter services that match user interests
    const filtered = servicesData.data.filter(service => {
      const matchesSpecialty = userInterests.includes(service.specialtyId)
      const matchesProfession = userInterests.includes(service.professionId)
      const matchesType = service.typeId && userInterests.includes(service.typeId)
      
      return matchesSpecialty || matchesProfession || matchesType
    })
    
    console.log('Services matching user interests:', filtered)
    console.log('Matching services count:', filtered.length)
    
    // If no matches, show all published services for testing
    if (filtered.length === 0) {
      console.warn('No services match user interests! Showing all published services.')
      return servicesData.data.filter(s => s.isPublished && !s.isArchived)
    }
    
    return filtered
  }, [servicesData, userInterests])

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
      <FeaturesSection />
      {isAuthenticated && (
        <RecommendedServicesSection
          services={recommendedServices}
          loading={servicesLoading}
          error={servicesError}
          router={router}
        />
      )}
      <IslamicValuesSection />
      <IslamicLearningPathsSection />
      <BottomBar />
      <Footer />
    </div>
  )
}