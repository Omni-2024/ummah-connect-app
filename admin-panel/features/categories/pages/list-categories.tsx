"use client"

import type React from "react"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import type { CategoryData } from "@/types/data"
import { Accordion } from "@/components/ui/accordion"
import CategoryCard from "../cards/categoryCard"
import AddNewCard, { AddNewCardType } from "../cards/addNewCard"
import { useEffect, useState } from "react"
import CategoryAddEditPopup from "./categoryAdd"
import {
  addCategoryFn,
  removeCategoryFn,
  updateCategoryOrderFn,
  addSecondaryCategory,
  removeSecondaryCategory,
  updateSecondaryCategoryNameFn,
} from "@/lib/endpoints/categoriesFns"
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd"
import RemoveDialog from "@/components/widget/removeDialog"
import { invalidateQueries } from "@/app/providers"
import { Toast } from "@/components/base/Toast"

type ListCategoriesProps = {
  categories: CategoryData[]
}

export enum ProfessionCardPopupTypes {
  Add = "Add",
  Edit = "Edit",
  Delete = "Delete",
  AddSpeciality = "AddSpeciality",
  EditSpeciality = "EditSpeciality",
}

const ListCategories: React.FC<ListCategoriesProps> = ({ categories }) => {
  const [popupType, setPopupType] = useState<ProfessionCardPopupTypes | undefined>()
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>()
  const [editingSpecialist, setEditingSpecialist] = useState<
    { id: string; name: string; professionId: string } | undefined
  >()

  const [orderedCategories, setOrderedCategories] = useState<CategoryData[]>(
    categories.sort((a, b) => a.order - b.order)
  )

  const [deletingId, setDeletingId] = useState<string | undefined>()

  const { mutate: removeCategory, isPending: isDeleting } = useMutation({
    mutationFn: removeCategoryFn,
    onSuccess: () => {
      invalidateQueries(["categories"])
      Toast.success("Category removed successfully")
    },
    onError: () => {
      Toast.error("Failed to remove category")
    },
  })

  const { mutateAsync: updateCategoryOrderAsync, isPending: isUpdatingOrder } = useMutation({
    mutationFn: updateCategoryOrderFn,
    onSuccess: () => {
      invalidateQueries(["categories"])
      Toast.success("Category order updated successfully")
    },
    onError: () => {
      Toast.error("Failed to update category order")
    },
  })

  const { mutateAsync: addProfessionAsync, isPending: isAddingProfession } = useMutation({
    mutationFn: addSecondaryCategory,
    onSuccess: () => {
      invalidateQueries(["categories"])
      Toast.success("Professional added successfully")
      setPopupType(undefined)
      setSelectedCategoryId(undefined)
    },
    onError: () => {
      Toast.error("Failed to add professional")
    },
  })

  const { mutateAsync: editSpecialistAsync, isPending: isEditingSpecialist } = useMutation({
    mutationFn: updateSecondaryCategoryNameFn,
    onSuccess: () => {
      invalidateQueries(["categories"])
      Toast.success("Specialist updated successfully")
      setPopupType(undefined)
      setSelectedCategoryId(undefined)
      setEditingSpecialist(undefined)
    },
    onError: () => {
      Toast.error("Failed to update specialist")
    },
  })

  const { mutate: deleteSpecialist, isPending: isDeletingSpecialist } = useMutation({
    mutationFn: removeSecondaryCategory,
    onSuccess: () => {
      invalidateQueries(["categories"])
      Toast.success("Specialist deleted successfully")
    },
    onError: () => {
      Toast.error("Failed to delete specialist")
    },
  })

  useEffect(() => {
    setOrderedCategories(categories.sort((a, b) => a.order - b.order))
  }, [categories])

  return (
    <>
      <DragDropContext
        onDragEnd={async (result) => {
          if (!result.destination) {
            return
          }
          const items = Array.from(orderedCategories)
          const [reorderedItem] = items.splice(result.source.index, 1)
          items.splice(result.destination.index, 0, reorderedItem)
          setOrderedCategories(items)

          try {
            await updateCategoryOrderAsync({
              newData: items,
              oldData: categories,
            })
            // onSuccess handler will invalidate
          } catch (err) {
            // error handled in useMutation onError
          }
        }}
      >
        <Droppable droppableId="categories" direction="vertical">
          {(provided) => (
            <div ref={provided.innerRef}>
              <Accordion type="single" collapsible className="w-full flex flex-col py-4 px-4">
                {orderedCategories.map((category, _index) => (
                  <Draggable
                    key={category.id}
                    draggableId={category.id}
                    index={_index}
                    isDragDisabled={isUpdatingOrder}
                  >
                    {(provided, snapshot) => (
                      <CategoryCard
                        provided={provided}
                        snapshot={snapshot}
                        key={category.id}
                        category={category}
                        onDelete={(id) => {
                          setDeletingId(id)
                          setPopupType(ProfessionCardPopupTypes.Delete)
                        }}
                        onAddProfession={(categoryId) => {
                          setSelectedCategoryId(categoryId)
                          setPopupType(ProfessionCardPopupTypes.AddSpeciality)
                        }}
                        // onEditSpecialist={(specialistId, newName) => {
                        //   const specialist = category.specialists?.find((s) => s.id === specialistId)
                        //   if (specialist) {
                        //     setEditingSpecialist({
                        //       id: specialistId,
                        //       name: specialist.name,
                        //       professionId: specialist.professionId,
                        //     })
                        //     setSelectedCategoryId(category.id)
                        //     setPopupType(ProfessionCardPopupTypes.EditSpeciality)
                        //   }
                        // }}
                        onDeleteSpecialist={(specialistId) => {
                          deleteSpecialist(specialistId)
                        }}
                      />
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Accordion>
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className="px-4">
        <AddNewCard
          name="new profession"
          className="py-4 flex-row text-base font-medium h-[80px] "
          onClick={() => {
            setPopupType(ProfessionCardPopupTypes.Add)
          }}
          type={AddNewCardType.Click}
        />
      </div>

      {/* Add Profession */}
      <CategoryAddEditPopup
        open={popupType === ProfessionCardPopupTypes.Add}
        action="add"
        type="profession" /* lowercase */
        onClose={() => {
          setPopupType(undefined)
        }}
        mutationFn={addCategoryFn}
      />

      {/* Add Specialist (under a profession) */}
      <CategoryAddEditPopup
        open={popupType === ProfessionCardPopupTypes.AddSpeciality}
        action="add"
        type="specialist"
        onClose={() => {
          setPopupType(undefined)
          setSelectedCategoryId(undefined)
        }}
        mutationFn={async (data: any) => {
          // addProfessionAsync returns a promise we can await
          return addProfessionAsync({
            name: data.name,
            professionId: selectedCategoryId!,
          })
        }}
      />

      {/* Edit Specialist */}
      <CategoryAddEditPopup
        open={popupType === ProfessionCardPopupTypes.EditSpeciality}
        action="edit"
        type="specialist"
        onClose={() => {
          setPopupType(undefined)
          setSelectedCategoryId(undefined)
          setEditingSpecialist(undefined)
        }}
        mutationFn={async (data: any) => {
          // call editSpecialistAsync which waits for backend
          return editSpecialistAsync({
            id: editingSpecialist!.id,
            name: data.name,
            professionId: editingSpecialist!.professionId,
          })
        }}
        initialValue={editingSpecialist?.name}
      />

      <RemoveDialog
        name={`category (${categories.find((category) => category.id === deletingId)?.name ?? ""})`}
        open={deletingId !== undefined && popupType === ProfessionCardPopupTypes.Delete}
        onClose={() => {
          setDeletingId(undefined)
          setPopupType(undefined)
        }}
        onRemove={() => {
          if (deletingId) {
            removeCategory(deletingId)
            setDeletingId(undefined)
            setPopupType(undefined)
          }
        }}
        loading={isDeleting}
      />
    </>
  )
}

export default ListCategories
