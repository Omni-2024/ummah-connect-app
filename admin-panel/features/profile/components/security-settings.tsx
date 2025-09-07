"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Button from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Shield, Key, Smartphone, AlertTriangle, Eye, EyeOff } from "lucide-react"

export function SecuritySettings() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true)
  const [loginAlerts, setLoginAlerts] = useState(true)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Security Settings</h3>
        <p className="text-sm text-muted-foreground">Manage your account security and authentication preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Password Settings */}
        <Card className="bg-card/30 border-border/50">
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
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
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
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
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
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">Update Password</Button>
          </CardContent>
        </Card>

        {/* Two-Factor Authentication */}
        <Card className="bg-card/30 border-border/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Smartphone className="w-4 h-4 mr-2 text-accent" />
              Two-Factor Authentication
              {twoFactorEnabled && (
                <Badge variant="secondary" className="ml-2 bg-accent/10 text-accent border-accent/20">
                  Enabled
                </Badge>
              )}
            </CardTitle>
            <CardDescription>Add an extra layer of security to your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="twoFactor">Enable 2FA</Label>
                <p className="text-xs text-muted-foreground">Require authentication code for login</p>
              </div>
              <Switch id="twoFactor" checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
            </div>
            {twoFactorEnabled && (
              <div className="space-y-3 pt-3 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Authenticator App</span>
                  <Badge variant="outline" className="border-accent/20 text-accent">
                    Connected
                  </Badge>
                </div>
                <Button variant="primary" size="sm" className="w-full bg-transparent">
                  Reconfigure 2FA
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Alerts */}
        <Card className="bg-card/30 border-border/50 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Shield className="w-4 h-4 mr-2 text-accent" />
              Security Alerts & Monitoring
            </CardTitle>
            <CardDescription>Configure security notifications and monitoring preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="loginAlerts">Login Alerts</Label>
                  <p className="text-xs text-muted-foreground">Get notified of new login attempts</p>
                </div>
                <Switch id="loginAlerts" checked={loginAlerts} onCheckedChange={setLoginAlerts} />
              </div>
              <div className="space-y-2">
                <Label>Last Login</Label>
                <p className="text-sm text-muted-foreground">Today at 2:30 PM from New York, USA</p>
              </div>
            </div>
            <div className="pt-4 border-t border-border/50">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>
                  Your account security score: <strong className="text-accent">Excellent</strong>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
