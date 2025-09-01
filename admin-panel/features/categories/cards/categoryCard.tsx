"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { CategoryData } from "@/types/data"
import {AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";

interface CategoryCardProps {
    category: CategoryData
    onDelete: (id: string) => void
    provided: any
    snapshot: any
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onDelete, provided, snapshot }) => {
    return (
        <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`${snapshot.isDragging ? "opacity-50" : ""}`}
        >
            <AccordionItem value={category.id} className="border rounded-lg mb-2">
                <Card>
                    <CardContent className="p-4">
                        <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-3">
                                    <h3 className="font-semibold">{category.name}</h3>
                                    <Badge variant="secondary">${category.price}</Badge>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Badge variant="outline">{category.profession?.length || 0} specialists</Badge>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>
                                                <Edit className="h-4 w-4 mr-2" />
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => onDelete(category.id)} className="text-destructive">
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        </AccordionTrigger>

                        <AccordionContent>
                            <div className="mt-4 space-y-2">
                                {category.profession?.map((prof) => (
                                    <div key={prof.id} className="flex items-center justify-between p-2 bg-muted rounded">
                                        <span className="text-sm">{prof.name}</span>
                                        <Badge variant="secondary">${prof.price}</Badge>
                                    </div>
                                ))}
                                {(!category.profession || category.profession.length === 0) && (
                                    <p className="text-sm text-muted-foreground">No specialists yet</p>
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
