"use client"

import Button from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, FileText, DollarSign } from "lucide-react"
import type { CreateServiceFnArgs } from "@/features/services/types/gig-types"

interface StepThreeProps {
  formData: Partial<CreateServiceFnArgs>
  setFormData: (data: Partial<CreateServiceFnArgs>) => void
  onNext: () => void
  onPrevious: () => void
  onPublish?: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export function StepThree({ formData, onPrevious, onPublish }: StepThreeProps) {
  const handlePublish = () => {
    if (onPublish) {
      onPublish()
    }
  }

  const handleSaveDraft = () => {
    console.log("Saving as draft:", formData)
    // This will be handled by the wizard's save draft function
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review and Publish</h2>
        <p className="text-gray-600">Review your gig details before publishing or saving as draft</p>
      </div>

      {/* Gig Preview */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{formData.title || "Untitled Gig"}</h3>
              <p className="text-gray-600">{formData.tagline || "No tagline provided"}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="font-medium">${formData.price || 0}</span>
              </div>
              {formData.cmePoints && formData.cmePoints > 0 && (
                <Badge variant="secondary">{formData.cmePoints} CME Points</Badge>
              )}
              {formData.discountEnabled && <Badge className="bg-red-100 text-red-800">{formData.discount}% OFF</Badge>}
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Description</h4>
              <p className="text-gray-600 text-sm">{formData.description || "No description provided"}</p>
            </div>

            {formData.learningPoints && formData.learningPoints.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Learning Points</h4>
                <div className="flex flex-wrap gap-2">
                  {formData.learningPoints.map((point, index) => (
                    <Badge key={index} variant="outline">
                      {point}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button type="button" variant="primary" onClick={onPrevious}>
          Previous
        </Button>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="primary"
            onClick={handleSaveDraft}
            className="flex items-center gap-2 bg-transparent"
          >
            <FileText className="h-4 w-4" />
            Save as Draft
          </Button>
          <Button
            type="button"
            onClick={handlePublish}
            className="bg-green-600 hover:bg-green-700 text-white px-8 flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Publish Gig
          </Button>
        </div>
      </div>
    </div>
  )
}
