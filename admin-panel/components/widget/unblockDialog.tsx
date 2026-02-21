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

interface UnblockDialogProps {
    name: string
    open: boolean
    onClose: () => void
    onRemove: () => void
    loading?: boolean
}

const UnblockDialog: React.FC<UnblockDialogProps> = ({ name, open, onClose, onRemove, loading = false }) => {
    return (
        <AlertDialog open={open} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle> Unblock</AlertDialogTitle>
                    <AlertDialogDescription>
                        {`This will remove the restriction on ${name}. They will be able to access their account and use the platform again.`}
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
                        Unblock

                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default UnblockDialog
