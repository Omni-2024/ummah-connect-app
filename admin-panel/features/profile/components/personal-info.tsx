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
import PersonalInfoSkeleton from "../skeletons/personal-info-skeleton"; // 👈 new skeleton

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

  // 🔄 Show skeleton while loading
  if (isLoading) return <PersonalInfoSkeleton />;

  // ✅ Only saves on clicking "Save Changes"
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
        sameGenderAllow: formData.sameGenderAllow, // ✅ includes the toggle now
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

  // ✅ Local toggle only (no DB calls)
  const handleToggleSameGender = () => {
    if (!isEditing) return;
    setFormData((prev) => ({
      ...prev!,
      sameGenderAllow: !prev!.sameGenderAllow,
    }));
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

            {/* ✅ Same Gender Preference Section */}
            <div className="mt-4 p-4 border rounded-xl bg-gradient-to-r from-[#e0f7f6] to-[#f0fffc] shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-foreground flex items-center">
                    <User className="w-4 h-4 mr-2 text-accent" />
                    Same Gender Interaction
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Control whether people of the same gender can interact with your profile.
                  </p>
                </div>

                {/* Toggle Switch */}
                <button
                  onClick={handleToggleSameGender}
                  disabled={!isEditing}
                  className={`relative inline-flex items-center h-8 w-16 rounded-full transition-all duration-300 focus:outline-none ${
                    formData.sameGenderAllow ? "bg-green-500" : "bg-gray-400"
                  } ${!isEditing ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <span
                    className={`absolute left-1 top-1 h-6 w-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                      formData.sameGenderAllow ? "translate-x-8" : ""
                    }`}
                  />
                </button>
              </div>

              {/* Status Badge */}
              <div className="mt-3 flex items-center gap-2">
                {formData.sameGenderAllow ? (
                  <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Same gender interaction enabled
                  </div>
                ) : (
                  <div className="flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Restricted to opposite gender only
                  </div>
                )}
              </div>
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
