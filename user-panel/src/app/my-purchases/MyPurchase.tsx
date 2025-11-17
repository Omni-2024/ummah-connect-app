"use client"

import { useRouter } from "next/navigation"
import React, { useState } from "react"
import Navbar from "@/features/app/components/Navbar"
import NavbarMobile, { NavbarTitle } from "@/features/app/components/Navbar.mobile"
import Bottombar from "@/features/app/components/Bottombar"
import Button from "@/components/base/Button"
import IconButton from "@/components/base/IconButton"
import { ArrowLeftIcon } from "@radix-ui/react-icons"
import { UserRole } from "@/lib/constants"
import withAuth from "@/components/withAuth"
import Footer from "@/features/app/components/Footer"
import { useCurrentUser } from "@/lib/hooks/useUser"
import { useAuthState } from "@/features/auth/context/useAuthState"
import envs from "@/lib/env"
import { usePaymentsByUser } from "@/lib/hooks/usePayments"
import { generateSlug } from "@/lib/helpers/strings"
import { PurchaseCard } from "@/features/mypurchases/PurchaseCard"
import { PurchaseStats } from "@/features/mypurchases/PurchaseStats"
import { PurchaseFilterTabs } from "@/features/mypurchases/PurchaseFilterTabs"
import { PurchaseLoadingSkeleton } from "@/features/mypurchases/PurchaseLoadingSkeleton"

// Helper function to build avatar URL
export const buildAvatarUrl = (img?: string | null): string | null => {
  if (!img) return null
  if (/^https?:\/\//i.test(img)) return img
  const base = envs.imageBaseUrl
  return `${base}/${img}`
}

const MyPurchasesPage = () => {
  const router = useRouter()
  const { data: user } = useCurrentUser()
  const { logout } = useAuthState()
  const [selectedTab, setSelectedTab] = useState<"all" | "succeeded" | "pending" | "failed">("all")
  const [avatarBroken, setAvatarBroken] = useState(false)

  const avatarUrl = buildAvatarUrl(user?.profileImage)

  // Use React Query hook - it will only run when user?.id exists
  const { data: paymentsResponse, isLoading, error } = usePaymentsByUser(
    user?.id || "",
    100,
    0
  )

  const purchases = Array.isArray(paymentsResponse?.data)
    ? paymentsResponse.data
    : []

  const handleLogout = () => {
    logout()
    router.push("/user/login")
  }

  // Filter purchases based on selected tab
  const filteredPurchases = selectedTab === "all"
    ? purchases
    : purchases.filter((purchase) => purchase.status === selectedTab)

  const handleBack = () => {
    router.back()
  }

  const handleViewService = (serviceName: string) => {
    // Generate slug from service name only (backend handles lookup by slug)
    const slug = generateSlug(serviceName)
    router.push(`/service/${slug}`)
  }

  // Show loading state while fetching user or payments
  if (isLoading || !user) {
    return (
      <div className="min-h-screen w-full pb-16 lg:pb-0 bg-white">
        <Navbar />
        <NavbarMobile
          className="px-4"
          left={
            <div className="flex items-center gap-3">
              <IconButton onClick={handleBack}>
                <ArrowLeftIcon className="size-5" />
              </IconButton>
              <NavbarTitle title="My Purchases" size="md" />
            </div>
          }
        />
        <PurchaseLoadingSkeleton />
        <Bottombar
          user={user}
          avatarUrl={avatarUrl}
          avatarBroken={avatarBroken}
          setAvatarBroken={setAvatarBroken}
          handleLogout={handleLogout}
        />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen w-full pb-16 lg:pb-0 bg-white">
        <Navbar />
        <NavbarMobile
          className="px-4"
          left={
            <div className="flex items-center gap-3">
              <IconButton onClick={handleBack}>
                <ArrowLeftIcon className="size-5" />
              </IconButton>
              <NavbarTitle title="My Purchases" size="md" />
            </div>
          }
        />
        <div className="container px-4 py-8">
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-red-600 mb-2">Error</h3>
            <p className="text-gray-600 mb-6">Failed to load purchases. Please try again later.</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
        <Bottombar
          user={user}
          avatarUrl={avatarUrl}
          avatarBroken={avatarBroken}
          setAvatarBroken={setAvatarBroken}
          handleLogout={handleLogout}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full pb-16 lg:pb-0 bg-white">
      <Navbar />
      <NavbarMobile
        className="px-4"
        left={
          <div className="flex items-center gap-3">
            <IconButton onClick={handleBack}>
              <ArrowLeftIcon className="size-5" />
            </IconButton>
            <NavbarTitle title="My Purchases" size="md" />
          </div>
        }
      />

      <div className="container px-4 py-4 lg:px-20 lg:py-10">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">My Purchases</h1>
          <p className="text-gray-600">Manage your purchased services</p>
        </div>

        {/* Filter Tabs */}
        <PurchaseFilterTabs
          purchases={purchases}
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
        />

        {/* Purchases Grid */}
        {filteredPurchases.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Services found</h3>
            <Button onClick={() => router.push("/explore")}>
              Explore Services
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {filteredPurchases.map((purchase) => (
              <PurchaseCard
                key={purchase.paymentIntent}
                purchase={purchase}
                onViewService={handleViewService}
              />
            ))}
          </div>
        )}

        {/* Summary Stats */}
        <PurchaseStats purchases={purchases} />
      </div>

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

export default withAuth(MyPurchasesPage, [UserRole.USER])