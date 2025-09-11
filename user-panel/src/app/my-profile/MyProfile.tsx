"use client"

import React from "react"
import Bottombar from "@/features/app/components/Bottombar"
import Navbar from "@/features/app/components/Navbar"
import NavbarMobile, { NavbarTitle } from "@/features/app/components/Navbar.mobile"
import { useCurrentUser } from "@/lib/hooks/useUser"
import { LoadingSkeleton } from "@/features/myprofile/LoadingSkeleton"
import ProfileEditForm from "@/features/myprofile/ProfileEditForm"
import ChangePasswordForm from "@/features/myprofile/ChangePasswordForm"
import withAuth from "@/components/withAuth"
import { UserRole } from "@/lib/constants"
import { ArrowLeftIcon } from "@radix-ui/react-icons"
import { IconButton } from "@radix-ui/themes"
import { useRouter } from "next/navigation"

const MyProfile = () => {
  const { data: user, isFetched, isLoading: userLoading, refetch } = useCurrentUser()
  const router = useRouter();

  if (!isFetched || userLoading) {
    return (
      <>
        <Navbar />
        <NavbarMobile left={undefined} />
        <LoadingSkeleton />
      </>
    )
  }

  const handleBack = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-gray-50 sm:bg-white">
      <Navbar />
      <NavbarMobile
        className="px-4"
        left={
          <div className="flex items-center gap-3">
            <IconButton onClick={handleBack}>
              <ArrowLeftIcon className="size-5" />
            </IconButton>
            <NavbarTitle title="Edit Profile" size="md" />
          </div>
        }
      />
      <div className="bg-white border-b border-gray-200 hidden sm:block">
        <div className="max-w-4xl mx-auto px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
          <p className="text-gray-600">Update your Profile Information</p>
        </div>
      </div>


      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-0 sm:px-4 lg:px-8 py-0 sm:py-8">
        <div className="space-y-4 sm:space-y-6">
          {/* Profile Edit Form */}
          <div className="bg-white sm:rounded-xl sm:shadow-sm sm:border border-0 overflow-hidden">
            <ProfileEditForm user={user} refetch={refetch} />
          </div>

          {/* Change Password Form */}
          <div className="bg-white sm:rounded-xl sm:shadow-sm sm:border border-0 overflow-hidden">
            <ChangePasswordForm />
          </div>
        </div>
      </div>

      {/* Mobile Bottom Spacing */}
      <div className="h-10 sm:hidden bg-white"></div>
      <Bottombar />
    </div>
  )
}

export default withAuth(MyProfile, [UserRole.USER])
