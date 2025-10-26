"use client";

import { ArrowRightIcon, UploadIcon } from "@radix-ui/react-icons";
import { Profile } from "iconsax-react";
import { useEffect, useRef, useState } from "react";

import Button from "@/components/base/Button";
import ComboBox from "@/components/base/ComboBox";
import Label from "@/components/base/form/Label";
import Separator from "@/components/base/Separator";
import TextInput from "@/components/widgets/TextInput";
import useIsMobile from "@/lib/hooks/useIsMobile";
import { useRouter } from "next/navigation";
import { useOnboardingState } from "@/features/onboarding/context/useOnboardingState";
import { updateUserFn, Gender } from "@/lib/endpoints/userFns";
import { useMutation } from "@tanstack/react-query";
import { useAuthState } from "@/features/auth/context/useAuthState";
import { Toast } from "@/components/base/Toast";
import { uploadPublicFn } from "@/lib/endpoints/fileUploadFns";
import {COUNTRY_LIST, MAX_IMAGE_BYTES, languages} from "@/lib/constants";

const SetupAccountStep = () => {
  const router = useRouter();
  const isMobile = useIsMobile();

  const [image, setImage] = useState<File | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [contactNumber, setContactNumber] = useState("");
  const [company, setCompany] = useState("");
  const [country, setCountry] = useState("");
  const [gender, setGender] = useState<Gender>(Gender.MALE);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  const { id } = useAuthState();
  const { selectedDesignation, selectedInterests } = useOnboardingState();

  const { mutate: uploadPublicMutate, isPending: isUploadPending } =
      useMutation({ mutationFn: uploadPublicFn });

  const { mutate: updateUserMutate, isPending: isUpdateUserPending } =
      useMutation({ mutationFn: updateUserFn });

  useEffect(() => {
    if (!image) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(image);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  const handleUpdateUser = (uploadedImageKey?: string) => {
    if (!id) return;
    updateUserMutate(
        {
          id,
          profileImage: uploadedImageKey,
          contactNumber,
          company,
          country,
          gender,
          designations: [selectedDesignation?.id || ""],
          interests: selectedInterests.map((i) => i.id),
          languages: selectedLanguages,
        },
        {
          onSuccess: () => router.push("/onboarding/finalizing"),
          onError: () => Toast.error("Failed to update user profile"),
        }
    );
  };

  const handleContinue = () => {
    if (!id) return;

    if (image) {
      uploadPublicMutate(
          { imageFile: image },
          {
            onSuccess: (data) => {
              handleUpdateUser(data.key);
            },
            onError: () => {
              Toast.error("Failed to upload image");
            },
          }
      );
    } else {
      handleUpdateUser();
    }
  };

  const skipStep = () => handleUpdateUser();

  const openImageUploadDialog = () => imageInputRef.current?.click();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      Toast.error("Invalid file type. Please upload JPG, PNG, or WEBP.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      Toast.error(`Image too large (${sizeMB} MB). Max allowed is 3 MB.`);
      setImage(null);
      setPreviewUrl(null);
      e.currentTarget.value = "";
      return;
    }

    setImage(file);
  };

  const handleLanguageSelect = (value: string | string[]) => {
    const selectedValue = Array.isArray(value) ? value[0] : value;
    
    // Only add if not already selected
    if (selectedValue && !selectedLanguages.includes(selectedValue)) {
      setSelectedLanguages(prev => [...prev, selectedValue]);
    }
  };

  const genderOptions = [
    { label: 'Male', value: Gender.MALE },
    { label: 'Female', value: Gender.FEMALE }
  ];

  return (
      <div className="w-screen pb-32 lg:w-auto lg:pb-0">
        <div className="w-full">
          <h2 className="text-2xl font-bold lg:text-center">Let's set up your profile</h2>
          <p className="mt-2 text-sm text-dark-300 lg:mt-1 lg:text-center">
            Select topics that interest you and we'll make recommendations for you.
          </p>

          <div className="flex flex-col flex-wrap items-center justify-center gap-8 py-6 lg:flex-row lg:gap-4 lg:px-4">
            <div className="flex flex-1 flex-col items-center gap-4">
              <div className="">
                <div className="flex size-36 items-center justify-center overflow-hidden rounded-full border border-dark-100 bg-dark-50 lg:size-28 lg:bg-transparent">
                  {previewUrl ? (
                      <img src={previewUrl} alt="uploaded-image" className="size-full object-cover" />
                  ) : (
                      <Profile className="size-14 text-dark-100 lg:size-10" />
                  )}
                </div>
              </div>

              <div className="flex flex-col items-center justify-center gap-2">
                <Button
                    size="sm"
                    variant="secondary"
                    onClick={openImageUploadDialog}
                    leftIcon={<UploadIcon className="size-3.5" />}
                    disabled={isUploadPending || isUpdateUserPending}
                >
                  {isUploadPending ? "Uploading..." : "Upload"}
                </Button>

                <input
                    type="file"
                    onChange={handleImageChange}
                    ref={imageInputRef}
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.webp"
                />

                <Label className="block text-xs text-dark-200">
                  Choose and upload a profile picture to update your profile.
                </Label>
              </div>
            </div>

            <div className="w-full flex-1 space-y-4 lg:max-w-sm">
              <div className="w-full space-y-1">
                <Label>Gender</Label>
                <ComboBox
                    onChange={(value) => {
                      const selectedGender = genderOptions.find(g => g.label === value)?.value || Gender.MALE;
                      setGender(selectedGender);
                    }}
                    placeholder="Select your gender"
                    items={genderOptions}
                />
              </div>

              <TextInput
                  id="contactNumber"
                  label="Contact number"
                  placeholder="Your contact number"
                  onChange={(e) => setContactNumber(e.target.value)}
              />

              {/* If you want company later, just re-enable:
            <TextInput
              id="company"
              label="Hospital/Company"
              placeholder="Your Hospital or Company"
              onChange={(e) => setCompany(e.target.value)}
            />
            */}

              <div className="w-full space-y-1">
                <Label>Country</Label>
                <ComboBox
                    onChange={(value) => setCountry(value)}
                    placeholder="Select your country"
                    items={COUNTRY_LIST}
                />
              </div>

              <div className="w-full space-y-1">
                <Label>Languages</Label>
                <ComboBox
                    onChange={handleLanguageSelect}
                    placeholder="Select languages you speak"
                    items={languages.map(lang => ({
                      label: lang.label,
                      value: lang.label
                    }))}
                />
                {selectedLanguages.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedLanguages.map((lang) => (
                      <span
                        key={lang}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-dark-50 text-dark-600 border border-dark-100"
                      >
                        {lang}
                        <button
                          type="button"
                          onClick={() => setSelectedLanguages(prev => prev.filter(l => l !== lang))}
                          className="ml-1 text-dark-400 hover:text-dark-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <Separator className="hidden lg:block" />

        <div className="fixed bottom-0 left-0 right-0 flex w-full items-end justify-end bg-white px-4 py-4 lg:static lg:bottom-auto lg:pb-0">
          <div className="flex w-full flex-col-reverse items-center justify-end gap-2 lg:flex-row">
            <Button
                className="w-full lg:w-auto"
                variant={isMobile ? "secondary" : "link"}
                onClick={skipStep}
                disabled={isUploadPending || isUpdateUserPending}
            >
              Skip for now
            </Button>

            <Button
                onClick={handleContinue}
                className="w-full lg:w-auto"
                rightIcon={<ArrowRightIcon className="size-4" color="white" />}
                disabled={isUploadPending || isUpdateUserPending}
            >
              {isUploadPending || isUpdateUserPending ? "Saving..." : "Let's get started"}
            </Button>
          </div>
        </div>
      </div>
  );
};

export default SetupAccountStep;