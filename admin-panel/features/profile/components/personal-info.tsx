"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/base/card"
import Button from "@/components/base/button"
import  Input  from "@/components/base/form/Input"
import Label  from "@/components/base/form/Label"
import  Textarea  from "@/components/base/form/Textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/base/select"
import { Save, User, Mail, Calendar } from "lucide-react"

export function PersonalInfo() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "Admin",
    lastName: "User",
    email: "admin@islamic.com",
    phone: "+1 (555) 123-4567",
    location: "New York, USA",
    timezone: "America/New_York",
    bio: "Experienced system administrator managing the Islamic community platform with dedication to serving our community members.",
    joinDate: "January 2023",
  })

  const handleSave = () => {
    // Save logic here
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
          <p className="text-sm text-muted-foreground">Update your personal details and profile information</p>
        </div>
        <Button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className="bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          {isEditing ? (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          ) : (
            <>
              <User className="w-4 h-4 mr-2" />
              Edit Info
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card className="bg-card/30 border-[#337f7c]/50 shadow-md">
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <User className="w-4 h-4 mr-2 text-accent" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  disabled={!isEditing}
                  className="bg-input border-[#337f7c]/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  disabled={!isEditing}
                  className="bg-input border-[#337f7c]/20"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                disabled={!isEditing}
                className="bg-input border-[#337f7c]/20 min-h-[100px]"
                placeholder="Tell us about yourself..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="bg-card/30 border-[#337f7c]/50 shadow-md">
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Mail className="w-4 h-4 mr-2 text-accent" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!isEditing}
                className="bg-input border-[#337f7c]/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={!isEditing}
                className="bg-input border-[#337f7c]/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                disabled={!isEditing}
                className="bg-input border-[#337f7c]/20"
              />
            </div>
          </CardContent>
        </Card>

        {/* System Information */}
        <Card className="bg-card/30 border-[#337f7c]/50 lg:col-span-2 shadow-md">
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-accent" />
              System Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={formData.timezone}
                onValueChange={(value) => setFormData({ ...formData, timezone: value })}
                disabled={!isEditing}
              >
                <SelectTrigger className="bg-input border-[#337f7c]/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-[#337f7c]/20">
                  <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                  <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Join Date</Label>
              <Input value={formData.joinDate} disabled className="bg-muted border-[#337f7c]/20 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <Label>Account Status</Label>
              <Input value="Active" disabled className="bg-muted border-[#337f7c]/20 text-accent font-medium" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
