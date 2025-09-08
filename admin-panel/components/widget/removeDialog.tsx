"use client"

import type React from "react"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/base/alert-dialog"
import { Loader2 } from "lucide-react"

interface RemoveDialogProps {
    name: string
    open: boolean
    onClose: () => void
    onRemove: () => void
    loading?: boolean
}

const RemoveDialog: React.FC<RemoveDialogProps> = ({ name, open, onClose, onRemove, loading = false }) => {
    return (
        <AlertDialog open={open} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Remove {name}?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the {name}.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onRemove}
                        disabled={loading}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Remove
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default RemoveDialog
