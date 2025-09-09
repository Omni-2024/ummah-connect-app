"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/base/card"
import  Switch  from "@/components/base/switch"
import { Label } from "@/components/base/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Mail, MessageSquare, Users, Briefcase, CreditCard } from "lucide-react"

export function NotificationPreferences() {
  const [notifications, setNotifications] = useState({
    email: {
      newUsers: true,
      newProviders: true,
      newGigs: false,
      payments: true,
      systemUpdates: true,
      weeklyDigest: true,
    },
    push: {
      newUsers: false,
      newProviders: true,
      newGigs: false,
      payments: true,
      systemUpdates: false,
      weeklyDigest: false,
    },
    frequency: "immediate",
  })

  const updateEmailNotification = (key: string, value: boolean) => {
    setNotifications((prev) => ({
      ...prev,
      email: { ...prev.email, [key]: value },
    }))
  }

  const updatePushNotification = (key: string, value: boolean) => {
    setNotifications((prev) => ({
      ...prev,
      push: { ...prev.push, [key]: value },
    }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Notification Preferences</h3>
        <p className="text-sm text-muted-foreground">Choose how and when you want to receive notifications</p>
      </div>

      <div className="space-y-6">
        {/* Notification Frequency */}
        <Card className="bg-card/30 border-border/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Bell className="w-4 h-4 mr-2 text-accent" />
              Notification Frequency
            </CardTitle>
            <CardDescription>Control how often you receive notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="frequency">Delivery Frequency</Label>
              <Select
                value={notifications.frequency}
                onValueChange={(value) => setNotifications({ ...notifications, frequency: value })}
              >
                <SelectTrigger className="bg-input border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="immediate">Immediate</SelectItem>
                  <SelectItem value="hourly">Hourly Digest</SelectItem>
                  <SelectItem value="daily">Daily Digest</SelectItem>
                  <SelectItem value="weekly">Weekly Digest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Email Notifications */}
        <Card className="bg-card/30 border-border/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Mail className="w-4 h-4 mr-2 text-accent" />
              Email Notifications
            </CardTitle>
            <CardDescription>Configure which events trigger email notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <Label htmlFor="emailNewUsers">New Users</Label>
                    <p className="text-xs text-muted-foreground">When new users register</p>
                  </div>
                </div>
                <Switch
                  id="emailNewUsers"
                  checked={notifications.email.newUsers}
                  onCheckedChange={(checked) => updateEmailNotification("newUsers", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <Label htmlFor="emailNewProviders">New Providers</Label>
                    <p className="text-xs text-muted-foreground">When providers join</p>
                  </div>
                </div>
                <Switch
                  id="emailNewProviders"
                  checked={notifications.email.newProviders}
                  onCheckedChange={(checked) => updateEmailNotification("newProviders", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Briefcase className="w-4 h-4 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <Label htmlFor="emailNewGigs">New Gigs</Label>
                    <p className="text-xs text-muted-foreground">When gigs are published</p>
                  </div>
                </div>
                <Switch
                  id="emailNewGigs"
                  checked={notifications.email.newGigs}
                  onCheckedChange={(checked) => updateEmailNotification("newGigs", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-4 h-4 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <Label htmlFor="emailPayments">Payments</Label>
                    <p className="text-xs text-muted-foreground">Payment notifications</p>
                  </div>
                </div>
                <Switch
                  id="emailPayments"
                  checked={notifications.email.payments}
                  onCheckedChange={(checked) => updateEmailNotification("payments", checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Push Notifications */}
        <Card className="bg-card/30 border-border/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <MessageSquare className="w-4 h-4 mr-2 text-accent" />
              Push Notifications
            </CardTitle>
            <CardDescription>Configure browser and mobile push notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <Label htmlFor="pushNewUsers">New Users</Label>
                    <p className="text-xs text-muted-foreground">Instant notifications</p>
                  </div>
                </div>
                <Switch
                  id="pushNewUsers"
                  checked={notifications.push.newUsers}
                  onCheckedChange={(checked) => updatePushNotification("newUsers", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <Label htmlFor="pushNewProviders">New Providers</Label>
                    <p className="text-xs text-muted-foreground">Instant notifications</p>
                  </div>
                </div>
                <Switch
                  id="pushNewProviders"
                  checked={notifications.push.newProviders}
                  onCheckedChange={(checked) => updatePushNotification("newProviders", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Briefcase className="w-4 h-4 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <Label htmlFor="pushNewGigs">New Gigs</Label>
                    <p className="text-xs text-muted-foreground">Instant notifications</p>
                  </div>
                </div>
                <Switch
                  id="pushNewGigs"
                  checked={notifications.push.newGigs}
                  onCheckedChange={(checked) => updatePushNotification("newGigs", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-4 h-4 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <Label htmlFor="pushPayments">Payments</Label>
                    <p className="text-xs text-muted-foreground">Instant notifications</p>
                  </div>
                </div>
                <Switch
                  id="pushPayments"
                  checked={notifications.push.payments}
                  onCheckedChange={(checked) => updatePushNotification("payments", checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
