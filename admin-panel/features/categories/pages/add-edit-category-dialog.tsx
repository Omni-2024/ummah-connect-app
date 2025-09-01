"use client"

import { useState, useEffect } from "react"
import  Button  from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Category {
    id: string
    name: string
    price: number
    specialist: any[]
}

interface AddEditCategoryDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    category?: Category | null
    onSave: (data: { name: string; price: number }) => void
}

export function AddEditCategoryDialog({ open, onOpenChange, category, onSave }: AddEditCategoryDialogProps) {
    const [name, setName] = useState("")
    const [price, setPrice] = useState("")

    useEffect(() => {
        if (category) {
            setName(category.name)
            setPrice(category.price.toString())
        } else {
            setName("")
            setPrice("")
        }
    }, [category])

    const handleSave = () => {
        if (name.trim() && price.trim()) {
            onSave({
                name: name.trim(),
                price: Number.parseFloat(price),
            })
            onOpenChange(false)
            setName("")
            setPrice("")
        }
    }

    const handleCancel = () => {
        onOpenChange(false)
        setName("")
        setPrice("")
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{category ? "Edit Category" : "Add New Category"}</DialogTitle>
                    <DialogDescription>
                        {category ? "Update the category details below." : "Enter the details for the new category."}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="col-span-3"
                            placeholder="Enter category name"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="price" className="text-right">
                            Price
                        </Label>
                        <Input
                            id="price"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="col-span-3"
                            placeholder="Enter base price"
                            min="0"
                            step="0.01"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="secondary" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={!name.trim() || !price.trim()}
                        className="bg-teal-600 hover:bg-teal-700"
                    >
                        {category ? "Update" : "Add"} Category
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
