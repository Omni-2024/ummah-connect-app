"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function UserRegisterPage() {
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
          <h1 className="text-2xl font-bold text-foreground">Join Our Community</h1>
          <p className="text-muted-foreground mt-2">Create your account to access Islamic services</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create Your Account</CardTitle>
            <CardDescription>This feature will be implemented in a future update</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" type="text" placeholder="Your full name" disabled />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="your.email@example.com" disabled />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" disabled />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Create a strong password" disabled />
            </div>

            <Button className="w-full" disabled>
              Coming Soon
            </Button>

            <div className="mt-6 text-center space-y-4">
              <div className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/user/auth/login" className="text-primary hover:underline">
                  Sign In
                </Link>
              </div>

              <div className="text-sm text-muted-foreground">
                Want to offer services?{" "}
                <Link href="/service-provider/auth/register" className="text-primary hover:underline">
                  Join as Provider
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
