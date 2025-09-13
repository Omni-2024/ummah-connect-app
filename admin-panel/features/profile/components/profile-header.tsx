"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/base/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/base/avatar"
import { Badge } from "@/components/base/badge"
import { Shield, Star } from "lucide-react"
import { PersonIcon, CameraIcon } from "@radix-ui/react-icons"
import { useAuthState } from "@/features/auth/context/useAuthState"
import { useCurrentUser } from "@/hooks/useUserInfo"
import { updateUserFn } from "@/lib/endpoints/usersFns"
import { uploadPublicFn } from "@/lib/endpoints/fileUploadFns"

export function ProfileHeader() {
  const { role } = useAuthState()
  const { data: profile, isLoading, refetch } = useCurrentUser()
  const [uploading, setUploading] = useState(false)
  const [avatarBroken, setAvatarBroken] = useState(false)

  if (isLoading) {
    return <div>Loading profile...</div>
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!profile || !e.target.files?.[0]) return

    const file = e.target.files[0]
    try {
      setUploading(true)

      const uploadResult = await uploadPublicFn({ imageFile: file })

      await updateUserFn({
        id: profile.id,
        profileImage: uploadResult.url,
      })

      refetch()
    } catch (err) {
      console.error("Image upload failed:", err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <Card className="border-[#3E6563]/50 shadow-lg">
      <CardContent className="pl-8 pr-8 pt-16 pb-16">
        <div className="flex items-start space-x-6">
          {/* Avatar Section */}
          <div className="relative group">
            <div className="w-24 h-24 rounded-full border-4 border-[#337f7c] overflow-hidden bg-gradient-to-br from-emerald-400 to-teal-500">
              {(!profile?.profileImage || avatarBroken) ? (
                <div className="w-full h-full flex items-center justify-center">
                  <PersonIcon className="w-10 h-10 text-white" />
                </div>
              ) : (
                <Avatar className="w-full h-full">
                  <AvatarImage
                    src={profile?.profileImage}
                    alt="Profile"
                    onError={() => setAvatarBroken(true)}
                  />
                  <AvatarFallback>
                    <PersonIcon className="w-10 h-10 text-white" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>

            {/* Upload button (floating on avatar) */}
            <label
              htmlFor="profileImageUpload"
              className={`absolute -bottom-2 -right-2 bg-emerald-500 rounded-full p-2 cursor-pointer hover:bg-emerald-600 transition-colors shadow-lg ${
                uploading ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              <CameraIcon className="w-4 h-4 text-white" />
              <input
                id="profileImageUpload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                disabled={uploading}
              />
            </label>
          </div>

          {/* Profile Info */}
          <div className="flex-1 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                {/* Name */}
                <h2 className="text-2xl font-bold text-foreground">
                  {profile?.name ?? "Unknown User"}
                </h2>

                {/* Email */}
                <p className="text-muted-foreground">{profile?.email ?? "No email available"}</p>

                <div className="flex items-center space-x-2 mt-2">
                  <Badge
                    variant="secondary"
                    className="bg-[#337f7c]/10 text-[#337f7c] border-[#337f7c]/50"
                  >
                    <Shield className="w-3 h-3 mr-1" />
                    {role === "admin" ? "Admin" : "User"}
                  </Badge>
                  {profile?.verified && (
                    <Badge
                      variant="outline"
                      className="bg-cyan-600 border-[#337f7c]/20 text-white"
                    >
                      <Star className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
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
