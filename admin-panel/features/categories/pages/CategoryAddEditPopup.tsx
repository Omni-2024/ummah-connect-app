"use client"

import { useState, useEffect } from "react"
import type React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import Button from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useMutation } from "@tanstack/react-query"
import { Toast } from "@/components/base/Toast"
import { invalidateQueries } from "@/app/providers"

type EntityType = "profession" | "specialist"
type ActionType = "add" | "edit"

interface CategoryAddEditPopupProps {
  open: boolean
  action: ActionType
  type: string
  onClose: () => void
  mutationFn: (payload: any) => Promise<any>
  mutationParams?: Record<string, any>
  initialValue?: string
  initialName?: string
  onSuccess?: (newName: string) => void
}

const titleMap: Record<EntityType, Record<ActionType, string>> = {
  profession: { add: "Add profession", edit: "Edit profession" },
  specialist: { add: "Add specialist", edit: "Edit specialist" },
}

const ctaMap: Record<EntityType, Record<ActionType, string>> = {
  profession: { add: "Create profession", edit: "Update profession" },
  specialist: { add: "Create specialist", edit: "Update specialist" },
}

const labelMap: Record<EntityType, string> = {
  profession: "Profession Name",
  specialist: "Specialist Name",
}

const CategoryAddEditPopup: React.FC<CategoryAddEditPopupProps> = ({
                                                                     open,
                                                                     action,
                                                                     type,
                                                                     onClose,
                                                                     mutationFn,
                                                                     mutationParams,
                                                                     initialValue,
                                                                     initialName,
                                                                     onSuccess,
                                                                   }) => {
  const normalizedType = (type || "").toLowerCase() as EntityType
  const [name, setName] = useState("")

  useEffect(() => {
    if (open) {
      setName(initialValue ?? initialName ?? "")
    }
  }, [open, initialValue, initialName])

  const { mutate, isPending } = useMutation({
    mutationFn,
    onSuccess: (data) => {
      const updatedName = data?.name ?? name
      invalidateQueries(["categories"])
      Toast.success(
          `${normalizedType} ${action === "add" ? "added" : "updated"} successfully`
      )
      onSuccess?.(updatedName)
      onClose()
      setName("")
    },
    onError: () => {
      Toast.error(`Failed to ${action} ${normalizedType}`)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    mutate({
      name: name.trim(),
      ...(mutationParams ?? {}),
    })
  }

  return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center pb-4">
            <DialogTitle className="text-xl font-semibold text-gray-900">
              {titleMap[normalizedType][action]}
            </DialogTitle>
            <p className="text-sm text-gray-500 mt-1">
              {action === "add"
                  ? `Create a new ${normalizedType}`
                  : `Update the ${normalizedType} details`}
            </p>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 p-3">
            <div className="space-y-2">
              <Label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700"
              >
                {labelMap[normalizedType]}
              </Label>
              <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={
                    normalizedType === "profession"
                        ? "e.g., Plumbing"
                        : "e.g., Pipe Fitter"
                  }
                  className="h-11 border-gray-200 focus:border-cyan-400 focus:ring-cyan-400"
                  disabled={isPending}
                  required
                  autoFocus
              />
            </div>

            <DialogFooter className="gap-3 pt-4">
              <Button
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                  className="flex-1 h-11 border-gray-200 hover:bg-gray-50 bg-transparent"
                  disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                  type="submit"
                  disabled={isPending || !name.trim()}
                  className="flex-1 h-11 bg-gradient-to-br from-[#669f9d] to-[#337f7c] hover:from-cyan-600 hover:to-blue-700 text-white shadow-sm"
              >
                {isPending
                    ? "Saving..."
                    : ctaMap[normalizedType][action]}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
  )
}

export default CategoryAddEditPopup
