"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import Button from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Camera, Edit3, Shield, Star } from "lucide-react"

export function ProfileHeader() {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <Card className="bg-[#D3E4E3] border-[#3E6563]/50 shadow-lg">
      <CardContent className="pl-8 pr-8 pt-16 pb-16">
        <div className="flex items-start space-x-6">
          {/* Avatar Section */}
          <div className="relative group">
            <Avatar className="w-24 h-24 ring-4 ring-[#337f7c] transition-all duration-300 group-hover:ring-accent/40">
              <AvatarImage src="/professional-admin-avatar.png" />
              <AvatarFallback className="bg-accent text-accent-foreground text-2xl font-bold">AU</AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              variant="secondary"
              className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
            >
              <Camera className="w-4 h-4" />
            </Button>
          </div>

          {/* Profile Info */}
          <div className="flex-1 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Admin User</h2>
                <p className="text-muted-foreground">System Administrator</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="secondary" className="bg-[#337f7c]/10 text-[#337f7c] border-[#337f7c]/50">
                    <Shield className="w-3 h-3 mr-1" />
                    Super Admin
                  </Badge>
                  <Badge variant="outline" className="bg-cyan-600 border-[#337f7c]/20 text-white">
                    <Star className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                </div>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="bg-gradient-to-br from-[#669f9d] to-[#337f7c] hover:text-accent-foreground transition-colors"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#337f7c]/50">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">1,247</div>
                <div className="text-sm text-muted-foreground">Total Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">89</div>
                <div className="text-sm text-muted-foreground">Active Providers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">156</div>
                <div className="text-sm text-muted-foreground">Published Gigs</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
