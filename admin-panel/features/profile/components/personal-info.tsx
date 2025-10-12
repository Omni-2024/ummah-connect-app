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
import {Toast} from "@/components/base/toast";
import {Gender} from "@/types/data";

export interface formType {
  name:string,
  country:string,
  languages: string[],
  bio:string,
  contactNumber:string,
  email:string
  gender:Gender
  sameGenderAllow:boolean
}


export function PersonalInfo() {
  const { data: profile, isLoading, refetch } = useCurrentUser();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<formType>({
    name: "",
    country: "",
    languages: [],
    bio: "",
    contactNumber: "",
    email: "",
    gender:Gender.MALE,
    sameGenderAllow:false
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name,
        country: profile.country,
        languages: Array.isArray(profile.languages) ? profile.languages : [],
        bio: profile.bio,
        contactNumber: profile.contactNumber,
        email: profile.email,
       gender:profile.gender,
       sameGenderAllow:profile.sameGenderAllow
      });
    }
  }, [profile]);

  if (isLoading) return <div>Loading...</div>;

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
        gender:formData.gender,
        sameGenderAllow:formData.sameGenderAllow
      });
      Toast.success("User details updated successfully");
      setIsEditing(false);
      refetch();
    } catch (err) {
      Toast.error("User details updated failed");
      console.error("Failed to update profile:", err);
    } finally {
      setSaving(false);
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
            {/* Contact Number */}
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

            {/* Email */}
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
