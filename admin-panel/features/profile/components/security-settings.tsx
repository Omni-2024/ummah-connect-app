"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/base/card"
import Button from "@/components/base/button"
import { Input } from "@/components/base/input"
import { Label } from "@/components/base/label"
import  Switch  from "@/components/base/switch"
import { Badge } from "@/components/base/badge"
import { Shield, Key, Smartphone, AlertTriangle, Eye, EyeOff } from "lucide-react"
import { toast } from "react-hot-toast" // optional for notifications
import { changePasswordFn } from "@/lib/endpoints/authenticationFns"

export function SecuritySettings({ userId }: { userId: string }) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

  const handlePasswordUpdate = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required")
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match")
      return
    }

    setIsUpdating(true)
    try {
      // Replace OTP with real value if you implement 2FA or send via email
      await changePasswordFn({ id: userId, oldPassword: currentPassword, newPassword, otp: "123456" })
      toast.success("Password updated successfully!")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update password")
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Security Settings</h3>
        <p className="text-sm text-muted-foreground">Manage your account security and authentication preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Password Settings */}
        <Card className="bg-card/30 border-[#337f7c]/50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Key className="w-4 h-4 mr-2 text-accent" />
              Password Settings
            </CardTitle>
            <CardDescription>Update your account password</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  className="bg-input border-border/50 pr-10"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 bg-transparent hover:bg-transparent rounded-none border-none"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  className="bg-input border-border/50 pr-10"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 bg-transparent hover:bg-transparent border-none"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  className="bg-input border-border/50 pr-10"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 bg-transparent hover:bg-transparent border-none"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <Button
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
              onClick={handlePasswordUpdate}
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : "Update Password"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
