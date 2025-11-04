"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { CheckCircledIcon, CrossCircledIcon, ArrowLeftIcon, EnvelopeClosedIcon } from "@radix-ui/react-icons"
import { verifyEmailFn } from "@/lib/endpoints/authenticationFns"
import Navbar from "@/features/app/components/Navbar"
import NavbarMobile, { NavbarTitle } from "@/features/app/components/Navbar.mobile"
import Bottombar from "@/features/app/components/Bottombar"
import Footer from "@/features/app/components/Footer"
import { useCurrentUser } from "@/lib/hooks/useUser"
import { useAuthState } from "@/features/auth/context/useAuthState"
import IconButton from "@/components/base/IconButton"
import envs from "@/lib/env"

export const buildAvatarUrl = (img?: string | null): string | null => {
  if (!img) return null
  if (/^https?:\/\//i.test(img)) return img
  const base = envs.imageBaseUrl
  return `${base}/${img}`
}

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isVerificationStarted, setVerificationStarted] = useState(false)
  const { data: currentUser, isLoading: isCurrentUserLoading } = useCurrentUser()
  const { logout } = useAuthState()
  const [avatarBroken, setAvatarBroken] = useState(false)

  const avatarUrl = buildAvatarUrl(currentUser?.profileImage)

  const handleLogout = () => {
    logout()
    router.push("/user/login")
  }

  // Mutation expects { token, email } object
  const {
    mutate: verifyEmail,
    isPending: isVerifyingEmail,
    isError: verifyEmailError,
    isSuccess: verifyEmailSuccess,
  } = useMutation({
    mutationFn: verifyEmailFn,
    onSuccess: (data) => {
      console.log("Email verified successfully:", data)
      router.push("/user/login")
    },
    onError: (err) => {
      console.error("Email verification failed:", err)
    },
  })

  useEffect(() => {
    const token = searchParams.get("token")

    if (token) {
      setVerificationStarted(true)
      verifyEmail(token)
    }
  }, [searchParams, verifyEmail])

  const getStatusContent = () => {
    if (!isVerificationStarted || isVerifyingEmail) {
      return {
        icon: <EnvelopeClosedIcon className="w-8 h-8 text-white" />,
        title: "Verifying your email...",
        description: "Please wait while we verify your email address.",
      }
    }

    if (verifyEmailError) {
      return {
        icon: <CrossCircledIcon className="w-8 h-8 text-white" />,
        title: "Verification failed",
        description:
          "The link may be expired or invalid. Please try signing up again or contact support.",
      }
    }

    if (verifyEmailSuccess) {
      return {
        icon: <CheckCircledIcon className="w-8 h-8 text-white" />,
        title: "Email verified successfully!",
        description:
          "Your email has been verified. Redirecting to login page...",
      }
    }

    return {
      icon: <EnvelopeClosedIcon className="w-8 h-8 text-white" />,
      title: "Verifying your email...",
      description: "Please wait while we confirm your email address.",
    }
  }

  const statusContent = getStatusContent()

  return (
    <div className="min-h-screen w-full pb-16 lg:pb-0 bg-white">
      <Navbar />
      <NavbarMobile
        className="px-4"
        left={
          <div className="flex items-center gap-3">
            <IconButton onClick={() => router.back()}>
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
            {/* Status Icon */}
            <div
              className={`mx-auto w-16 h-16 bg-primary-500 text-white hover:bg-primary-400 rounded-full flex items-center justify-center mb-6`}
            >
              {statusContent.icon}
            </div>

            {/* Content */}
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{statusContent.title}</h1>
            <p className="text-gray-600 leading-relaxed mb-8">{statusContent.description}</p>

            {/* Actions */}
            {!isVerifyingEmail && isVerificationStarted && verifyEmailError && (
              <div className="space-y-4">
                <button
                  onClick={() => router.push("/contact-support")}
                  className="w-full flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
                >
                  Contact Support
                </button>
                <button
                  onClick={() => router.push("/user/signup")}
                  className="w-full flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>

          {/* Help Section */}
          {!isVerifyingEmail && isVerificationStarted && verifyEmailError && (
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500 mb-2">Need help?</p>
              <button
                onClick={() => router.push("/contact-support")}
                className="text-sm font-medium"
              >
                Contact our support team
              </button>
            </div>
          )}
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