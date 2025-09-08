"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/base/card"
import Button from "@/components/base/button"
import  Switch  from "@/components/base/switch"
import { Label } from "@/components/base/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/base/select"
import { Badge } from "@/components/base/badge"
import { Settings, Moon, Sun, Monitor, Palette, Database } from "lucide-react"

export function AccountSettings() {
  const [settings, setSettings] = useState({
    theme: "system",
    language: "en",
    autoSave: true,
    emailDigest: true,
    dataExport: false,
    analyticsTracking: true,
    betaFeatures: false,
  })

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Account Settings</h3>
        <p className="text-sm text-muted-foreground">Customize your account preferences and system settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appearance Settings */}
        <Card className="bg-card/30 border-[#337f7c]/50 shadow-md">
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Palette className="w-4 h-4 mr-2 text-accent" />
              Appearance
            </CardTitle>
            <CardDescription>Customize the look and feel of your interface</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Theme Preference</Label>
              <Select value={settings.theme} onValueChange={(value) => setSettings({ ...settings, theme: value })}>
                <SelectTrigger className="bg-input border-[#337f7c]/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-border">
                  <SelectItem value="light">
                    <div className="flex items-center">
                      <Sun className="w-4 h-4 mr-2" />
                      Light Mode
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center">
                      <Moon className="w-4 h-4 mr-2" />
                      Dark Mode
                    </div>
                  </SelectItem>
                  <SelectItem value="system">
                    <div className="flex items-center">
                      <Monitor className="w-4 h-4 mr-2" />
                      System Default
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select
                value={settings.language}
                onValueChange={(value) => setSettings({ ...settings, language: value })}
              >
                <SelectTrigger className="bg-input border-[#337f7c]/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-border">
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ar">العربية (Arabic)</SelectItem>
                  <SelectItem value="ur">اردو (Urdu)</SelectItem>
                  <SelectItem value="tr">Türkçe (Turkish)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* System Preferences */}
        <Card className="bg-card/30 border-[#337f7c]/50 shadow-md">
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Settings className="w-4 h-4 mr-2 text-accent" />
              System Preferences
            </CardTitle>
            <CardDescription>Configure system behavior and features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="autoSave">Auto-save Changes</Label>
                <p className="text-xs text-muted-foreground">Automatically save your work</p>
              </div>
              <Switch
                id="autoSave"
                checked={settings.autoSave}
                onCheckedChange={(checked) => setSettings({ ...settings, autoSave: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="emailDigest">Email Digest</Label>
                <p className="text-xs text-muted-foreground">Receive daily activity summaries</p>
              </div>
              <Switch
                id="emailDigest"
                checked={settings.emailDigest}
                onCheckedChange={(checked) => setSettings({ ...settings, emailDigest: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="analyticsTracking">Analytics Tracking</Label>
                <p className="text-xs text-muted-foreground">Help improve the platform</p>
              </div>
              <Switch
                id="analyticsTracking"
                checked={settings.analyticsTracking}
                onCheckedChange={(checked) => setSettings({ ...settings, analyticsTracking: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Advanced Settings */}
        <Card className="bg-card/30 border-[#337f7c]/50 lg:col-span-2 shadow-md">
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Database className="w-4 h-4 mr-2 text-accent" />
              Advanced Settings
            </CardTitle>
            <CardDescription>Advanced features and data management options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="betaFeatures">Beta Features</Label>
                    <Badge variant="secondary" className="text-xs">
                      Experimental
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Access experimental features before release</p>
                </div>
                <Switch
                  id="betaFeatures"
                  checked={settings.betaFeatures}
                  onCheckedChange={(checked) => setSettings({ ...settings, betaFeatures: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dataExport">Data Export</Label>
                  <p className="text-xs text-muted-foreground">Enable data export functionality</p>
                </div>
                <Switch
                  id="dataExport"
                  checked={settings.dataExport}
                  onCheckedChange={(checked) => setSettings({ ...settings, dataExport: checked })}
                />
              </div>
            </div>
            <div className="pt-4 border-t border-[#337f7c]/50">
              <Button className="bg-[#669f9d] hover:bg-[#337f7c]/90 text-accent-foreground">Save All Settings</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
