"use client";

import { ArrowRightIcon, UploadIcon, ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
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
import { COUNTRY_LIST, MAX_IMAGE_BYTES, languages, COUNTRY_CODES } from "@/lib/constants";
import { Dropdown } from "@/features/myprofile/Dropdown";

const SetupAccountStep = () => {
  const router = useRouter();
  const isMobile = useIsMobile();

  const [image, setImage] = useState<File | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [countryCode, setCountryCode] = useState("+44");
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [phoneNumber, setPhoneNumber] = useState("");
  const [company, setCompany] = useState("");
  const [country, setCountry] = useState("");
  const [gender, setGender] = useState<Gender>(Gender.MALE);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { id } = useAuthState();
  const { selectedDesignation, selectedInterests } = useOnboardingState();

  const { mutate: uploadPublicMutate, isPending: isUploadPending } =
    useMutation({ mutationFn: uploadPublicFn });

  const { mutate: updateUserMutate, isPending: isUpdateUserPending } = useMutation({
    mutationFn: updateUserFn,
  });

  // Filter countries based on search
  const filteredCountries = COUNTRY_CODES.filter(
    (c) =>
      c.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.includes(searchTerm)
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsCountryOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Gender options
  const genderOptions = [
    { value: Gender.MALE, label: 'Male' },
    { value: Gender.FEMALE, label: 'Female' }
  ];

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

    // Combine country code and phone number
    const fullContact = phoneNumber ? `${countryCode}${phoneNumber}` : "";

    updateUserMutate(
      {
        id,
        profileImage: uploadedImageKey,
        contactNumber: fullContact,
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
      setSelectedLanguages((prev) => [...prev, selectedValue]);
    }
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden pb-32 lg:w-auto lg:pb-0">
      <div className="w-full px-4 lg:px-0">
        <h2 className="text-2xl font-bold lg:text-center">Let's set up your profile</h2>
        <p className="mt-2 text-sm text-dark-300 lg:mt-1 lg:text-center">
          Select topics that interest you and we'll make recommendations for you.
        </p>

        <div className="flex flex-col items-center justify-center gap-8 py-6 lg:flex-row lg:gap-4 lg:px-4">
          <div className="flex w-full flex-col items-center gap-4 lg:w-auto lg:flex-1">
            <div className="flex size-32 items-center justify-center overflow-hidden rounded-full border border-dark-100 bg-dark-50 lg:size-28 lg:bg-transparent">
              {previewUrl ? (
                <img src={previewUrl} alt="Profile preview" className="size-full object-cover" />
              ) : (
                <Profile className="size-12 text-dark-100 lg:size-10" />
              )}
            </div>

            <div className="flex w-full flex-col items-center justify-center gap-2 px-4">
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

              <Label className="block text-center text-xs text-dark-200">
                Choose and upload a profile picture to update your profile.
              </Label>
            </div>
          </div>

          <div className="w-full flex-1 space-y-4 lg:max-w-sm">
            <div className="w-full space-y-1">
              <Label>Gender</Label>
              <Dropdown
                label=""
                value={genderOptions.find(g => g.value === gender)?.label || 'Male'}
                options={genderOptions.map(g => g.label)}
                onChange={(value) => {
                  const selectedGender = genderOptions.find(g => g.label === value)?.value || Gender.MALE;
                  setGender(selectedGender);
                }}
              />
            </div>

            <div className="w-full space-y-1">
              <Label>Contact Number</Label>
              <div className="flex gap-2" ref={dropdownRef}>
                {/* Custom Country Code Dropdown - Opens UPWARDS */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsCountryOpen((prev) => !prev)}
                    className="w-[110px] px-3 py-2.5 border border-gray-300 rounded-lg bg-white text-left text-sm flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  >
                    <span className="truncate text-xs">{countryCode}</span>
                    {isCountryOpen ? (
                      <ChevronUpIcon className="w-4 h-4 ml-1 flex-shrink-0" />
                    ) : (
                      <ChevronDownIcon className="w-4 h-4 ml-1 flex-shrink-0" />
                    )}
                  </button>

                  {/* Dropdown opens UPWARDS */}
                  {isCountryOpen && (
                    <div className="fixed lg:absolute bottom-full left-4 right-4 lg:left-0 lg:right-auto mb-1 lg:w-[280px] bg-white border border-gray-300 rounded-lg shadow-2xl z-50 max-h-64 overflow-hidden">
                      <input
                        type="text"
                        placeholder="Search country or code..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-3 border-b border-gray-200 text-sm outline-none sticky top-0 bg-white z-10"
                        autoFocus
                      />
                      <div className="overflow-y-auto max-h-56">
                        {filteredCountries.length === 0 ? (
                          <div className="px-4 py-3 text-sm text-gray-500">No countries found</div>
                        ) : (
                          filteredCountries.map((c) => (
                            <button
                              key={c.code}
                              type="button"
                              onClick={() => {
                                setCountryCode(c.code);
                                setIsCountryOpen(false);
                                setSearchTerm("");
                              }}
                              className="w-full px-4 py-3 text-left text-sm hover:bg-emerald-50 flex justify-between items-center transition-colors"
                            >
                              <span className="font-medium">{c.code}</span>
                              <span className="text-gray-600 text-xs truncate ml-3">
                                {c.country}
                              </span>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                  placeholder="76543210"
                  className="flex-1 min-w-0 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm hover:border-gray-400 transition-colors"
                />
              </div>
            </div>

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

      <div className="fixed inset-x-0 bottom-0 flex w-full items-end justify-end bg-white px-4 py-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] lg:static lg:bottom-auto lg:pb-0 lg:shadow-none">
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