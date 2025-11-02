"use client"

import { EnvelopeClosedIcon, ArrowLeftIcon, ReloadIcon } from "@radix-ui/react-icons"
import { useRouter } from "next/navigation"
import { useForgotPasswordState } from "@/features/auth/context/useForgotPasswordState"
import { useCurrentUser } from "@/lib/hooks/useUser"
import { useAuthState } from "@/features/auth/context/useAuthState"
import Navbar from "@/features/app/components/Navbar"
import NavbarMobile, { NavbarTitle } from "@/features/app/components/Navbar.mobile"
import Bottombar from "@/features/app/components/Bottombar"
import Footer from "@/features/app/components/Footer"
import IconButton from "@/components/base/IconButton"
import { useState } from "react"
import envs from "@/lib/env"

export const buildAvatarUrl = (img?: string | null): string | null => {
  if (!img) return null
  if (/^https?:\/\//i.test(img)) return img
  const base = envs.imageBaseUrl
  return `${base}/${img}`
}

export default function EmailSentPage() {
  const router = useRouter()
  const { email } = useForgotPasswordState()
  const { data: currentUser, isLoading: isCurrentUserLoading } = useCurrentUser()
  const { logout } = useAuthState()
  const [avatarBroken, setAvatarBroken] = useState(false)

  const avatarUrl = buildAvatarUrl(currentUser?.profileImage)

  const handleLogout = () => {
    logout()
    router.push("/user/login")
  }

  const handleBack = () => {
    router.back()
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
            <NavbarTitle title="Email Verification" size="md" />
          </div>
        }
      />

      {/* Main Content */}
      <main className="container px-4 py-4 lg:px-20 lg:py-10">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-8 text-center">
            {/* Email Icon */}
            <div className="mx-auto w-16 h-16 bg-primary-500 text-white hover:bg-primary-400 rounded-full flex items-center justify-center mb-6">
              <EnvelopeClosedIcon className="w-8 h-8 text-white" />
            </div>

            {/* Content */}
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Check your inbox</h1>

            <div className="space-y-4 mb-8">
              <p className="text-gray-600 leading-relaxed">
                We've sent a verification link to verify your email address.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-700">Verification email sent to:</p>
                <p className="font-semibold text-gray-900 break-all">{email || "your email address"}</p>
              </div>
              <p className="text-sm text-gray-500">
                Please click on the verification link in the email to complete your registration.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <button
                onClick={() => router.push("/user/signup")}
                className="w-full flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
              >
                <ReloadIcon className="w-4 h-4" />
                Sign up with different email
              </button>

              <div className="text-xs text-gray-500">
                Didn't receive the email? Check your spam folder or try again with a different email address.
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 mb-2">Need help?</p>
            <button
              onClick={() => router.push("/contact-support")}
              className="text-sm font-medium"
            >
              Contact our support team
            </button>
          </div>
        </div>
      </main>

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