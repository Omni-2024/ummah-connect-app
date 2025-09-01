"use client"

import type React from "react"
import { useState } from "react"
import { Plus, Users, GripVertical, Edit2, Trash2, Save, X } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import type { CategoryData } from "@/types/data"

interface CategoryCardProps {
    category: CategoryData
    onDelete: (id: string) => void
    onAddProfession: (categoryId: string) => void
    onEditSpecialist?: (specialistId: string, newName: string) => void
    onDeleteSpecialist?: (specialistId: string) => void
    provided: any
    snapshot: any
}

const CategoryCard: React.FC<CategoryCardProps> = ({
                                                       category,
                                                       onDelete,
                                                       onAddProfession,
                                                       onEditSpecialist,
                                                       onDeleteSpecialist,
                                                       provided,
                                                       snapshot,
                                                   }) => {
    const [editingSpecialist, setEditingSpecialist] = useState<string | null>(null)
    const [editName, setEditName] = useState("")

    const handleEditStart = (specialist: any) => {
        setEditingSpecialist(specialist.id)
        setEditName(specialist.name)
    }

    const handleEditSave = () => {
        if (editingSpecialist && onEditSpecialist) {
            onEditSpecialist(editingSpecialist, editName)
        }
        setEditingSpecialist(null)
        setEditName("")
    }

    const handleEditCancel = () => {
        setEditingSpecialist(null)
        setEditName("")
    }

    return (
        <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={`transition-all duration-200 ${snapshot.isDragging ? "opacity-95 scale-[1.01]" : ""}`}
        >
            <AccordionItem value={category.id} className="border-0 mb-3">
                <Card className="group hover:shadow-sm transition-all duration-200 border border-border/50 hover:border-primary/30 bg-gradient-to-r from-slate-50 to-white">
                    <CardContent className="p-0">
                        <AccordionTrigger className="hover:no-underline p-4">
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-3">
                                    <div
                                        {...provided.dragHandleProps}
                                        className="p-1.5 rounded-md hover:bg-muted/50 cursor-grab active:cursor-grabbing transition-colors"
                                    >
                                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                                            <Users className="h-5 w-5 text-white" />
                                        </div>
                                        <div className="text-left">
                                            <h3 className="font-semibold text-base text-foreground">{category.name}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {category.specialists?.length || 0} specialists
                                                {(category.specialists?.length || 0) !== 1 ? "s" : ""}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="bg-cyan-50 text-cyan-700 border-cyan-200">
                                        {category.specialists?.length || 0} items
                                    </Badge>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onDelete(category.id)
                                        }}
                                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600 hover:bg-red-50"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </AccordionTrigger>

                        <AccordionContent className="px-4 pb-4">
                            <div className="mt-2 space-y-2">
                                {category.specialists?.map((specialist, index) => (
                                    <div key={specialist.id} className="group/spec">
                                        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg border border-border/30 hover:from-cyan-50 hover:to-blue-600 transition-all duration-200">
                                            <div className="flex items-center gap-3">
                                                <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-xs font-medium text-white shadow-sm">
                                                    {index + 1}
                                                </div>
                                                <div className="flex-1">
                                                    {editingSpecialist === specialist.id ? (
                                                        <div className="flex items-center gap-2">
                                                            <Input
                                                                value={editName}
                                                                onChange={(e) => setEditName(e.target.value)}
                                                                className="h-8 text-sm border-cyan-200 focus:border-cyan-400"
                                                                autoFocus
                                                            />
                                                            <Button
                                                                size="sm"
                                                                onClick={handleEditSave}
                                                                className="h-8 w-8 p-0 bg-green-500 hover:bg-green-600"
                                                            >
                                                                <Save className="h-3 w-3" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={handleEditCancel}
                                                                className="h-8 w-8 p-0 hover:bg-red-50 text-red-500"
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <h4 className="font-medium text-sm text-foreground">{specialist.name}</h4>
                                                            <p className="text-xs text-muted-foreground">Professional</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {editingSpecialist !== specialist.id && (
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleEditStart(specialist)}
                                                        className="h-6 w-6 p-0 opacity-0 group-hover/spec:opacity-100 transition-opacity hover:bg-cyan-50 text-cyan-600"
                                                    >
                                                        <Edit2 className="h-3 w-3" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => onDeleteSpecialist?.(specialist.id)}
                                                        className="h-6 w-6 p-0 opacity-0 group-hover/spec:opacity-100 transition-opacity hover:bg-red-50 text-red-500"
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {(!category.specialists || category.specialists.length === 0) && (
                                    <div className="text-center py-6">
                                        <div className="mx-auto w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mb-2 shadow-sm">
                                            <Users className="h-5 w-5 text-white" />
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-3">No professionals added yet</p>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onAddProfession(category.id)}
                                            className="hover:bg-cyan-500 hover:text-white border-cyan-200 text-cyan-600 transition-colors duration-200"
                                        >
                                            <Plus className="h-3 w-3 mr-1" />
                                            Add Professional
                                        </Button>
                                    </div>
                                )}

                                {category.specialists && category.specialists.length > 0 && (
                                    <div className="flex justify-center pt-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onAddProfession(category.id)}
                                            className="text-cyan-600 hover:bg-cyan-50 transition-all duration-200"
                                        >
                                            <Plus className="h-3 w-3 mr-1" />
                                            Add Professional
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </AccordionContent>
                    </CardContent>
                </Card>
            </AccordionItem>
        </div>
    )
}

export default CategoryCard
