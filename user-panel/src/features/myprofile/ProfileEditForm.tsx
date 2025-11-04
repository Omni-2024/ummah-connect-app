import React, { useState, useEffect } from "react"
import { PersonIcon, CameraIcon, CheckIcon, ArrowRightIcon } from "@radix-ui/react-icons"
import Image from "next/image"
import { buildAvatarUrl } from "@/features/app/components/Navbar"
import { updateUserFn, Gender } from "@/lib/endpoints/userFns"
import { getAllProfessionsFn, getAllSpecialistByProfessionIdFn } from "@/lib/endpoints/categoryFns"
import { COUNTRY_LIST, languages, COUNTRY_CODES } from "@/lib/constants"
import { uploadPublicFn } from "@/lib/endpoints/fileUploadFns"
import { Dropdown } from "@/features/myprofile/Dropdown"
import useIsMobile from "@/lib/hooks/useIsMobile"

interface ProfileEditFormProps {
  user: any
  refetch: () => void
}

export default function ProfileEditForm({ user, refetch }: ProfileEditFormProps) {
  const [avatarBroken, setAvatarBroken] = useState(false)
  
  // Data options state
  const [professions, setProfessions] = useState<Array<{id: string, name: string}>>([])
  const [specialists, setSpecialists] = useState<Array<{id: string, name: string}>>([])
  const [selectedProfessionId, setSelectedProfessionId] = useState("")
  const [imageManuallyUpdated, setImageManuallyUpdated] = useState(false)
  const [countryCode, setCountryCode] = useState("+44")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    contact: "",
    profileImage: "",
    gender: Gender.MALE,
    designation: [] as string[],
    interest: [] as string[],
    specialization: "",
    company: "",
    country: "",
    languages: [] as string[],
  })
  
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")
  const [professionMap, setProfessionMap] = useState<{[key: string]: string}>({})
  const [specialistMap, setSpecialistMap] = useState<{[key: string]: string}>({})
  const isMobile = useIsMobile()
  // Gender options
  const genderOptions = [
    { value: Gender.MALE, label: 'Male' },
    { value: Gender.FEMALE, label: 'Female' }
  ]

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

  // Sync profileData with user data when user is available
  useEffect(() => {
    if (user) {
      const avatarUrl = buildAvatarUrl(user.profileImage)
      
      // Parse existing contact number to extract country code and phone number
      const contact = user.contactNumber || ""
      if (contact) {
        // Find matching country code
        const matchedCode = COUNTRY_CODES.find(cc => contact.startsWith(cc.code))
        if (matchedCode) {
          setCountryCode(matchedCode.code)
          setPhoneNumber(contact.substring(matchedCode.code.length))
        } else {
          // If no match, treat entire number as phone number
          setPhoneNumber(contact)
        }
      }
      
      setProfileData(prev => ({
        name: user.name || "",
        email: user.email || "",
        contact: contact,
        profileImage: imageManuallyUpdated ? prev.profileImage : (avatarUrl || ""),
        gender: user.gender || Gender.MALE,
        designation: Array.isArray(user.designations) ? user.designations : [],
        interest: Array.isArray(user.interests) ? user.interests : [],
        specialization: user.specializations || "",
        company: user.company || "",
        country: user.country || "",
        languages: Array.isArray(user.languages) ? user.languages : [],
      }))

      if (user.designations && Array.isArray(user.designations) && user.designations.length > 0) {
        setSelectedProfessionId(user.designations[0])
      }
    }
  }, [user, imageManuallyUpdated])

  const handleSaveProfile = async () => {
    if (!user?.id) return

    // Combine country code and phone number
    const fullContact = phoneNumber ? `${countryCode}${phoneNumber}` : ""

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
        imageUrl = uploadResult.key
      }

      await updateUserFn({
        id: user.id,
        name: profileData.name,
        gender: profileData.gender,
        designations: profileData.designation,
        interests: profileData.interest,
        profileImage: imageUrl,
        contactNumber: fullContact,
        company: profileData.company,
        country: profileData.country,
        specializations: profileData.specialization,
        languages: profileData.languages,
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

  const handleInputChange = (field: string, value: string | string[] | Gender) => {
    setProfileData(prev => ({ ...prev, [field]: value }))
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

  return (
    <div className="bg-white">
      <div className="p-4 sm:p-6">
        {/* Profile Image Section */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Profile Picture</h2>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <div className="relative self-center sm:self-auto">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 sm:border-3 border-gray-200 overflow-hidden bg-gradient-to-br from-emerald-400 to-teal-500">
                {!profileData.profileImage || avatarBroken ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <PersonIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
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
              <label className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-emerald-500 rounded-full p-1.5 sm:p-2 cursor-pointer hover:bg-emerald-600 transition-colors shadow-lg">
                <CameraIcon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
            <div className="text-center sm:text-left">
              <p className="font-medium text-gray-900 mb-1 text-sm sm:text-base">Upload Profile Picture</p>
              <p className="text-xs sm:text-sm text-gray-600">JPG or PNG. Max size 3MB.</p>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
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
                readOnly
              />
            </div>
            <div>
              <Dropdown
                label="Languages"
                value={profileData.languages}
                options={languages.map(l => l.label)}
                onChange={(value) => handleInputChange('languages', value)}
                multiple
                maxHeight="200px"
              />
            </div>

            <div>
              <Dropdown
                label="Country"
                value={profileData.country}
                options={COUNTRY_LIST.map(c => c.value)}
                onChange={(value) => handleInputChange('country', value as string)}
                required
                maxHeight="200px"
              />
            </div>

            <div>
              <Dropdown
                label="Gender"
                value={profileData.gender}
                options={genderOptions.map(g => g.label)}
                onChange={(value) => {
                  const selectedGender = genderOptions.find(g => g.label === value)?.value || Gender.MALE
                  handleInputChange('gender', selectedGender)
                }}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 ">Contact Number</label>
              <div className="grid grid-cols-[140px_1fr] gap-2">
                <Dropdown
                  label=""
                  value={`${countryCode} ${COUNTRY_CODES.find(cc => cc.code === countryCode)?.country || ''}`}
                  options={COUNTRY_CODES.map(cc => `${cc.code} ${cc.country}`)}
                  onChange={(value) => {
                    if (typeof value === 'string') {
                      const code = value.split(' ')[0]
                      setCountryCode(code)
                    }
                  }}
                  maxHeight={isMobile ? "90px" : "100px"} 

                />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => {
                    // Only allow numbers
                    const value = e.target.value.replace(/\D/g, '')
                    setPhoneNumber(value)
                  }}
                  placeholder="712345678"
                  className="px-3 mt-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm hover:border-gray-400 transition-colors"
                />
              </div>
            </div>

            
          </div>
        </div>

        {/* Professional Information - Commented out as in original */}
        {/* <div className="mb-6 sm:mb-8">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Professional Information</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <Dropdown
                label="Designation"
                value={profileData.designation}
                options={professions.map(p => p.name)}
                onChange={(value) => handleInputChange('designation', value)}
                multiple
                idToNameMap={professionMap}
                maxHeight="200px"
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
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Specialization</label>
              <input
                type="text"
                value={profileData.specialization}
                onChange={(e) => handleInputChange('specialization', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm hover:border-gray-400 transition-colors"
              />
            </div>

            <div>
              <Dropdown
                label="Areas of Interest"
                value={profileData.interest}
                options={specialists.map(s => s.name)}
                onChange={(value) => handleInputChange('interest', value)}
                multiple
                idToNameMap={specialistMap}
                maxHeight="200px"
              />
            </div>
          </div>
        </div> */}

        {/* Save Button and Message */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 sm:pt-6 border-t border-gray-200 gap-3 sm:gap-0">
          {saveMessage && (
            <div className="flex items-center text-emerald-600 order-2 sm:order-1">
              <CheckIcon className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="text-sm font-medium">{saveMessage}</span>
            </div>
          )}
          <div className="order-1 sm:order-2 sm:ml-auto">
            <button
              onClick={handleSaveProfile}
              disabled={isSavingProfile}
              className="w-full sm:w-auto px-4 sm:px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
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
  )
}