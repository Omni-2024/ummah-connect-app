"use client"

import * as React from "react"
import { X, Plus } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import Button from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type EntityType = "profession" | "specialist"
type ActionType = "add" | "edit"

interface CategoryAddEditPopupProps {
  open: boolean
  action: ActionType
  type: string
  initialValue?: string
  initialName?: string
  onClose: () => void
  mutationFn: (payload: any) => Promise<any>
  mutationParams?: Record<string, any>
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

export default function CategoryAddEditPopup({
  open,
  action,
  type,
  initialValue,
  initialName,
  onClose,
  mutationFn,
  mutationParams,
  onSuccess,
}: CategoryAddEditPopupProps) {
  const normalizedType = (type || "").toLowerCase() as EntityType
  const [name, setName] = React.useState<string>(initialValue ?? initialName ?? "")

  const queryClient = useQueryClient()

  React.useEffect(() => {
    if (open) {
      setName(initialValue ?? initialName ?? "")
    }
  }, [open, initialValue, initialName])

  const mutation = useMutation({
    mutationFn: (payload: any) => mutationFn(payload),
    onSuccess: (data) => {
      // ✅ update UI instantly
      onSuccess?.(data?.name ?? name)
      // ✅ refresh categories from server
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      // ✅ close popup
      onClose()
    },
    onError: (err) => {
      console.error("Mutation error:", err)
    },
  })

  const handleSubmit = () => {
    const trimmed = name.trim()
    if (!trimmed) return
    const payload = { name: trimmed, ...(mutationParams ?? {}) }
    mutation.mutate(payload)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-[560px] max-w-[92vw] p-6">
        <div className="flex items-start justify-between">
          <div className="mx-auto mb-3 -mt-2 h-10 w-10 rounded-lg  grid place-items-center">
           </div>
          <button
            aria-label="Close"
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-100 transition-colors -mt-2 -mr-2"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <h3 className="text-xl font-semibold text-foreground">
          {titleMap[normalizedType][action]}
        </h3>
        <p className="text-sm text-muted-foreground mb-5">
          Update the {normalizedType} details
        </p>

        <label className="text-sm font-medium text-foreground mb-2 block">
          {labelMap[normalizedType]}
        </label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={normalizedType === "profession" ? "e.g., Plumbing" : "e.g., Pipe Fitter"}
          disabled={mutation.isPending}
          className="mb-6"
          autoFocus
        />

        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={mutation.isPending}
            className={cn("px-5")}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={mutation.isPending || !name.trim()}
            className="px-5 bg-gradient-to-br from-[#669f9d] to-[#337f7c] hover:from-cyan-600 hover:to-blue-700"
          >
            {ctaMap[normalizedType][action]}
          </Button>
        </div>
      </div>
    </div>
  )
}
