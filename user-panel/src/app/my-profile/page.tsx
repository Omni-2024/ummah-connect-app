"use client"

import React, { useState, useEffect } from "react"
import { ArrowRightIcon, PersonIcon, CameraIcon, CheckIcon } from "@radix-ui/react-icons"
import Image from "next/image"
import Bottombar from "@/features/app/components/Bottombar"
import Navbar from "@/features/app/components/Navbar"
import NavbarMobile from "@/features/app/components/Navbar.mobile"
import { useCurrentUser } from "@/lib/hooks/useUser"
import { buildAvatarUrl } from "@/features/app/components/Navbar"
import { updateUserFn } from "@/lib/endpoints/userFns"
import { getAllProfessionsFn, getAllSpecialistByProfessionIdFn } from "@/lib/endpoints/categoryFns"
import { COUNTRY_LIST } from "@/lib/constants"
import {uploadPublicFn} from "@/lib/endpoints/fileUploadFns"
import { Dropdown } from "@/features/myprofile/Dropdown"
import { LoadingSkeleton } from "@/features/myprofile/LoadingSkeleton"

interface ProfileEditProps {
  router?: {
    push: (path: string) => void
  }
}

export default function ProfileEdit({ router }: ProfileEditProps) {
  const { data: user, isFetched, isLoading: userLoading, refetch } = useCurrentUser()
  const [avatarBroken, setAvatarBroken] = useState(false)
  
  // Data options state
  const [professions, setProfessions] = useState<Array<{id: string, name: string}>>([])
  const [specialists, setSpecialists] = useState<Array<{id: string, name: string}>>([])
  const [selectedProfessionId, setSelectedProfessionId] = useState("")
  const [imageManuallyUpdated, setImageManuallyUpdated] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    contact: "",
    profileImage: "",
    designation: [] as string[],
    interest: [] as string[],
    specialization: "",
    company: "",
    country: ""
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  })
  
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [isSavingPassword, setIsSavingPassword] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [professionMap, setProfessionMap] = useState<{[key: string]: string}>({})
  const [specialistMap, setSpecialistMap] = useState<{[key: string]: string}>({})
 
 
  // Load professions on component mount
    useEffect(() => {
    const loadProfessions = async () => {
        try {
        const professionsData = await getAllProfessionsFn()
        setProfessions(professionsData.map(p => ({ id: p.id, name: p.name })))
        
        // Create ID to name mapping
        const profMap = professionsData.reduce((acc, p) => {
            acc[p.id] = p.name
            return acc
        }, {} as {[key: string]: string})
        setProfessionMap(profMap)
        } catch (error) {
        console.error("Failed to load professions:", error)
        }
    }
    loadProfessions()
    }, [])
    // Load specialists when profession changes
    useEffect(() => {
    const loadSpecialists = async () => {
        if (selectedProfessionId) {
        try {
            const specialistsData = await getAllSpecialistByProfessionIdFn(selectedProfessionId)
            setSpecialists(specialistsData.map(s => ({ id: s.id, name: s.name })))
            
            // Create ID to name mapping
            const specMap = specialistsData.reduce((acc, s) => {
            acc[s.id] = s.name
            return acc
            }, {} as {[key: string]: string})
            setSpecialistMap(specMap)
        } catch (error) {
            console.error("Failed to load specialists:", error)
            setSpecialists([])
        }
        } else {
        setSpecialists([])
        }
    }
    loadSpecialists()
    }, [selectedProfessionId])

    // Sync profileData with user data when user is fetched
    useEffect(() => {
    if (isFetched && user) {
        const avatarUrl = buildAvatarUrl(user.profileImage)
        
        setProfileData(prev => ({
        name: user.name || "",
        email: user.email || "",
        contact: user.contactNumber || "",
        profileImage: imageManuallyUpdated ? prev.profileImage : (avatarUrl || ""),
        designation: Array.isArray(user.designations) ? user.designations : [],
        interest: Array.isArray(user.interests) ? user.interests : [],
        specialization: user.specializations || "", // Changed from array handling to string
        company: user.company || "",
        country: user.country || ""
        }))

        if (user.designations && Array.isArray(user.designations) && user.designations.length > 0) {
        setSelectedProfessionId(user.designations[0])
        }
    }
    }, [isFetched, user, imageManuallyUpdated])

  const handleSaveProfile = async () => {
  if (!user?.id) return

  setIsSavingProfile(true)
  try {
    let imageUrl = profileData.profileImage

    // If there's a new image (data URL), upload it first
    if (profileData.profileImage && profileData.profileImage.startsWith('data:')) {
      // Convert data URL to file
      const response = await fetch(profileData.profileImage)
      const blob = await response.blob()
      const file = new File([blob], 'profile-image.jpg', { type: 'image/jpeg' })
      
      const uploadResult = await uploadPublicFn({ imageFile: file })
      imageUrl = uploadResult.url
    }

    await updateUserFn({
      id: user.id,
      name: profileData.name,
      designations: profileData.designation,
      interests: profileData.interest,
      profileImage: imageUrl,
      contactNumber: profileData.contact,
      company: profileData.company,
      country: profileData.country,
      specializations: profileData.specialization,
    })

    // Reset the manual update flag after successful save
    setImageManuallyUpdated(false)
    
    // Refetch user data to update the UI
    await refetch()
    
    setSaveMessage("Profile saved successfully!")
    setTimeout(() => setSaveMessage(""), 3000)
  } catch (error) {
    console.error("Failed to save profile:", error)
    setSaveMessage("Failed to save profile. Please try again.")
    setTimeout(() => setSaveMessage(""), 3000)
  } finally {
    setIsSavingProfile(false)
  }
}

  const handleSavePassword = async () => {
    // Validate passwords
    if (!passwordData.currentPassword) {
      setPasswordError("Current password is required")
      return
    }
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setPasswordError("New password and confirmation do not match")
      return
    }
    if (passwordData.newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long")
      return
    }

    setIsSavingPassword(true)
    try {
      // Note: You'll need to implement password change endpoint in your API
      // await changePasswordFn({
      //   currentPassword: passwordData.currentPassword,
      //   newPassword: passwordData.newPassword
      // })
      
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setPasswordData({ currentPassword: "", newPassword: "", confirmNewPassword: "" })
      setPasswordError("")
      setSaveMessage("Password updated successfully!")
      setTimeout(() => setSaveMessage(""), 3000)
    } catch (error) {
      setPasswordError("Failed to update password. Please try again.")
    } finally {
      setIsSavingPassword(false)
    }
  }

  const handleInputChange = (field: string, value: string | string[]) => {
    setProfileData(prev => ({ ...prev, [field]: value }))
  }

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }))
    setPasswordError("")
  }

 const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0]
  if (file) {
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setSaveMessage("Image size exceeds 5MB limit.")
      setTimeout(() => setSaveMessage(""), 3000)
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      setProfileData(prev => ({ ...prev, profileImage: e.target?.result as string }))
      setAvatarBroken(false)
      setImageManuallyUpdated(true) // Mark that image was manually updated
    }
    reader.readAsDataURL(file)
  }
}

  if (!isFetched || userLoading) {
    return (
    <>
      <Navbar />
      <NavbarMobile left={undefined} />
      <LoadingSkeleton/>
    </>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <NavbarMobile left={undefined} />
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
          <p className="text-gray-600">Update your Profile Information</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            {/* Profile Image Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Picture</h2>
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-3 border-gray-200 overflow-hidden bg-gradient-to-br from-emerald-400 to-teal-500">
                    {!profileData.profileImage || avatarBroken ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <PersonIcon className="w-10 h-10 text-white" />
                      </div>
                    ) : (
                      <Image
                        src={profileData.profileImage}
                        alt="Profile"
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                        onError={() => setAvatarBroken(true)}
                        priority
                      />
                    )}
                  </div>
                  <label className="absolute -bottom-2 -right-2 bg-emerald-500 rounded-full p-2 cursor-pointer hover:bg-emerald-600 transition-colors shadow-lg">
                    <CameraIcon className="w-4 h-4 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <div>
                  <p className="font-medium text-gray-900 mb-1">Upload Profile Picture</p>
                  <p className="text-sm text-gray-600">JPG or PNG. Max size 3MB.</p>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm hover:border-gray-400 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm hover:border-gray-400 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Number</label>
                  <input
                    type="tel"
                    value={profileData.contact}
                    onChange={(e) => handleInputChange('contact', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm hover:border-gray-400 transition-colors"
                  />
                </div>

                <div>
                  <Dropdown
                    label="Country"
                    value={profileData.country}
                    options={COUNTRY_LIST.map(c => c.value)}
                    onChange={(value) => handleInputChange('country', value as string)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <Dropdown
                    label="Designation"
                    value={profileData.designation}
                    options={professions.map(p => p.name)}
                    onChange={(value) => handleInputChange('designation', value)}
                    multiple
                    idToNameMap={professionMap}
                    />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Company/Institution</label>
                  <input
                    type="text"
                    value={profileData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm hover:border-gray-400 transition-colors"
                  />
                </div>

                <div>
                    {/* <div>
                    <Dropdown
                        label="Specialization"
                        value={profileData.specialization}
                        options={specialists.map(s => s.name)}
                        onChange={(value) => handleInputChange('specialization', value)}
                        multiple // Allow multiple selections
                        idToNameMap={specialistMap}
                    />
                    </div> */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Specialization</label>
                    <input
                        type="text"
                        value={profileData.specialization}
                        onChange={(e) => handleInputChange('specialization', e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm hover:border-gray-400 transition-colors"
                    />
                    </div>
                </div>

                <div>
                   <Dropdown
                    label="Areas of Interest"
                    value={profileData.interest}
                    options={specialists.map(s => s.name)}
                    onChange={(value) => handleInputChange('interest', value)}
                    multiple
                    idToNameMap={specialistMap}
                    />
                </div>
              </div>
            </div>

            {/* Save Button and Message */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              {saveMessage && (
                <div className="flex items-center text-emerald-600">
                  <CheckIcon className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">{saveMessage}</span>
                </div>
              )}
              <div className="ml-auto">
                <button
                  onClick={handleSaveProfile}
                  disabled={isSavingProfile}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center"
                >
                  {isSavingProfile ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      Save Changes
                      <ArrowRightIcon className="w-4 h-4 ml-2" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Password Change Section */}
        <div className="bg-white rounded-lg shadow-sm border mt-6">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Current Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm hover:border-gray-400 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  New Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm hover:border-gray-400 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Confirm New Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={passwordData.confirmNewPassword}
                  onChange={(e) => handlePasswordChange('confirmNewPassword', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm hover:border-gray-400 transition-colors"
                  required
                />
              </div>
              {passwordError && (
                <div className="md:col-span-3 text-sm text-red-600">{passwordError}</div>
              )}
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleSavePassword}
                disabled={isSavingPassword}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center"
              >
                {isSavingPassword ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Saving...
                  </>
                ) : (
                  "Update Password"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Bottombar />
    </div>
  )
}