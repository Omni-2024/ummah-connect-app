"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export enum AddNewCardType {
    Click = "Click",
}

interface AddNewCardProps {
    name: string
    className?: string
    onClick: () => void
    type: AddNewCardType
}

const AddNewCard: React.FC<AddNewCardProps> = ({ name, className = "", onClick, type }) => {
    return (
        <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
            <CardContent className="p-0">
                <Button
                    variant="ghost"
                    className={`w-full justify-start text-muted-foreground hover:text-foreground ${className}`}
                    onClick={onClick}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add {name}
                </Button>
            </CardContent>
        </Card>
    )
}

export default AddNewCard
