"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/base/card";
import Input from "@/components/base/form/Input";
import Label from "@/components/base/form/Label";
import Textarea from "@/components/base/form/Textarea";
import { Mail, User } from "lucide-react";
import { useCurrentUser } from "@/hooks/useUserInfo";
import { updateUserFn } from "@/lib/endpoints/usersFns";
import { EditInfoButton } from "../buttons/EditInfoButton";
import { Dropdown } from "@/features/profile/buttons/Dropdown";
import { COUNTRY_LIST, languages as LANGUAGE_OPTIONS } from "@/lib/constants";
import MultiLanguageSelect from "@/features/profile/buttons/MultiSelect";
import { Toast } from "@/components/base/toast";
import { Gender } from "@/types/data";

export interface formType {
  name: string;
  country: string;
  languages: string[];
  bio: string;
  contactNumber: string;
  email: string;
  gender: Gender;
  sameGenderAllow: boolean;
}

export function PersonalInfo() {
  const { data: profile, isLoading, refetch } = useCurrentUser();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<formType | null>(null);
  const [saving, setSaving] = useState(false);

  // Initialize formData once profile is loaded
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name,
        country: profile.country,
        languages: Array.isArray(profile.languages) ? profile.languages : [],
        bio: profile.bio,
        contactNumber: profile.contactNumber,
        email: profile.email,
        gender: profile.gender,
        sameGenderAllow: profile.sameGenderAllow,
      });
    }
  }, [profile]);

  if (isLoading || !formData) return <div>Loading...</div>;

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      await updateUserFn({
        id: profile.id,
        name: formData.name,
        contactNumber: formData.contactNumber,
        bio: formData.bio,
        country: formData.country,
        languages: formData.languages,
        gender: formData.gender,
        sameGenderAllow: formData.sameGenderAllow, // ✅ always boolean
      });
      Toast.success("User details updated successfully");
      setIsEditing(false);
      refetch();
    } catch (err) {
      Toast.error("User details update failed");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleSameGender = async () => {
    if (!profile) return;

    const newValue = !formData.sameGenderAllow;

    // Optimistic UI update
    setFormData((prev) => ({ ...prev!, sameGenderAllow: newValue }));

    try {
      await updateUserFn({
        id: profile.id,
        sameGenderAllow: newValue,
      });
      Toast.success(
        newValue ? "Same gender interaction enabled" : "Same gender interaction disabled"
      );
      refetch();
    } catch (err) {
      Toast.error("Failed to update preference");
      console.error(err);
      // Rollback in case of error
      setFormData((prev) => ({ ...prev!, sameGenderAllow: profile.sameGenderAllow }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
          <p className="text-sm text-muted-foreground">
            Update your personal details and profile information
          </p>
        </div>
        <EditInfoButton
          isEditing={isEditing}
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          saving={saving}
        />
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
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!isEditing}
                className="bg-input border-[#337f7c]/20"
              />
            </div>

            {/* Country */}
            <div className="space-y-2">
              <Dropdown
                label="Country"
                value={formData.country}
                options={COUNTRY_LIST.map((c) => c.value)}
                onChange={(value) => setFormData({ ...formData, country: value as string })}
                disabled={!isEditing}
                required
              />
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Dropdown
                label="Gender"
                value={formData.gender}
                options={[Gender.MALE, Gender.FEMALE]}
                onChange={(value) => setFormData({ ...formData, gender: value as Gender })}
                disabled={!isEditing}
                required
              />
            </div>

            {/* Language */}
            <div className="space-y-2">
              <MultiLanguageSelect
                label="Languages"
                options={LANGUAGE_OPTIONS}
                value={formData.languages}
                onChange={(next) => setFormData({ ...formData, languages: next })}
                disabled={!isEditing}
                required
              />
            </div>

            {/* Bio */}
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

            {/* Switch / Toggle */}
            <div className="flex items-center space-x-3 mt-2">
              <Label htmlFor="sameGenderAllow">Allow same gender interaction</Label>
              <div
                onClick={isEditing ? handleToggleSameGender : undefined}
                className={`w-14 h-7 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition-colors ${
                  formData.sameGenderAllow ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${
                    formData.sameGenderAllow ? "translate-x-7" : ""
                  }`}
                />
              </div>
              <span>{formData.sameGenderAllow ? "ON" : "OFF"}</span>
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
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input
                id="contactNumber"
                value={formData.contactNumber}
                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                disabled={!isEditing}
                className="bg-input border-[#337f7c]/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                disabled
                className="bg-input border-[#337f7c]/20"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
