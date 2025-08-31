"use client"
import type React from "react"
import { useCallback, useMemo, useState } from "react"
import { useMutation } from "@tanstack/react-query"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  EnvelopeClosedIcon,
  LockClosedIcon,
  PersonIcon,
  EyeOpenIcon,
  EyeNoneIcon,
} from "@radix-ui/react-icons"
import { useRouter, useSearchParams } from "next/navigation"

import { generalUserSignUpFn } from "@/lib/endpoints/authenticationFns"
import { getErrorMessage } from "@/lib/helpers/errors"
import { Toast } from "@/components/base/Toast"
import { useGoogleLogin } from "@/lib/hooks/useGoogleLogin"
import { useForgotPasswordState } from "@/features/auth/context/useForgotPasswordState"

type Values = { name: string; email: string; password: string }
type Errors = Partial<Record<keyof Values, string>>
type Touched = Partial<Record<keyof Values, boolean>>

const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/

const validate = (v: Values): Errors => {
  const e: Errors = {}
  const name = v.name.trim()
  const email = v.email.trim()
  const pw = v.password.trim()

  if (!name) e.name = "Name is required"
  else if (name.length > 50) e.name = "Name is too long"

  if (!email) e.email = "Email is required"
  else if (!emailRegex.test(email)) e.email = "Invalid email address"
  else if (email.length > 50) e.email = "Email is too long"

  if (!pw) e.password = "Password is required"
  else if (pw.length < 5) e.password = "Password must be at least 5 characters"
  else if (pw.length > 30) e.password = "Password must be at most 30 characters"

  return e
}

export default function SignupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)

  // Read query params
  const methodParam = searchParams.get("method") ?? undefined
  const callbackParam = searchParams.get("_callback") ?? undefined
  const actionParam = searchParams.get("_action") ?? undefined

  const showEmailSignup = methodParam === "email"

  const buildQS = (method: "sso" | "email") => {
    const p = new URLSearchParams(searchParams.toString())
    p.set("method", method)
    if (callbackParam) p.set("_callback", callbackParam)
    if (actionParam) p.set("_action", actionParam)
    return p.toString()
  }

  const changeSignupMethod = (method: "sso" | "email") => {
    router.push(`/user/signup?${buildQS(method)}`)
  }

  const { setEmail } = useForgotPasswordState()
  const { googleLogin, googleLoginIsPending } = useGoogleLogin()

  const { isPending, mutate: generalUserSignUp } = useMutation({
    mutationFn: generalUserSignUpFn,
  })

  const [values, setValues] = useState<Values>({ name: "", email: "", password: "" })
  const [errors, setErrors] = useState<Errors>({})
  const [touched, setTouched] = useState<Touched>({})

  const setField = useCallback(
    (field: keyof Values, val: string) => {
      setValues((prev) => ({ ...prev, [field]: val }))
      if (touched[field]) setErrors(validate({ ...values, [field]: val }))
    },
    [touched, values],
  )

  const handleBlur = (field: keyof Values) => {
    setTouched((t) => ({ ...t, [field]: true }))
    setErrors(validate(values))
  }

  const isValid = useMemo(() => Object.keys(validate(values)).length === 0, [values])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const v = validate(values)
    setErrors(v)
    setTouched({ name: true, email: true, password: true })
    if (Object.keys(v).length > 0) return

    const { email, name, password } = values
    generalUserSignUp(
      { email, password, name },
      {
        onSuccess: () => {
          setEmail(email)
          router.push("/email-sent")
        },
        onError: (err: any) => {
          const message = getErrorMessage(err, "An error occurred!")
          Toast.error(message)
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
                <div className="h-6 w-6 rounded bg-gradient-to-br from-indigo-500 to-purple-600"></div>
                <span className="text-lg font-bold">Ummah Community</span>
              </div>
            </button>
            <div className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => {
                  const p = new URLSearchParams()
                  if (callbackParam) p.set("_callback", callbackParam)
                  if (actionParam) p.set("_action", actionParam)
                  const qs = p.toString()
                  router.push(`/user/login${qs ? `?${qs}` : ""}`)
                }}
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Sign in
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
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Create your account</h1>
              <p className="text-gray-600">Join the Ummah Community and start your journey</p>
            </div>

            {showEmailSignup ? (
              <form onSubmit={onSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <div className="relative">
                    <PersonIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={values.name}
                      onChange={(e) => setField("name", e.target.value)}
                      onBlur={() => handleBlur("name")}
                      placeholder="Your full name"
                      className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                        errors.name ? "border-red-400" : "border-gray-200"
                      }`}
                    />
                  </div>
                  {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <div className="relative">
                    <EnvelopeClosedIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={values.email}
                      onChange={(e) => setField("email", e.target.value)}
                      onBlur={() => handleBlur("email")}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <LockClosedIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={values.password}
                      onChange={(e) => setField("password", e.target.value)}
                      onBlur={() => handleBlur("password")}
                      placeholder="Create a secure password"
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

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isPending || !isValid}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  {isPending ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Get Started
                      <ArrowRightIcon className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => changeSignupMethod("sso")}
                    className="text-sm text-gray-500 hover:text-gray-700 underline"
                  >
                    Or continue with social signup
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <button
                  onClick={() => changeSignupMethod("email")}
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
