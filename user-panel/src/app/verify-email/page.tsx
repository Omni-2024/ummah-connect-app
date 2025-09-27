"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { CheckCircledIcon, CrossCircledIcon, ArrowLeftIcon } from "@radix-ui/react-icons"
import { verifyEmailFn } from "@/lib/endpoints/authenticationFns"
import Footer from "@/features/app/components/Footer"

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isVerificationStarted, setVerificationStarted] = useState(false)

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
        icon: <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />,
        title: "Verifying your email...",
        description: "Please wait while we verify your email address.",
        bgColor: "from-indigo-500 to-purple-600",
      }
    }

    if (verifyEmailError) {
      return {
        icon: <CrossCircledIcon className="w-8 h-8 text-white" />,
        title: "Verification failed",
        description:
          "The link may be expired or invalid. Please try signing up again or contact support.",
        bgColor: "from-red-500 to-red-600",
      }
    }

    if (verifyEmailSuccess) {
      return {
        icon: <CheckCircledIcon className="w-8 h-8 text-white" />,
        title: "Email verified successfully!",
        description:
          "Your email has been verified. Redirecting to login page...",
        bgColor: "from-green-500 to-green-600",
      }
    }

    return {
      icon: <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />,
      title: "Verifying your emaill...",
      description: "Please wait while we confirm your email address.",
      bgColor: "from-indigo-500 to-purple-600",
    }
  }

  const statusContent = getStatusContent()

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <button
            onClick={() => router.push("/")}
            className="flex items-center space-x-3 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 rounded bg-gradient-to-br from-indigo-500 to-purple-600" />
              <span className="text-lg font-bold">Ummah Community</span>
            </div>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
            {/* Status Icon */}
            <div
              className={`mx-auto w-16 h-16 bg-gradient-to-br ${statusContent.bgColor} rounded-full flex items-center justify-center mb-6`}
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
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                >
                  Contact Support
                </button>
                <button
                  onClick={() => router.push("/user/signup")}
                  className="w-full border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer/>
    </div>
  )
}
