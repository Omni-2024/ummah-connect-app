"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import  Button  from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield } from "lucide-react"
import {useMutation} from "@tanstack/react-query";
import {adminSignInFn} from "@/lib/endpoints/authenticationFns";
import {ADMIN_ROLES, MAIN_LOGO_SRC, NAV_LOGO_SRC} from "@/lib/constants";
import {useAuthState} from "@/features/auth/context/useAuthState";
import {HttpStatusCode, isAxiosError} from "axios";
import {Toast} from "@/components/base/Toast";
import Spinner from "@/components/ui/Spinner";
import Image from "next/image";

export default function AdminLoginPage() {
  const router = useRouter()
  const { login: setLogin } = useAuthState();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")

  const { mutate: login, isPending,isSuccess} = useMutation({
    mutationFn: adminSignInFn,
    onSuccess: (data) => {
      const allowedRoles = [
        ADMIN_ROLES.ADMIN,
        ADMIN_ROLES.OPERATIONAL_ADMIN,
        ADMIN_ROLES.ROOT
      ]

      if (!allowedRoles.includes(data.role)) {
        return Toast.error("Access denied. Invalid admin role.")
      }

      setLogin({
        accessToken: data.token,
        refreshToken: data.refreshToken ?? "",
        role: data.role,
        id: data.id
      })

      Toast.success(`Welcome back, ${data.role}`)
      router.push("/admin/dashboard")
    },
    onError: (err) => {
      if (isAxiosError(err)) {
        if (err.code === "ERR_NETWORK") {
          return Toast.error("Network error. Try again later.")
        }
        if (err.status === HttpStatusCode.NotFound) {
          return Toast.error("User not found")
        }

        if (err.status === HttpStatusCode.Unauthorized) {
          return Toast.error("Invalid email or password")
        }
      }

      Toast.error("Login failed. Please try again.")
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    login({
      email: formData.email,
      password: formData.password
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Image src={NAV_LOGO_SRC} alt="Ummah community logo" width={150} height={50} priority/>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Admin Access</h1>
          <p className="text-muted-foreground mt-2">Secure login for platform administrators</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Administrator Login</CardTitle>
            <CardDescription>Enter your admin credentials to access the control panel</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Username</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter admin email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter admin password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isPending}
                />
              </div>

              <Button
                  className="mt-8 w-full bg-primary"
                  type="submit"
                  disabled={isPending || isSuccess}
              >
                {isPending ? <Spinner /> : "Continue with email"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <div className="text-xs text-muted-foreground bg-muted p-3 rounded-md">
                <strong>Demo Credentials:</strong>
                <br />
                Username: admin1
                <br />
                Password: admin123@
              </div>
            </div>

            <div className="mt-4 text-center">
              <Link href="/" className="text-sm text-primary hover:underline">
                Back to Homepage
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
