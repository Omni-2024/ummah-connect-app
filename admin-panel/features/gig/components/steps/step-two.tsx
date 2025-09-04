"use client"

import type React from "react"

import Button from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import { useRef, useState } from "react"
import Image from "next/image"
import type { CreateServiceFnArgs } from "@/features/gig/types/gig-types"

interface StepTwoProps {
  formData: Partial<CreateServiceFnArgs>
  setFormData: (data: Partial<CreateServiceFnArgs>) => void
  onNext: () => void
  onPrevious: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export function StepTwo({
  formData,
  setFormData,
  onNext,
  onPrevious,
}: StepTwoProps) {
  const [newLearningPoint, setNewLearningPoint] = useState("")
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext()
  }

  const addLearningPoint = () => {
    if (newLearningPoint.trim()) {
      setFormData({
        ...formData,
        learningPoints: [
          ...(formData.learningPoints || []),
          newLearningPoint.trim(),
        ],
      })
      setNewLearningPoint("")
    }
  }

  const removeLearningPoint = (index: number) => {
    const updated =
      formData.learningPoints?.filter((_, i) => i !== index) || []
    setFormData({ ...formData, learningPoints: updated })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setFormData({ ...formData, coverImageUrl: url })
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Tell us about your gig
        </h2>
        <p className="text-gray-600">
          Provide detailed information about your service offering
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label
              htmlFor="title"
              className="text-base font-medium text-gray-700"
            >
              Gig Title *
            </Label>
            <Input
              id="title"
              value={formData.title || ""}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="I will create a professional logo design"
              className="mt-2 h-12"
              required
            />
          </div>

          <div>
            <Label
              htmlFor="price"
              className="text-base font-medium text-gray-700"
            >
              Starting Price *
            </Label>
            <Input
              id="price"
              type="number"
              value={formData.price || ""}
              onChange={(e) =>
                setFormData({ ...formData, price: Number(e.target.value) })
              }
              placeholder="50"
              className="mt-2 h-12"
              required
            />
          </div>
        </div>

        <div>
          <Label
            htmlFor="tagline"
            className="text-base font-medium text-gray-700"
          >
            Tagline *
          </Label>
          <Input
            id="tagline"
            value={formData.tagline || ""}
            onChange={(e) =>
              setFormData({ ...formData, tagline: e.target.value })
            }
            placeholder="Professional Islamic-themed designs that inspire"
            className="mt-2 h-12"
            required
          />
        </div>

        <div>
          <Label
            htmlFor="description"
            className="text-base font-medium text-gray-700"
          >
            Description *
          </Label>
          <Textarea
            id="description"
            value={formData.description || ""}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Describe your service in detail..."
            className="mt-2 min-h-[120px]"
            required
          />
        </div>

        <div>
          <Label
            htmlFor="cmePoints"
            className="text-base font-medium text-gray-700"
          >
            CME Points
          </Label>
          <Input
            id="cmePoints"
            type="number"
            value={formData.cmePoints || ""}
            onChange={(e) =>
              setFormData({ ...formData, cmePoints: Number(e.target.value) })
            }
            placeholder="0"
            className="mt-2 h-12"
          />
        </div>

        {/* Cover Image Upload */}
        <div>
          <Label
            htmlFor="coverImage"
            className="text-base font-medium text-gray-700"
          >
            Cover Image
          </Label>

          <input
            type="file"
            id="coverImage"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="mt-2 flex items-center gap-4">
            {formData.coverImageUrl && (
              <div className="relative w-32 h-20 rounded-lg overflow-hidden border">
                <Image
                  src={formData.coverImageUrl}
                  alt="Cover Preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <Button
              type="button"
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
            >
              {formData.coverImageUrl ? "Change Image" : "Upload Image"}
            </Button>
          </div>
        </div>

        <div>
          <Label className="text-base font-medium text-gray-700">
            Learning Points
          </Label>
          <div className="mt-2 space-y-3">
            <div className="flex gap-2">
              <Input
                value={newLearningPoint}
                onChange={(e) => setNewLearningPoint(e.target.value)}
                placeholder="Add a learning point"
                className="flex-1"
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addLearningPoint())
                }
              />
              <Button
                type="button"
                onClick={addLearningPoint}
                size="icon"
                variant="primary"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.learningPoints?.map((point, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {point}
                  <button
                    type="button"
                    onClick={() => removeLearningPoint(index)}
                    className="ml-1 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <Label
              htmlFor="discountEnabled"
              className="text-base font-medium text-gray-700"
            >
              Enable Discount
            </Label>
            <p className="text-sm text-gray-500">
              Offer a promotional discount
            </p>
          </div>
          <Switch
            id="discountEnabled"
            checked={formData.discountEnabled || false}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, discountEnabled: checked })
            }
          />
        </div>

        {formData.discountEnabled && (
          <div>
            <Label
              htmlFor="discount"
              className="text-base font-medium text-gray-700"
            >
              Discount Percentage
            </Label>
            <Input
              id="discount"
              type="number"
              value={formData.discount || ""}
              onChange={(e) =>
                setFormData({ ...formData, discount: Number(e.target.value) })
              }
              placeholder="10"
              className="mt-2 h-12"
              min="0"
              max="100"
            />
          </div>
        )}

        <div className="flex justify-between pt-6">
          <Button type="button" variant="primary" onClick={onPrevious}>
            Previous
          </Button>
          <Button
            type="submit"
            className="bg-cyan-500 hover:bg-orange-600 text-white px-8"
            disabled={
              !formData.title ||
              !formData.tagline ||
              !formData.description ||
              !formData.price
            }
          >
            Continue
          </Button>
        </div>
      </form>
    </div>
  )
}
