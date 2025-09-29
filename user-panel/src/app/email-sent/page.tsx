"use client"


import { EnvelopeClosedIcon, ArrowLeftIcon, ReloadIcon } from "@radix-ui/react-icons"
import { useRouter } from "next/navigation"
import { useForgotPasswordState } from "@/features/auth/context/useForgotPasswordState"
import {useCurrentUser} from "@/lib/hooks/useUser";
import BottomBar from "@/features/app/components/Bottombar";
import Footer from "@/features/app/components/Footer";

export default function EmailSentPage() {
  const router = useRouter()
  const { email } = useForgotPasswordState()
  const { data: currentUser, isLoading: isCurrentUserLoading } =
      useCurrentUser();

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
              <div className="h-6 w-6 rounded bg-gradient-to-br from-indigo-500 to-purple-600"></div>
              <span className="text-lg font-bold">Ummah Community</span>
            </div>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
            {/* Email Icon */}
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mb-6">
              <EnvelopeClosedIcon className="w-8 h-8 text-white" />
            </div>

            {/* Content */}
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Check your inbox</h1>

            <div className="space-y-4 mb-8">
              <p className="text-gray-600 leading-relaxed">
                We've sent a verification link to verify your email address.
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
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
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
            >
              Contact our support team
            </button>
          </div>
          <BottomBar/>
          <Footer/>
        </div>
      </main>
    </div>
  )
}
