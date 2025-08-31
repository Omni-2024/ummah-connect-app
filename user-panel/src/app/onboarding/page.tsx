"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthState } from "@/features/auth/context/useAuthState"
import { setOnboardingCompleted } from "@/features/auth/context/AuthState"
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  BackpackIcon,
  HeartIcon,
  PersonIcon,
  GlobeIcon,
  HomeIcon,
  CameraIcon,
  UploadIcon,
  CheckIcon,
  Cross1Icon,
} from "@radix-ui/react-icons"
import { proxy, useSnapshot } from "valtio"

type OnboardingStep = "job" | "interests" | "profile"

interface JobInfo {
  role: string
  experience: string
  industry: string
}

interface InterestInfo {
  interests: string[]
  goals: string[]
}

interface ProfileInfo {
  phone: string
  specialization: string
  company: string
  country: string
  profilePicture: File | null
}

interface OnboardingState {
  currentStep: OnboardingStep
  isProcessing: boolean
  jobInfo: JobInfo
  interestInfo: InterestInfo
  profileInfo: ProfileInfo
}

// Valtio store
const onboardingStore = proxy<OnboardingState>({
  currentStep: "job",
  isProcessing: false,
  jobInfo: {
    role: "",
    experience: "",
    industry: "",
  },
  interestInfo: {
    interests: [],
    goals: [],
  },
  profileInfo: {
    phone: "",
    specialization: "",
    company: "",
    country: "",
    profilePicture: null,
  },
})

// Actions
const onboardingActions = {
  setCurrentStep: (step: OnboardingStep) => {
    onboardingStore.currentStep = step
  },

  setIsProcessing: (processing: boolean) => {
    onboardingStore.isProcessing = processing
  },

  updateJobInfo: (updates: Partial<JobInfo>) => {
    Object.assign(onboardingStore.jobInfo, updates)
  },

  updateInterestInfo: (updates: Partial<InterestInfo>) => {
    Object.assign(onboardingStore.interestInfo, updates)
  },

  updateProfileInfo: (updates: Partial<ProfileInfo>) => {
    Object.assign(onboardingStore.profileInfo, updates)
  },

  toggleInterest: (interest: string) => {
    const interests = onboardingStore.interestInfo.interests
    if (interests.includes(interest)) {
      onboardingStore.interestInfo.interests = interests.filter((i) => i !== interest)
    } else {
      onboardingStore.interestInfo.interests.push(interest)
    }
  },

  toggleGoal: (goal: string) => {
    const goals = onboardingStore.interestInfo.goals
    if (goals.includes(goal)) {
      onboardingStore.interestInfo.goals = goals.filter((g) => g !== goal)
    } else {
      onboardingStore.interestInfo.goals.push(goal)
    }
  },
}

const jobRoles = [
  "Software Developer",
  "Designer",
  "Product Manager",
  "Data Scientist",
  "Marketing Specialist",
  "Sales Professional",
  "Consultant",
  "Student",
  "Other",
]

const experienceLevels = [
  "Entry Level (0-2 years)",
  "Mid Level (3-5 years)",
  "Senior Level (6-10 years)",
  "Executive (10+ years)",
]

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Marketing",
  "Consulting",
  "Manufacturing",
  "Retail",
  "Media",
  "Non-profit",
  "Other",
]

const interestOptions = [
  "Professional Development",
  "Technology Trends",
  "Leadership",
  "Entrepreneurship",
  "Industry News",
  "Networking",
  "Skill Building",
  "Career Advancement",
  "Innovation",
  "Best Practices",
]

const goalOptions = [
  "Advance my career",
  "Learn new skills",
  "Build my network",
  "Start a business",
  "Find mentorship",
  "Share knowledge",
  "Stay updated on trends",
  "Improve leadership skills",
]

const countries = [
  "United States",
  "Canada",
  "United Kingdom",
  "Germany",
  "France",
  "Australia",
  "Japan",
  "Singapore",
  "India",
  "Brazil",
  "Other",
]

export default function OnboardingPage() {
  const router = useRouter()
  const { setIsFirstLogin } = useAuthState()
  const state = useSnapshot(onboardingStore)

  const handleJobContinue = () => {
    onboardingActions.setCurrentStep("interests")
  }

  const handleInterestsContinue = () => {
    onboardingActions.setCurrentStep("profile")
  }

  const handleFinish = async () => {
    onboardingActions.setIsProcessing(true)

    // Simulate API call to save onboarding data
    try {
      const onboardingData = {
        jobInfo: state.jobInfo,
        interestInfo: state.interestInfo,
        profileInfo: {
          ...state.profileInfo,
          profilePicture: state.profileInfo.profilePicture?.name || null,
        },
      }

      console.log("Saving onboarding data:", onboardingData)

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setOnboardingCompleted(true)
      router.push("/")
    } catch (error) {
      console.error("Error saving onboarding data:", error)
    } finally {
      onboardingActions.setIsProcessing(false)
    }
  }

  const handleSkipProfile = () => {
    setOnboardingCompleted(true)
    router.push("/")
  }

  if (state.isProcessing) {
    return <ProcessingScreen />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 rounded bg-gradient-to-br from-indigo-500 to-purple-600"></div>
              <span className="text-lg font-bold text-gray-900">Ummah Community</span>
            </div>
            <ProgressIndicator currentStep={state.currentStep} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          {state.currentStep === "job" && <JobInfoStep onContinue={handleJobContinue} />}
          {state.currentStep === "interests" && (
            <InterestsStep
              onContinue={handleInterestsContinue}
              onBack={() => onboardingActions.setCurrentStep("job")}
            />
          )}
          {state.currentStep === "profile" && (
            <ProfileStep
              onFinish={handleFinish}
              onSkip={handleSkipProfile}
              onBack={() => onboardingActions.setCurrentStep("interests")}
            />
          )}
        </div>
      </main>
    </div>
  )
}

function ProgressIndicator({ currentStep }: { currentStep: OnboardingStep }) {
  const steps = ["job", "interests", "profile"]
  const currentIndex = steps.indexOf(currentStep)

  return (
    <div className="flex items-center space-x-2">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
              index < currentIndex
                ? "bg-green-500 text-white"
                : index === currentIndex
                  ? "bg-indigo-500 text-white shadow-lg"
                  : "bg-gray-200 text-gray-500"
            }`}
          >
            {index < currentIndex ? <CheckIcon className="w-4 h-4" /> : index + 1}
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-8 h-0.5 mx-2 transition-all duration-300 ${
                index < currentIndex ? "bg-green-500" : "bg-gray-200"
              }`}
            ></div>
          )}
        </div>
      ))}
    </div>
  )
}

function JobInfoStep({ onContinue }: { onContinue: () => void }) {
  const state = useSnapshot(onboardingStore)
  const canContinue = state.jobInfo.role && state.jobInfo.experience && state.jobInfo.industry

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 transform transition-all duration-500 hover:shadow-2xl">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
          <BackpackIcon className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tell us about your professional background</h1>
        <p className="text-gray-600 text-lg">
          This helps us personalize your experience and connect you with relevant content and people.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">What's your current role?</label>
          <select
            value={state.jobInfo.role}
            onChange={(e) => onboardingActions.updateJobInfo({ role: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
          >
            <option value="">Select your role</option>
            {jobRoles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Experience level</label>
          <select
            value={state.jobInfo.experience}
            onChange={(e) => onboardingActions.updateJobInfo({ experience: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
          >
            <option value="">Select your experience level</option>
            {experienceLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
          <select
            value={state.jobInfo.industry}
            onChange={(e) => onboardingActions.updateJobInfo({ industry: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white transition-all duration-200 hover:border-gray-300"
          >
            <option value="">Select your industry</option>
            {industries.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={onContinue}
        disabled={!canContinue}
        className="w-full mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2 group"
      >
        Continue
        <ArrowRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" />
      </button>
    </div>
  )
}

function InterestsStep({
  onContinue,
  onBack,
}: {
  onContinue: () => void
  onBack: () => void
}) {
  const state = useSnapshot(onboardingStore)
  const canContinue = state.interestInfo.interests.length > 0 && state.interestInfo.goals.length > 0

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 transform transition-all duration-500 hover:shadow-2xl">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
          <HeartIcon className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">What are you interested in?</h1>
        <p className="text-gray-600 text-lg">
          Select your interests and goals to help us curate the best content for you.
        </p>
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            Your interests
            <span className="text-sm font-normal text-gray-500">
              (select at least 1 - {state.interestInfo.interests.length} selected)
            </span>
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {interestOptions.map((interest) => {
              const isSelected = state.interestInfo.interests.includes(interest)
              return (
                <button
                  key={interest}
                  onClick={() => onboardingActions.toggleInterest(interest)}
                  className={`p-4 rounded-xl border-2 text-sm font-medium transition-all duration-200 relative overflow-hidden group ${
                    isSelected
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-md"
                      : "border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex-1 text-left">{interest}</span>
                    {isSelected && <CheckIcon className="w-4 h-4 text-indigo-600" />}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            Your goals
            <span className="text-sm font-normal text-gray-500">
              (select at least 1 - {state.interestInfo.goals.length} selected)
            </span>
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {goalOptions.map((goal) => {
              const isSelected = state.interestInfo.goals.includes(goal)
              return (
                <button
                  key={goal}
                  onClick={() => onboardingActions.toggleGoal(goal)}
                  className={`p-4 rounded-xl border-2 text-sm font-medium text-left transition-all duration-200 group ${
                    isSelected
                      ? "border-purple-500 bg-purple-50 text-purple-700 shadow-md"
                      : "border-gray-200 text-gray-700 hover:border-purple-300 hover:bg-purple-50/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex-1">{goal}</span>
                    {isSelected && <CheckIcon className="w-4 h-4 text-purple-600" />}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 group"
        >
          <ArrowLeftIcon className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back
        </button>
        <button
          onClick={onContinue}
          disabled={!canContinue}
          className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2 group"
        >
          Continue
          <ArrowRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  )
}

function ProfileStep({
  onFinish,
  onSkip,
  onBack,
}: {
  onFinish: () => void
  onSkip: () => void
  onBack: () => void
}) {
  const state = useSnapshot(onboardingStore)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file")
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB")
        return
      }

      onboardingActions.updateProfileInfo({ profilePicture: file })

      // Clean up previous preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }

      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const removeProfilePicture = () => {
    onboardingActions.updateProfileInfo({ profilePicture: null })
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
  }

  const isFormValid =
    state.profileInfo.phone ||
    state.profileInfo.specialization ||
    state.profileInfo.company ||
    state.profileInfo.country ||
    state.profileInfo.profilePicture

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 transform transition-all duration-500 hover:shadow-2xl">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
          <PersonIcon className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Set up your profile</h1>
        <p className="text-gray-600 text-lg">
          Complete your profile to help others connect with you. All fields are optional.
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Picture */}
        <div className="text-center">
          <div className="mx-auto w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center mb-4 overflow-hidden relative group">
            {previewUrl ? (
              <>
                <img src={previewUrl || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
                <button
                  onClick={removeProfilePicture}
                  className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <Cross1Icon className="w-6 h-6 text-white" />
                </button>
              </>
            ) : (
              <CameraIcon className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer group">
            <UploadIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
            {previewUrl ? "Change Picture" : "Upload Profile Picture"}
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number <span className="text-gray-400">(optional)</span>
          </label>
          <input
            type="tel"
            value={state.profileInfo.phone}
            onChange={(e) => onboardingActions.updateProfileInfo({ phone: e.target.value })}
            placeholder="+1 (555) 123-4567"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
          />
        </div>

        {/* Specialization */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Specialization <span className="text-gray-400">(optional)</span>
          </label>
          <input
            type="text"
            value={state.profileInfo.specialization}
            onChange={(e) => onboardingActions.updateProfileInfo({ specialization: e.target.value })}
            placeholder="e.g., Frontend Development, Digital Marketing"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
          />
        </div>

        {/* Company */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company <span className="text-gray-400">(optional)</span>
          </label>
          <div className="relative">
            <HomeIcon className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={state.profileInfo.company}
              onChange={(e) => onboardingActions.updateProfileInfo({ company: e.target.value })}
              placeholder="Your current company"
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
            />
          </div>
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country <span className="text-gray-400">(optional)</span>
          </label>
          <div className="relative">
            <GlobeIcon className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            <select
              value={state.profileInfo.country}
              onChange={(e) => onboardingActions.updateProfileInfo({ country: e.target.value })}
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white transition-all duration-200 hover:border-gray-300"
            >
              <option value="">Select your country</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 group"
        >
          <ArrowLeftIcon className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back
        </button>
        <button
          onClick={onSkip}
          className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors hover:bg-gray-50 rounded-xl"
        >
          Skip for now
        </button>
        <button
          onClick={onFinish}
          className="flex-1 bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2 group"
        >
          {isFormValid ? "Complete Setup!" : "Let's Get Started!"}
          <ArrowRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  )
}

function ProcessingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12 text-center max-w-md mx-auto">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
          <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Setting up your account</h1>
        <p className="text-gray-600 mb-8 text-lg">
          Hang tight while we personalize your experience and prepare everything for you.
        </p>
        <div className="flex justify-center">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          </div>
        </div>

        {/* Progress steps preview */}
        <div className="mt-8 space-y-2 text-sm text-gray-500">
          <div className="flex items-center justify-center gap-2">
            <CheckIcon className="w-4 h-4 text-green-500" />
            <span>Processing your preferences</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Customizing your dashboard</span>
          </div>
          <div className="flex items-center justify-center gap-2 opacity-50">
            <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
            <span>Setting up your network</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Custom hook for onboarding state
export function useOnboardingState() {
  const state = useSnapshot(onboardingStore)
  return {
    state,
    actions: onboardingActions,
  }
}

// Validation utilities
export const onboardingValidation = {
  validateJobInfo: (jobInfo: JobInfo): boolean => {
    return !!(jobInfo.role && jobInfo.experience && jobInfo.industry)
  },

  validateInterests: (interestInfo: InterestInfo): boolean => {
    return interestInfo.interests.length > 0 && interestInfo.goals.length > 0
  },

  validateProfileInfo: (profileInfo: ProfileInfo): boolean => {
    // Profile is optional, but if any field is filled, return true
    return !!(
      profileInfo.phone ||
      profileInfo.specialization ||
      profileInfo.company ||
      profileInfo.country ||
      profileInfo.profilePicture
    )
  },

  validateStep: (step: OnboardingStep, state: OnboardingState): boolean => {
    switch (step) {
      case "job":
        return onboardingValidation.validateJobInfo(state.jobInfo)
      case "interests":
        return onboardingValidation.validateInterests(state.interestInfo)
      case "profile":
        return true // Profile is always valid since it's optional
      default:
        return false
    }
  },
}

// Types for external use
export type { OnboardingStep, JobInfo, InterestInfo, ProfileInfo, OnboardingState }
