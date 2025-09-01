"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useMutation } from "@tanstack/react-query"

interface CategoryAddEditPopupProps {
    open: boolean
    action: "add" | "edit"
    type: string
    onClose: () => void
    mutationFn: (data: any) => Promise<any>
    mutationParams?: any
}

const CategoryAddEditPopup: React.FC<CategoryAddEditPopupProps> = ({
                                                                       open,
                                                                       action,
                                                                       type,
                                                                       onClose,
                                                                       mutationFn,
                                                                       mutationParams,
                                                                   }) => {
    const [name, setName] = useState("")
    const [price, setPrice] = useState("")

    const { mutate, isPending } = useMutation({
        mutationFn,
        onSuccess: () => {
            // invalidateQueries(["categories"])
            // Toast.success(`${type} ${action === "add" ? "added" : "updated"} successfully`)
            onClose()
            setName("")
            setPrice("")
        },
        onError: () => {
            // Toast.error(`Failed to ${action} ${type}`)
        },
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        mutate({
            name,
            price: Number.parseFloat(price) || 0,
            ...mutationParams,
        })
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {action === "add" ? "Add" : "Edit"} {type}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={`Enter ${type} name`}
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="price">Price</Label>
                        <Input
                            id="price"
                            type="number"
                            step="0.01"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="0.00"
                            required
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Saving..." : action === "add" ? "Add" : "Update"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default CategoryAddEditPopup
