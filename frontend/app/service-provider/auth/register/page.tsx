"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useProviderAuth } from "@/hooks/useAuth"

// Mock categories - in real app, these would come from API
const SERVICE_CATEGORIES = [
  { id: "education", name: "Islamic Education" },
  { id: "events", name: "Event Planning" },
  { id: "food", name: "Halal Food & Catering" },
  { id: "counseling", name: "Islamic Counseling" },
  { id: "construction", name: "Construction & Renovation" },
  { id: "healthcare", name: "Healthcare Services" },
  { id: "finance", name: "Islamic Finance" },
  { id: "childcare", name: "Childcare & Babysitting" },
  { id: "transportation", name: "Transportation" },
  { id: "other", name: "Other Services" },
]

export default function ServiceProviderRegisterPage() {
  const router = useRouter()
  const { register } = useProviderAuth()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    category: "",
    description: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long")
      setLoading(false)
      return
    }

    if (!formData.category) {
      setError("Please select a service category")
      setLoading(false)
      return
    }

    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        category: formData.category,
        description: formData.description,
      })

      if (result.success) {
        setError("")
        // Reset form
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          phone: "",
          category: "",
          description: "",
        })
        // Show success alert
        alert(
          "✅ Registration Successful!\n\nYour application has been submitted and is pending admin approval. You will receive an email notification once your account is approved.\n\nThank you for your patience!",
        )
        router.push("/") // ✅ Redirect to homepage
      } else {
        setError(result.error || "Registration failed")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
    }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">IC</span>
            </div>
            <span className="text-xl font-bold text-foreground">Islamic Community</span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Join as Service Provider</h1>
          <p className="text-muted-foreground mt-2">Create your account to start offering services to the community</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create Your Account</CardTitle>
            <CardDescription>Fill in your details to get started as a service provider</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
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
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Service Category *</Label>
                <Select value={formData.category} onValueChange={handleSelectChange} disabled={loading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your primary service category" />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVICE_CATEGORIES.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Brief Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Tell us about your services and experience..."
                  value={formData.description}
                  onChange={handleChange}
                  disabled={loading}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="text-xs text-muted-foreground bg-amber-50 border border-amber-200 p-3 rounded-md">
                <strong>📋 Application Process:</strong>
                <ul className="mt-1 space-y-1 list-disc list-inside">
                  <li>Your application will be reviewed by our admin team</li>
                  <li>You'll receive an email notification once approved</li>
                  <li>Only approved providers can access the dashboard</li>
                  <li>Review typically takes 1-2 business days</li>
                </ul>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Submitting Application..." : "Submit Application"}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-4">
              <div className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/service-provider/auth/login" className="text-primary hover:underline">
                  Sign In
                </Link>
              </div>

              <div className="text-sm text-muted-foreground">
                Looking for services?{" "}
                <Link href="/user/auth/register" className="text-primary hover:underline">
                  Join as User
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
