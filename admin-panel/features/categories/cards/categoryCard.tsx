"use client"

import type React from "react"
import { useMemo, useState } from "react"
import { Plus, Users, GripVertical, Trash2 } from "lucide-react"
import { Edit, MinusCirlce, TagRight,Trash } from "iconsax-react";


import { Card, CardContent } from "@/components/ui/card"
import Button from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import type { CategoryData } from "@/types/data"

import CategoryAddEditPopup from "../pages/CategoryAddEditPopup"

import {
  updateCategoryNameFn,
  updateSecondaryCategoryNameFn,
} from "@/lib/endpoints/categoriesFns"

interface CategoryCardProps {
  category: CategoryData
  onDelete: (id: string) => void
  onAddProfession: (categoryId: string) => void
  onDeleteSpecialist?: (specialistId: string) => void
  provided: any
  snapshot: any
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onDelete,
  onAddProfession,
  onDeleteSpecialist,
  provided,
  snapshot,
}) => {
  // --- PROFESSION modal state ---
  const [showEditProfession, setShowEditProfession] = useState(false)

  // --- SPECIALIST modal state ---
  const [specToEditId, setSpecToEditId] = useState<string | null>(null)
  const specToEdit = useMemo(
    () => category.specialists?.find((s: any) => s.id === specToEditId) ?? null,
    [specToEditId, category.specialists]
  )
  const [showEditSpecialist, setShowEditSpecialist] = useState(false)

  // open profession modal
  const openProfessionEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowEditProfession(true)
  }

  // open specialist modal
  const openSpecialistEdit = (id: string) => {
    setSpecToEditId(id)
    setShowEditSpecialist(true)
  }

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      className={`transition-all duration-200 ${
        snapshot.isDragging ? "opacity-95 scale-[1.01]" : ""
      }`}
    >
      <AccordionItem value={category.id} className="border-0 mb-3">
        <Card className="group hover:shadow-sm transition-all duration-200 border border-border/50 hover:border-primary/30 bg-gradient-to-r from-slate-50 to-white ">
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
                    <div className="w-10 h-10 bg-gradient-to-br from-[#669f9d] to-[#337f7c] rounded-lg flex items-center justify-center shadow-sm">
                      <Users className="h-5 w-5 text-white" />
                    </div>

                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-base text-foreground">{category.name}</h3>
                        {/* Edit Profession (Category) */}
                       {/* <Button
                        size="sm"
                        variant="primary"
                        onClick={openProfessionEdit}
                        className="h-6 w-6 p-0 text-black"
                    >
                        <Edit2 className="h-3 w-3" />
                    </Button> */}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {category.specialists?.length || 0} specialist
                        {(category.specialists?.length || 0) !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="bg-cyan-50 text-[#446576]"
                  >
                    {category.specialists?.length || 0} items
                  </Badge>

                  <Button
                        size="sm"
                        variant="unstyled"
                        onClick={openProfessionEdit}
                        className="h-6 w-6 p-0 text-black"
                    >
                        <Edit color="black" size={20}  />
                    </Button>

                  <Button
                    variant="unstyled"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(category.id)
                    }}
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash size={20} color="black" />
                  </Button>
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent className="px-4 pb-4">
              <div className="mt-2 space-y-2">
                {category.specialists?.map((specialist: any, index: number) => (
                  <div key={specialist.id} className="group/spec">
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg border border-border/30 transition-all duration-200 group hover:shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-gradient-to-br from-[#669f9d] to-[#337f7c] rounded-full flex items-center justify-center text-xs font-medium text-white shadow-sm">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium text-sm text-foreground">{specialist.name}</h4>
                          <p className="text-xs text-muted-foreground">Specialist</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="unstyled"
                          size="sm"
                          onClick={() => openSpecialistEdit(specialist.id)}
                          className="h-6 w-6 p-0 text-black"
                        >
                          <Edit size={20} color="black" />
                        </Button>
                        <Button
                          variant="unstyled"
                          size="sm"
                          onClick={() => 
                            onDeleteSpecialist?.(specialist.id)}
                          className="h-6 w-6 p-0 text-red-500 hover:bg-red-50"
                        >
                          <Trash size={20} color="black" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {(!category.specialists || category.specialists.length === 0) && (
                  <div className="text-center py-6">
                    <div className="mx-auto w-10 h-10 bg-gradient-to-br from-[#669f9d] to-[#337f7c] rounded-lg flex items-center justify-center mb-2 shadow-sm">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      No specialist added yet
                    </p>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onAddProfession(category.id)}
                      className="transition-colors duration-200"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Specialist
                    </Button>
                  </div>
                )}

                {category.specialists && category.specialists.length > 0 && (
                  <div className="flex justify-center pt-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onAddProfession(category.id)}
                      className="transition-all duration-200"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Specialist
                    </Button>
                  </div>
                )}
              </div>
            </AccordionContent>
          </CardContent>
        </Card>
      </AccordionItem>

      {/* ---------- Profession Edit Modal ---------- */}
      <CategoryAddEditPopup
        open={showEditProfession}
        action="edit"
        type="profession"
        initialValue={category.name}
        onClose={() => setShowEditProfession(false)}
        mutationFn={(payload) => updateCategoryNameFn({ id: category.id, name: payload.name })}
        onSuccess={(newName) => {
            // ✅ immutable update so React re-renders
            category.name = newName;
        }}
        />


      {/* ---------- Specialist Edit Modal ---------- */}
      <CategoryAddEditPopup
        open={showEditSpecialist}
        action="edit"
        type="specialist"
        initialValue={specToEdit?.name ?? ""}
        onClose={() => {
          setShowEditSpecialist(false)
          setSpecToEditId(null)
        }}
        mutationFn={(payload) =>
          updateSecondaryCategoryNameFn({
            id: specToEditId as string,
            name: payload.name,
            professionId: category.id,
          })
        }
        onSuccess={(newName) => {
          const idx =
            category.specialists?.findIndex((s: any) => s.id === specToEditId) ?? -1
          if (idx > -1 && category.specialists) {
            category.specialists[idx].name = newName
          }
        }}
      />
    </div>
  )
}

export default CategoryCard
