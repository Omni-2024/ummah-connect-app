"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
// import { useAdminAuth } from "@/hooks/useAuth"
import { Shield } from "lucide-react"
import {useMutation} from "@tanstack/react-query";
import {adminSignInFn} from "@/lib/endpoints/authenticationFns";
import {ADMIN_ROLES} from "@/lib/constants";
import {Toast} from "@/components/ui/toast";
import {useAuthState} from "@/features/auth/context/useAuthState";
import {HttpStatusCode, isAxiosError} from "axios";

export default function AdminLoginPage() {
  const router = useRouter()
  const { login: setLogin } = useAuthState();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")

  const {
    mutate: login,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: adminSignInFn,

    onSuccess: (data) => {
      const requiredRoles = [
        ADMIN_ROLES.ADMIN,
        ADMIN_ROLES.OPERATIONAL_ADMIN,
        ADMIN_ROLES.ROOT,
      ];

      if (!requiredRoles.includes(data.role))
          // return Toast.error("Invalid email or password");


      setLogin({
        accessToken: data.token,
        refreshToken: data.refreshToken ?? "",
        role: data.role,
        id: data.id,
      });

      // Toast.success(`You have successfully logged in as a ${data.role}`);
      router.push("/admin/dashboard");
    },
    onError: (err) => {
      if (isAxiosError(err)) {
        if (err.code === "ERR_NETWORK")
            // return Toast.error("Network error. Please try again later");

          if (err.status === HttpStatusCode.Unauthorized)
            return ""
        // return Toast.error("Invalid email or password");

        // Toast.error("An error occurred. Please try again later");
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    await login({
      email: formData.email,
      password: formData.password,
    });



    // try {
    //   // const result = await login(formData.username, formData.password)
    //   if (result.success) {
    //     router.push("/admin/dashboard")
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
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <Shield className="h-6 w-6 text-destructive" />
            </div>
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

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Signing In..." : "Access Admin Panel"}
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
