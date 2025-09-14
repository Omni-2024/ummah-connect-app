"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/base/card"
import { Input } from "@/components/base/input"
import { Label } from "@/components/base/label"
import Button from "@/components/base/button"
import { Key, Eye, EyeOff } from "lucide-react"
import { toast } from "react-hot-toast"
import { useCurrentUser } from "@/hooks/useUserInfo"
import { changePasswordNoOtpFn } from "@/lib/endpoints/authenticationFns"

export function SecuritySettings() {
  const { data: profile, isLoading } = useCurrentUser()
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

  if (isLoading) return <div>Loading security settings...</div>

  const handlePasswordUpdate = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required")
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match")
      return
    }
    if (!profile?.id) {
      toast.error("User ID is missing. Please log in again.")
      return
    }

    setIsUpdating(true)
    try {
      await changePasswordNoOtpFn(profile.id, currentPassword, newPassword)
      toast.success("Password updated successfully!")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to update password")
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Security Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your account security and authentication preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card/30 border-[#337f7c]/50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Key className="w-4 h-4 mr-2 text-accent" />
              Password Settings
            </CardTitle>
            <CardDescription>Update your account password</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current Password */}
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="bg-input border-border/50 pr-10"
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

            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-input border-border/50 pr-10"
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

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-input border-border/50 pr-10"
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
            variant="primary"
              className="w-full"
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
