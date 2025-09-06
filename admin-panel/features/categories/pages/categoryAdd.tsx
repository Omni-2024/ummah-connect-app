"use client"

import { useState } from "react"

import type React from "react"
import { useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import Button  from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useMutation } from "@tanstack/react-query"
import {Toast} from "@/components/base/Toast";
import { Plus, User } from "lucide-react"
import {invalidateQueries, queryClient} from "@/app/providers";

interface CategoryAddEditPopupProps {
    open: boolean
    action: "add" | "edit"
    type: string
    onClose: () => void
    mutationFn: (data: any) => Promise<any>
    mutationParams?: any
    initialValue?: string
}

const CategoryAddEditPopup: React.FC<CategoryAddEditPopupProps> = ({
                                                                       open,
                                                                       action,
                                                                       type,
                                                                       onClose,
                                                                       mutationFn,
                                                                       mutationParams,
                                                                       initialValue,
                                                                   }) => {
    const [name, setName] = useState("")

    useEffect(() => {
        if (open && initialValue) {
            setName(initialValue)
        } else if (open) {
            setName("")
        }
    }, [open, initialValue])

    const { mutate, isPending } = useMutation({
        mutationFn,
        onSuccess: () => {
            invalidateQueries(["categories"]);
            Toast.success(`${type} ${action === "add" ? "added" : "updated"} successfully`)
            onClose()
            setName("")
        },
        onError: () => {
            Toast.error(`Failed to ${action} ${type}`)
        },
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) return

        mutate({
            name: name.trim(),
            ...mutationParams,
        })
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="text-center pb-4">
                    {/* <div className="mx-auto w-12 h-12 rounded-lg flex items-center justify-center mb-3 shadow-sm"> */}
                        {/* {type.includes("professional") ? (
                            <User className="h-6 w-6 text-white" />
                        ) : (
                            <Plus className="h-6 w-6 text-white" />
                        )} */}
                    {/* </div> */}
                    <DialogTitle className="text-xl font-semibold text-gray-900">
                        {action === "add" ? "Add New" : "Edit"} {type}
                    </DialogTitle>
                    <p className="text-sm text-gray-500 mt-1">
                        {action === "add" ? `Create a new ${type}` : `Update the ${type} details`}
                    </p>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 p-3">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                            {type} Name
                        </Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={`Enter ${type} name`}
                            className="h-11 border-gray-200 focus:border-cyan-400 focus:ring-cyan-400"
                            required
                        />
                    </div>

                    <DialogFooter className="gap-3 pt-4">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            className="flex-1 h-11 border-gray-200 hover:bg-gray-50 bg-transparent"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending || !name.trim()}
                            className="flex-1 h-11 bg-gradient-to-br from-[#669f9d] to-[#337f7c] hover:from-cyan-600 hover:to-blue-700 text-white shadow-sm"
                        >
                            {isPending ? "Saving..." : action === "add" ? `Add ${type}` : `Update ${type}`}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default CategoryAddEditPopup
