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
import PersonalInfoSkeleton from "../skeletons/personal-info-skeleton";

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
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<formType>({
    name: "",
    country: "",
    languages: [],
    bio: "",
    contactNumber: "",
    email: "",
    gender: Gender.MALE,
    sameGenderAllow: false,
  });

  // ---------------------------------------------
  // INIT FORM DATA
  // ---------------------------------------------
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

  // ---------------------------------------------
  // FORM VALIDATION (REQUIRED FIELDS)
  // ---------------------------------------------
  const isFormValid = () => {
    if (!formData.name.trim()) return false;
    if (!formData.country) return false;
    if (!formData.gender) return false;
    if (!formData.languages || formData.languages.length === 0) return false;
    if (!formData.bio.trim()) return false;
    if (!formData.contactNumber.trim()) return false;
    return true;
  };

  // ---------------------------------------------
  // SAVE HANDLER
  // ---------------------------------------------
  const handleSave = async () => {
    if (!profile) return;

    if (!isFormValid()) {
      Toast.error("Please fill in all required fields before saving");
      return;
    }

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
        sameGenderAllow: formData.sameGenderAllow,
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

  // ---------------------------------------------
  // TOGGLE SAME GENDER (LOCAL ONLY)
  // ---------------------------------------------
  const handleToggleSameGender = () => {
    if (!isEditing) return;
    setFormData((prev) => ({
      ...prev,
      sameGenderAllow: !prev.sameGenderAllow,
    }));
  };

  if (isLoading) return <PersonalInfoSkeleton />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Personal Information
          </h3>
          <p className="text-sm text-muted-foreground">
            Update your personal details and profile information
          </p>
        </div>

        <EditInfoButton
          isEditing={isEditing}
          saving={saving}
          disabled={isEditing && !isFormValid()}
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* BASIC INFO */}
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
              <Label>Name <span className="text-red-500">*</span></Label>
              <Input
                value={formData.name}
                disabled={!isEditing}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            {/* Country */}
            <div className="space-y-2">
              <Label>Country <span className="text-red-500">*</span></Label>
              <Dropdown
                label=""
                value={formData.country}
                disabled={!isEditing}
                options={COUNTRY_LIST.map((c) => c.value)}
                onChange={(v) =>
                  setFormData({ ...formData, country: v as string })
                }
              />
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label>Gender <span className="text-red-500">*</span></Label>
              <Dropdown
                label=""
                value={formData.gender}
                disabled={!isEditing}
                options={[Gender.MALE, Gender.FEMALE]}
                onChange={(v) =>
                  setFormData({ ...formData, gender: v as Gender })
                }
              />
            </div>

            {/* Languages */}
            <div className="space-y-2">
              <Label>Languages <span className="text-red-500">*</span></Label>
              <MultiLanguageSelect
                label=""
                disabled={!isEditing}
                options={LANGUAGE_OPTIONS}
                value={formData.languages}
                onChange={(v) =>
                  setFormData({ ...formData, languages: v })
                }
              />
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label>Bio <span className="text-red-500">*</span></Label>
              <Textarea
                disabled={!isEditing}
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
              />
            </div>

            {/* Same Gender Toggle */}
            <div className="mt-4 p-4 border rounded-xl bg-muted">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Same Gender Interaction
                </span>
                <button
                  onClick={handleToggleSameGender}
                  disabled={!isEditing}
                  className={`h-8 w-16 rounded-full relative transition ${
                    formData.sameGenderAllow ? "bg-green-500" : "bg-gray-400"
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 h-6 w-6 bg-white rounded-full transition-transform ${
                      formData.sameGenderAllow ? "translate-x-8" : ""
                    }`}
                  />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CONTACT INFO */}
        <Card className="bg-card/30 border-[#337f7c]/50 shadow-md">
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Mail className="w-4 h-4 mr-2 text-accent" />
              Contact Information
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Contact Number <span className="text-red-500">*</span></Label>
              <Input
                value={formData.contactNumber}
                disabled={!isEditing}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contactNumber: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Email <span className="text-red-500">*</span></Label>
              <Input value={formData.email} disabled />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
