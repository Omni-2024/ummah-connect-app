"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { useCurrentUser, useGeneralUser } from "@/lib/hooks/useUser"
import { useProfession } from "@/lib/hooks/useProfessions"
import { useSpecialists } from "@/lib/hooks/useSpecialists"
import { useServicesByEducator } from "@/lib/hooks/useServices"
import { useReviewByProvider } from "@/lib/hooks/useReview"
import Navbar, { buildAvatarUrl } from "@/features/app/components/Navbar"
import NavbarMobile, { NavbarTitle } from "@/features/app/components/Navbar.mobile"
import Bottombar from "@/features/app/components/Bottombar"
import { Card } from "@/components/base/Card"
import Button from "@/components/base/Button"
import IconButton from "@/components/base/IconButton"
import {
  ArrowLeftIcon,
  Share1Icon,
} from "@radix-ui/react-icons"
import { useChat } from "@/components/getStream/chat/ChatContextProvider"
import ProviderProfileSkeleton from "./ProviderProfileSkeleton"
import ProviderHeader from "./ProviderHeader"
import ProfileTabs from "./ProfileTabs"
import OverviewSection from "./OverviewSection"
import ServicesSection from "./ServicesSection"
import ReviewsSection from "./ReviewsSection"
import Sidebar from "./Sidebar"
import Footer from "@/features/app/components/Footer"
import { useAuthState } from "@/features/auth/context/useAuthState"

interface ProviderProfilePageProps {
  providerId: string
}

export default function ProviderProfilePage({ providerId }: ProviderProfilePageProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [pageLimit, setPageLimit] = useState(4)
  const [pageOffset, setPageOffset] = useState(0)
  const [starFilter, setStarFilter] = useState<number[]>([])
  const [avatarBroken, setAvatarBroken] = useState(false)
  const { logout } = useAuthState()
  const { data: currentUser } = useCurrentUser()

  const avatarUrl = buildAvatarUrl(currentUser?.profileImage)

  const {
    data: reviewsData,
    isLoading: isReviewLoading,
    isError: isReviewError,
  } = useReviewByProvider({
    providerId,
    stars: 0,
    limit: pageLimit,
    offset: pageOffset,
  })

  const { data: educator, isLoading, error } = useGeneralUser(providerId)
  const { data: designationData } = useProfession(educator?.designations?.[0] || "")
  const { data: specialistsData } = useSpecialists(educator?.designations?.[0] || "")
  const { id } = useAuthState()
  const { setUserId } = useChat()

  const { data: services, isLoading: servicesLoading } = useServicesByEducator({
    limit: 10,
    provider: providerId,
    userId: id,
  })

  const handleLogout = () => {
    logout()
    router.push("/user/login")
  }

  const handleBack = () => {
    router.back()
  }

  const handleContact = () => {
    setUserId(providerId)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${educator?.name} - Islamic Service Provider`,
        text: `Check out ${educator?.name}'s profile`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const getDesignationDisplay = () => {
    if (designationData?.name) {
      return designationData.name
    }
    return educator?.designations?.[0] || "Service Provider"
  }

  const getInterestsDisplay = () => {
    if (!educator?.interests || educator.interests.length === 0) {
      return []
    }

    if (specialistsData) {
      return educator.interests
        .map((interestId) => {
          const specialist = specialistsData.find((s) => s.id === interestId)
          return specialist ? { id: interestId, name: specialist.name } : null
        })
        .filter((item) => item !== null)
    }

    return educator.interests.map((id) => ({ id, name: id }))
  }

  const getCleanedLanguages = (languages: string[]) => {
    if (!languages || languages.length === 0) {
      return []
    }
    return languages.map((lang) => lang.trim()).filter((lang) => lang.length > 0)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-gray-50 pb-16 lg:pb-0">
        <Navbar />
        <NavbarMobile
          className="px-4"
          left={
            <div className="flex items-center gap-3">
              <IconButton onClick={handleBack}>
                <ArrowLeftIcon className="size-5" />
              </IconButton>
              <NavbarTitle title="Loading..." size="md" />
            </div>
          }
        />
        <ProviderProfileSkeleton />
        <Bottombar
          user={currentUser}
          avatarUrl={avatarUrl}
          avatarBroken={avatarBroken}
          setAvatarBroken={setAvatarBroken}
          handleLogout={handleLogout}
        />
      </div>
    )
  }

  if (error || !educator) {
    return (
      <div className="min-h-screen w-full bg-gray-50 pb-16 lg:pb-0">
        <Navbar />
        <NavbarMobile
          className="px-4"
          left={
            <div className="flex items-center gap-3">
              <IconButton onClick={handleBack}>
                <ArrowLeftIcon className="size-5" />
              </IconButton>
              <NavbarTitle title="Error" size="md" />
            </div>
          }
        />
        <div className="container px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Service Provider Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The service provider you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => router.push("/explore")}>
              Browse Services
            </Button>
          </div>
        </div>
        <Bottombar
          user={currentUser}
          avatarUrl={avatarUrl}
          avatarBroken={avatarBroken}
          setAvatarBroken={setAvatarBroken}
          handleLogout={handleLogout}
        />
      </div>
    )
  }

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "services", label: "Services" },
    { id: "reviews", label: "Reviews" },
  ]

  const cleanedLanguages = getCleanedLanguages(educator.languages)

  return (
    <div className="min-h-screen w-full bg-gray-50 pb-16 lg:pb-0">
      <Navbar />
      <NavbarMobile
        className="px-4"
        left={
          <div className="flex items-center gap-3">
            <IconButton onClick={handleBack}>
              <ArrowLeftIcon className="size-5" />
            </IconButton>
            <NavbarTitle title="Service Provider" size="md" />
          </div>
        }
        right={
          <IconButton onClick={handleShare}>
            <Share1Icon className="size-5" />
          </IconButton>
        }
      />

      <div className="container px-4 py-6 lg:px-20 lg:py-10 max-w-7xl">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <ProviderHeader
              educator={educator}
              getDesignationDisplay={getDesignationDisplay}
              buildAvatarUrl={buildAvatarUrl}
            />
            <ProfileTabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
            {activeTab === "overview" && (
              <OverviewSection
                educator={educator}
                getInterestsDisplay={getInterestsDisplay}
                cleanedLanguages={cleanedLanguages}
              />
            )}
            {activeTab === "services" && (
              <ServicesSection
                services={services}
                servicesLoading={servicesLoading}
                router={router}
                buildAvatarUrl={buildAvatarUrl}
              />
            )}
            {activeTab === "reviews" && (
              <ReviewsSection
                reviewsData={reviewsData}
                isReviewLoading={isReviewLoading}
                isReviewError={isReviewError}
                starFilter={starFilter}
                setStarFilter={setStarFilter}
                pageLimit={pageLimit}
                pageOffset={pageOffset}
                setPageOffset={setPageOffset}
                buildAvatarUrl={buildAvatarUrl}
              />
            )}
          </div>
          <Sidebar
            educator={educator}
            handleContact={handleContact}
          />
        </div>
      </div>
      <Bottombar
        user={currentUser}
        avatarUrl={avatarUrl}
        avatarBroken={avatarBroken}
        setAvatarBroken={setAvatarBroken}
        handleLogout={handleLogout}
      />
      <Footer />
    </div>
  )
}