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

export default function HomePage() {
  const { isAuthenticated } = useAuthState()
  const router = useRouter()
  
  // Use the same hook that ExploreDropDown uses!
  const { data: exploreCategories, isLoading: categoriesLoading, error: categoriesError } = useCategories()

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
                {/*<ComingSoonToolTip>*/}
                {/*  <IconButton size="sm" onClick={handleNotificationButton}>*/}
                {/*    <Notification color="black" className="text-dark-600" />*/}
                {/*  </IconButton>*/}
                {/*</ComingSoonToolTip>*/}

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
      {isAuthenticated && <RecommendedServicesSection router={router} />}
      {/* {isAuthenticated && <ContinueLearningSection />}  */}
      <IslamicValuesSection />
      <IslamicLearningPathsSection />
      {/* <SuccessStoriesSection /> */}
      <BottomBar />
      <Footer />
    </div>
  )
}