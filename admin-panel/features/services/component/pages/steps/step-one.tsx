"use client"

import type React from "react"

import Button from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { CreateServiceFnArgs } from "@/features/services/types/gig-types"

interface StepOneProps {
  formData: Partial<CreateServiceFnArgs>
  setFormData: (data: Partial<CreateServiceFnArgs>) => void
  onNext: () => void
  onPrevious: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export function StepOne({ formData, setFormData, onNext, isFirstStep }: StepOneProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext()
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Which provider and specialty best describe your gig?</h2>
        <p className="text-gray-600">Select the provider and their area of expertise for this service</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="providerId" className="text-base font-medium text-gray-700">
              Provider *
            </Label>
            <Select
              value={formData.providerId || ""}
              onValueChange={(value) => setFormData({ ...formData, providerId: value })}
            >
              <SelectTrigger className="w-full h-12 mt-2">
                <SelectValue placeholder="Select a provider" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md z-50">
                <SelectItem value="provider1">Dr. Ahmed Hassan - Islamic Scholar</SelectItem>
                <SelectItem value="provider2">Fatima Ali - Content Writer</SelectItem>
                <SelectItem value="provider3">Omar Khan - App Developer</SelectItem>
                <SelectItem value="provider4">Aisha Rahman - Graphic Designer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="specialtyId" className="text-base font-medium text-gray-700">
              Specialty
            </Label>
            <Select
              value={formData.specialtyId || ""}
              onValueChange={(value) => setFormData({ ...formData, specialtyId: value })}
            >
              <SelectTrigger className="w-full h-12 mt-2">
                <SelectValue placeholder="Select specialty (optional)" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md z-50">
                <SelectItem value="quran-studies">Quran Studies</SelectItem>
                <SelectItem value="islamic-law">Islamic Law</SelectItem>
                <SelectItem value="arabic-language">Arabic Language</SelectItem>
                <SelectItem value="islamic-history">Islamic History</SelectItem>
                <SelectItem value="web-development">Web Development</SelectItem>
                <SelectItem value="mobile-apps">Mobile Applications</SelectItem>
                <SelectItem value="logo-design">Logo Design</SelectItem>
                <SelectItem value="content-writing">Content Writing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="professionId" className="text-base font-medium text-gray-700">
              Profession *
            </Label>
            <Select
              value={formData.professionId || ""}
              onValueChange={(value) => setFormData({ ...formData, professionId: value })}
            >
              <SelectTrigger className="w-full h-12 mt-2">
                <SelectValue placeholder="Select profession" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md z-50">
                <SelectItem value="scholar">Islamic Scholar</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="developer">Software Developer</SelectItem>
                <SelectItem value="designer">Graphic Designer</SelectItem>
                <SelectItem value="writer">Content Writer</SelectItem>
                <SelectItem value="consultant">Consultant</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <Button
            type="submit"
            className="bg-gradient-to-br from-[#669f9d] to-[#337f7c] hover:bg-orange-600 text-white px-8"
            disabled={!formData.providerId || !formData.professionId}
          >
            Continue
          </Button>
        </div>
      </form>
    </div>
  )
}
