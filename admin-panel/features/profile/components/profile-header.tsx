"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/base/card";
import { Badge } from "@/components/base/badge";
import { Shield, Star } from "lucide-react";
import { CameraIcon } from "@radix-ui/react-icons";
import { useAuthState } from "@/features/auth/context/useAuthState";
import { useCurrentUser } from "@/hooks/useUserInfo";
import { updateUserFn } from "@/lib/endpoints/usersFns";
import { uploadPublicFn } from "@/lib/endpoints/fileUploadFns";
import { Teacher } from "iconsax-react";
import Image from "next/image";
import { useAvatarUrl } from "@/hooks/userAvatarUrl";
import { ProfileHeaderSkeleton } from "../skeletons/profile-header-skeleton";

export function ProfileHeader() {
  const { role } = useAuthState();
  const { data: profile, isLoading, refetch } = useCurrentUser();
  const [uploading, setUploading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const avatarSrc = useAvatarUrl(profile?.profileImage);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!profile || !e.target.files?.[0]) return;

    const file = e.target.files[0];
    const allowedFormats = ['image/png', 'image/jpeg', 'image/jpg', 'image/heic'];
    
    // Validate file type
    if (!allowedFormats.includes(file.type)) {
      console.error("Invalid file format. Only PNG, JPG, JPEG, and HEIC are allowed.");
      alert("Invalid file format. Only PNG, JPG, JPEG, and HEIC are allowed.");
      return;
    }
    
    try {
      setUploading(true);
      const uploadResult = await uploadPublicFn({ imageFile: file });
      await updateUserFn({
        id: profile.id,
        profileImage: uploadResult.key,
      });
      refetch();
    } catch (err) {
      console.error("Image upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => setImageError(false), [profile?.profileImage]);

  if (isLoading) {
    return <ProfileHeaderSkeleton />;
  }

  return (
    <Card className="border-[#3E6563]/50 shadow-lg">
      <CardContent className="pl-8 pr-8 pt-16 pb-16">
        <div className="flex items-start space-x-6">
          {/* Avatar Section */}
          <div className="relative group">
            <div className="w-24 h-24 rounded-full border-4 border-[#337f7c] overflow-hidden bg-gradient-to-br from-emerald-400 to-teal-500 relative">
              {imageError ? (
                <Teacher className="w-full h-full p-4 text-white" />
              ) : (
                <Image
                  src={avatarSrc}
                  alt={profile?.name ?? "User Avatar"}
                  fill
                  className="object-cover rounded-full"
                  unoptimized
                  onError={() => setImageError(true)}
                />
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
                accept=".png,.jpg,.jpeg,.heic"
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
                <p className="text-muted-foreground">
                  {profile?.email ?? "No email available"}
                </p>

                <div className="flex items-center space-x-2 mt-2">
                  <Badge
                    variant="secondary"
                    className="bg-primary-50 text-primary-700 border-primary-700"
                  >
                    <Shield className="w-3 h-3 mr-1" />
                    {role === "admin" ? "Admin" : "User"}
                  </Badge>
                  {profile?.verified && (
                    <Badge
                      variant="outline"
                      className="bg-primary-600 border-primary-50 text-white"
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
                <div className="text-sm text-muted-foreground">
                  Active Providers
                </div>
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
  );
}
