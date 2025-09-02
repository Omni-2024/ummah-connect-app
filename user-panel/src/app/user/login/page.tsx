"use client"

import React, { useState, type ChangeEvent, type FormEvent } from "react"
import { useMutation } from "@tanstack/react-query"
import { userSignInFn } from "@/lib/endpoints/authenticationFns"
import { useRouter, useSearchParams } from "next/navigation"
import { login } from "@/features/auth/context/AuthState"
import { getErrorMessage } from "@/lib/helpers/errors"
import { Toast } from "@/components/base/Toast"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  EnvelopeClosedIcon,
  LockClosedIcon,
  EyeOpenIcon,
  EyeNoneIcon,
} from "@radix-ui/react-icons"
import { useGoogleLogin } from "@/lib/hooks/useGoogleLogin"
import Image from "next/image";
import {NAV_LOGO_SRC} from "@/lib/constants";

interface FormState {
  email: string
  password: string
}

interface FormErrors {
  email?: string
  password?: string
  form?: string
}

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [form, setForm] = useState<FormState>({ email: "", password: "" })
  const [errors, setErrors] = useState<FormErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [loginMethod, setLoginMethod] = useState<"email" | "sso">("sso")

  const callbackParam = searchParams.get("_callback") ?? undefined
  const actionParam = searchParams.get("_action") ?? undefined

  const { googleLogin, googleLoginIsPending } = useGoogleLogin()

  const { isPending, mutate: userSignIn } = useMutation({
    mutationFn: userSignInFn,
  })

  const validate = (): FormErrors => {
    const e: FormErrors = {}
    if (!form.email.trim()) e.email = "Email is required"
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Please enter a valid email"
    if (!form.password) e.password = "Password is required"
    else if (form.password.length < 5) e.password = "Password must be at least 5 characters"
    return e
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }))
    if (errors[e.target.name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: undefined }))
    }
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const eobj = validate()
    setErrors(eobj)
    if (Object.keys(eobj).length > 0) return

    userSignIn(
      { email: form.email, password: form.password },
      {
        onSuccess: (response: any) => {
          login(response.token, response.refreshToken, response.role, response.id, response.isFirstLogin)

          if (response.isFirstLogin) {
            router.push("/onboarding")
          } else {
            router.push("/")
          }
        },
        onError: (err: any) => {
          const message = getErrorMessage(err, "Invalid credentials. Please try again.")
          Toast.error(message)
          setErrors({ form: message })
        },
      },
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push("/")}
              className="flex items-center space-x-3 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <div className="flex items-center space-x-2">
                <Image src={NAV_LOGO_SRC} alt="ummah-comunity-logo" width={150}  height={50} priority/>
              </div>
            </button>
            <div className="text-sm text-gray-600">
              New to Ummah Community?{" "}
              <button
                onClick={() => {
                  const p = new URLSearchParams()
                  if (callbackParam) p.set("_callback", callbackParam)
                  if (actionParam) p.set("_action", actionParam)
                  const qs = p.toString()
                  router.push(`/user/signup${qs ? `?${qs}` : ""}`)
                }}
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Create account
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h1>
              <p className="text-gray-600">Sign in to your Ummah Community account</p>
            </div>

            {loginMethod === "email" ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <div className="relative">
                    <EnvelopeClosedIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                        errors.email ? "border-red-400" : "border-gray-200"
                      }`}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <button
                      type="button"
                      onClick={() => router.push("/forgot-password")}
                      className="text-xs text-indigo-600 hover:text-indigo-700"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <LockClosedIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Your password"
                      className={`w-full pl-11 pr-11 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                        errors.password ? "border-red-400" : "border-gray-200"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeNoneIcon className="w-5 h-5" /> : <EyeOpenIcon className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
                </div>

                {/* Error */}
                {errors.form && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-600">{errors.form}</p>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  {isPending ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Sign In
                      <ArrowRightIcon className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setLoginMethod("sso")}
                    className="text-sm text-gray-500 hover:text-gray-700 underline"
                  >
                    Or continue with social login
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <button
                  onClick={() => setLoginMethod("email")}
                  className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 rounded-xl py-3 px-4 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
                >
                  <EnvelopeClosedIcon className="w-5 h-5 text-gray-500" />
                  <span className="font-medium text-gray-700">Continue with Email</span>
                </button>

                <button
                  onClick={() => googleLogin()}
                  disabled={googleLoginIsPending}
                  className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 rounded-xl py-3 px-4 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="font-medium text-gray-700">
                    {googleLoginIsPending ? "Connecting..." : "Continue with Google"}
                  </span>
                </button>

                <div className="flex items-center gap-4 my-6">
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <span className="text-sm text-gray-500 px-2">OR</span>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
