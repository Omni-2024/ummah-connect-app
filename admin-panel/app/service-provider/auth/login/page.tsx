"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ServiceProviderLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      if (searchParams.get("pending") === "true") {
        setSuccessMessage(
          "Application submitted successfully! Your account is pending admin approval. You will receive an email notification once approved.",
        )
      } else {
        setSuccessMessage("Registration successful! Please log in with your credentials.")
      }
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccessMessage("")

    // try {
    //   // const result = await login(formData.email, formData.password)
    //   if (result.success) {
    //     router.push("/service-provider/dashboard")
    //   } else {
    //     setError(result.error || "Login failed")
    //   }
    // } catch (err) {
    //   setError("An unexpected error occurred")
    // } finally {
    //   setLoading(false)
    // }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">IC</span>
            </div>
            <span className="text-xl font-bold text-foreground">Islamic Community</span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Service Provider Login</h1>
          <p className="text-muted-foreground mt-2">Sign in to manage your services and connect with clients</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Enter your credentials to access your provider dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {successMessage && (
                <Alert className="border-amber-200 bg-amber-50">
                  <AlertDescription className="text-amber-800">{successMessage}</AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="text-xs text-muted-foreground bg-blue-50 border border-blue-200 p-3 rounded-md">
                <strong>ℹ️ Note:</strong> Only approved service providers can access the dashboard. If you just
                registered, please wait for admin approval.
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-4">
              <Link href="/service-provider/auth/forgot-password" className="text-sm text-primary hover:underline">
                Forgot your password?
              </Link>

              <div className="text-sm text-muted-foreground">
                {"Don't have an account? "}
                <Link href="/service-provider/auth/register" className="text-primary hover:underline">
                  Register as Service Provider
                </Link>
              </div>

              <div className="text-sm text-muted-foreground">
                Looking for services?{" "}
                <Link href="/user/auth/login" className="text-primary hover:underline">
                  Sign in as User
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
