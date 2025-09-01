"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import  Button  from "@/components/ui/button"
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
        <Card className="border-2 border-dashed border-border hover:border-primary/50 transition-all duration-200 hover:shadow-sm group">
            <CardContent className="p-0">
                <Button
                    variant="primary"
                    className={`w-full justify-center text-muted-foreground hover:text-primary group-hover:bg-primary/5 transition-all duration-200 ${className}`}
                    onClick={onClick}
                >
                    <div className="flex flex-col items-center gap-2 py-4">
                        <div className="p-3 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                            <Plus className="h-5 w-5 text-primary" />
                        </div>
                        <span className="font-medium">Add {name}</span>
                        <span className="text-xs text-muted-foreground">Click to create new category</span>
                    </div>
                </Button>
            </CardContent>
        </Card>
    )
}

export default AddNewCard
