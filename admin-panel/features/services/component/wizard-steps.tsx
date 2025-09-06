"use client"

import { cn } from "@/lib/utils"

interface Step {
  number: number
  title: string
}

interface WizardStepsProps {
  steps: Step[]
  currentStep: number
}

export function WizardSteps({ steps, currentStep }: WizardStepsProps) {
  return (
    <div className="flex items-center justify-center py-6 bg-gray-50 border-b">
      <div className="flex items-center space-x-8">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                  step.number === currentStep
                    ? "bg-gradient-to-br from-[#669f9d] to-[#337f7c] text-white"
                    : step.number < currentStep
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-500",
                )}
              >
                {step.number}
              </div>
              <span
                className={cn(
                  "ml-3 text-sm font-medium transition-colors",
                  step.number === currentStep
                    ? "text-[#669f9d] to-[#337f7c]"
                    : step.number < currentStep
                      ? "text-green-600"
                      : "text-gray-400",
                )}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && <div className="w-16 h-px bg-gray-300 ml-8" />}
          </div>
        ))}
      </div>
    </div>
  )
}
