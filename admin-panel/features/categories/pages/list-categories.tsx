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
// import { Toast } from "@/components/base/Toast"
// import RemoveDialog from "@/components/widgets/removeDiaog"
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd"
import RemoveDialog from "@/components/widget/removeDialog";
import {invalidateQueries, queryClient} from "@/app/providers";
import {Toast} from "@/components/base/Toast";

type ListCategoriesProps = {
    categories: CategoryData[]
}

export enum CategoryCardPopupTypes {
    Add = "Add",
    Edit = "Edit",
    Delete = "Delete",
    AddProfession = "AddProfession",
    EditProfession = "EditProfession",
}

const ListCategories: React.FC<ListCategoriesProps> = ({ categories }) => {
    const [popupType, setPopupType] = useState<CategoryCardPopupTypes | undefined>()
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>()
    const [editingSpecialist, setEditingSpecialist] = useState<
        { id: string; name: string; professionId: string } | undefined
    >()

    const [orderChanged, setOrderChanged] = useState(false)

    const [orderedCategories, setOrderedCategories] = useState<CategoryData[]>(
        categories.sort((a, b) => a.order - b.order),
    )

    const [deletingId, setDeletingId] = useState<string | undefined>()

    const { mutate: removeCategory, isPending: isDeleting } = useMutation({
        mutationFn: removeCategoryFn,
        onSuccess: () => {
            invalidateQueries(["categories"]);
            Toast.success("Category removed successfully")
        },
        onError: () => {
            Toast.error("Failed to remove category")
        },
    })

    const { mutate: updateCategoryOrder, isPending: isUpdatingOrder } = useMutation({
        mutationFn: updateCategoryOrderFn,
        onSuccess: () => {
            invalidateQueries(["categories"]);
            Toast.success("Category order updated successfully")
            setOrderChanged(false)
        },
        onError: () => {
            Toast.error("Failed to update category order")
        },
    })

    const { mutate: addProfession, isPending: isAddingProfession } = useMutation({
        mutationFn: addSecondaryCategory,
        onSuccess: () => {
            invalidateQueries(["categories"]);
            Toast.success("Professional added successfully")
            setPopupType(undefined)
            setSelectedCategoryId(undefined)
        },
        onError: () => {
            Toast.error("Failed to add professional")
        },
    })

    const { mutate: editSpecialist, isPending: isEditingSpecialist } = useMutation({
        mutationFn: updateSecondaryCategoryNameFn,
        onSuccess: () => {
            invalidateQueries(["categories"]);
            Toast.success("Specialist updated successfully")
        },
        onError: () => {
            Toast.error("Failed to update specialist")
        },
    })

    const { mutate: deleteSpecialist, isPending: isDeletingSpecialist } = useMutation({
        mutationFn: removeSecondaryCategory,
        onSuccess: () => {
            invalidateQueries(["categories"]);
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
                onDragEnd={(result) => {
                    if (!result.destination) {
                        return
                    }
                    const items = Array.from(orderedCategories)
                    const [reorderedItem] = items.splice(result.source.index, 1)
                    items.splice(result.destination.index, 0, reorderedItem)
                    setOrderedCategories(items)
                    updateCategoryOrder({
                        newData: items,
                        oldData: categories,
                    })
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
                                                    setPopupType(CategoryCardPopupTypes.Delete)
                                                }}
                                                onAddProfession={(categoryId) => {
                                                    setSelectedCategoryId(categoryId)
                                                    setPopupType(CategoryCardPopupTypes.AddProfession)
                                                }}
                                                onEditSpecialist={(specialistId, newName) => {
                                                    const specialist = category.specialists?.find((s) => s.id === specialistId)
                                                    if (specialist) {
                                                        setEditingSpecialist({
                                                            id: specialistId,
                                                            name: specialist.name,
                                                            professionId: specialist.professionId,
                                                        })
                                                        setSelectedCategoryId(category.id)
                                                        setPopupType(CategoryCardPopupTypes.EditProfession)
                                                    }
                                                }}
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
                    name="new main category"
                    className="py-4 flex-row text-base font-medium h-[68px] "
                    onClick={() => {
                        setPopupType(CategoryCardPopupTypes.Add)
                    }}
                    type={AddNewCardType.Click}
                />
            </div>

            <CategoryAddEditPopup
                open={popupType === CategoryCardPopupTypes.Add}
                action="add"
                type="main category"
                onClose={() => {
                    setPopupType(undefined)
                }}
                mutationFn={addCategoryFn}
            />

            <CategoryAddEditPopup
                open={popupType === CategoryCardPopupTypes.AddProfession}
                action="add"
                type="professional"
                onClose={() => {
                    setPopupType(undefined);
                    setSelectedCategoryId(undefined);
                }}
                mutationFn={async (data: any) => {
                    return addProfession({
                        name: data.name,
                        professionId: selectedCategoryId!,
                    });
                }}
            />


            <CategoryAddEditPopup
                open={popupType === CategoryCardPopupTypes.EditProfession}
                action="edit"
                type="professional"
                onClose={() => {
                    setPopupType(undefined)
                    setSelectedCategoryId(undefined)
                    setEditingSpecialist(undefined)
                }}
                mutationFn={async (data: any) =>
                    editSpecialist({
                        id: editingSpecialist!.id,
                        name: data.name,
                        professionId: editingSpecialist!.professionId,
                    })
                }
                initialValue={editingSpecialist?.name}
            />

            <RemoveDialog
                name={`category (${categories.find((category) => category.id === deletingId)?.name ?? ""})`}
                open={deletingId !== undefined && popupType === CategoryCardPopupTypes.Delete}
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
