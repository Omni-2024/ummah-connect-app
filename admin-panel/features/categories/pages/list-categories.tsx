"use client"

import type React from "react"

import type { CategoryData } from "@/types/data"
import CategoryCard from "../cards/categoryCard"
import AddNewCard, { AddNewCardType } from "../cards/addNewCard"
import { useEffect, useState } from "react"
import CategoryAddEditPopup from "./categoryAdd"
import { addCategoryFn, removeCategoryFn, updateCategoryOrderFn } from "@/lib/endpoints/categoriesFns"
import { useMutation } from "@tanstack/react-query"
import {Button} from "@/components/ui/button"
import { Export } from "iconsax-react"
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd"
import {Accordion} from "@/components/ui/accordion";
import RemoveDialog from "@/components/widget/removeDialog";

type ListCategoriesProps = {
    categories: CategoryData[]
}

export enum CategoryCardPopupTypes {
    Add = "Add",
    Edit = "Edit",
    Delete = "Delete",
}

const ListCategories: React.FC<ListCategoriesProps> = ({ categories }) => {
    const [popupType, setPopupType] = useState<CategoryCardPopupTypes | undefined>()

    const [orderChanged, setOrderChanged] = useState(false)

    const [orderedCategories, setOrderedCategories] = useState<CategoryData[]>(
        categories.sort((a, b) => a.order - b.order),
    )

    const [deletingId, setDeletingId] = useState<string | undefined>()

    const { mutate: removeCategory, isPending: isDeleting } = useMutation({
        mutationFn: removeCategoryFn,
        onSuccess: () => {
            // invalidateQueries(["categories"])
            // Toast.success("Category removed successfully")
        },
        onError: () => {
            // Toast.error("Failed to remove category")
        },
    })

    const { mutate: updateCategoryOrder, isPending: isUpdatingOrder } = useMutation({
        mutationFn: updateCategoryOrderFn,
        onSuccess: () => {
            // invalidateQueries(["categories"])categories
            // Toast.success("Category order updated successfully")
            setOrderChanged(false)
        },
        onError: () => {
            // Toast.error("Failed to update category order")
        },
    })

    useEffect(() => {
        setOrderedCategories(categories.sort((a, b) => a.order - b.order))
    }, [categories])

    return (
        <>
            <div className="flex justify-end pt-4 px-4">
                <Button
                    onClick={() => {
                        updateCategoryOrder({
                            newData: orderedCategories,
                            oldData: categories,
                        })
                    }}
                    disabled={!orderChanged || isUpdatingOrder}
                    isLoading={isUpdatingOrder}
                >
                    <Export />
                    Save Order
                </Button>
            </div>

            <DragDropContext
                onDragEnd={(result) => {
                    if (!result.destination) {
                        return
                    }
                    const items = Array.from(orderedCategories)
                    const [reorderedItem] = items.splice(result.source.index, 1)
                    items.splice(result.destination.index, 0, reorderedItem)
                    setOrderedCategories(items)
                    setOrderChanged(true)
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
                mutationParams={{ name: "new category" }}
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
