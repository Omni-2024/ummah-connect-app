"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Button from "@/components/ui/button"
import { X } from "lucide-react"
import { WizardSteps } from "./wizard-steps"
import { StepOne } from "./steps/step-one"
import { StepTwo } from "./steps/step-two"
import { StepThree } from "./steps/step-three"
import type { CreateServiceFnArgs } from "@/features/gig/types/gig-types"

interface CreateGigWizardProps {
  onClose: () => void
}

export function CreateGigWizard({ onClose }: CreateGigWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<Partial<CreateServiceFnArgs>>({
    learningPoints: [],
    discount: 0,
    discountEnabled: false,
  })

  const steps = [
    { number: 1, title: "Provider & Specialty", component: StepOne },
    { number: 2, title: "Gig Details", component: StepTwo },
    { number: 3, title: "Publish", component: StepThree },
  ]

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSaveDraft = () => {
    console.log("Saving as draft:", formData)
    // Implement draft saving logic
  }

  const CurrentStepComponent = steps[currentStep - 1].component

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white">
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <div className="flex items-center gap-4">
            <CardTitle className="text-2xl font-bold">Create New Gig</CardTitle>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSaveDraft}
              className="text-orange-600 border-orange-200 hover:bg-cyan-50 bg-transparent"
            >
              Save as Draft
            </Button>
          </div>
          <Button variant="secondary" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>

        <CardContent className="p-0">
          {/* Wizard Steps */}
          <WizardSteps steps={steps} currentStep={currentStep} />

          {/* Step Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <CurrentStepComponent
              formData={formData}
              setFormData={setFormData}
              onNext={handleNext}
              onPrevious={handlePrevious}
              isFirstStep={currentStep === 1}
              isLastStep={currentStep === steps.length}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
