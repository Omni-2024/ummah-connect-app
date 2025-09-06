"use client"

import React from "react"
import Bottombar from "@/features/app/components/Bottombar"
import Navbar from "@/features/app/components/Navbar"
import NavbarMobile from "@/features/app/components/Navbar.mobile"
import { useCurrentUser } from "@/lib/hooks/useUser"
import { LoadingSkeleton } from "@/features/myprofile/LoadingSkeleton"
import ProfileEditForm from "@/features/myprofile/ProfileEditForm"
import ChangePasswordForm from "@/features/myprofile/ChangePasswordForm"
import withAuth from "@/components/withAuth"
import { UserRole } from "@/lib/constants"

interface ProfileEditProps {
  router?: {
    push: (path: string) => void
  }
}

const ProfileEdit = ({ router }: ProfileEditProps) => {
  const { data: user, isFetched, isLoading: userLoading, refetch } = useCurrentUser()

  if (!isFetched || userLoading) {
    return (
      <>
        <Navbar />
        <NavbarMobile left={undefined} />
        <LoadingSkeleton />
      </>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <NavbarMobile left={undefined} />
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
          <p className="text-gray-600">Update your Profile Information</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Edit Form */}
        <ProfileEditForm user={user} refetch={refetch} />

        {/* Change Password Form */}
        <div className="mt-6">
          <ChangePasswordForm />
        </div>
      </div>
      <Bottombar />
    </div>
  )
};
export default withAuth(ProfileEdit, [UserRole.USER]);
