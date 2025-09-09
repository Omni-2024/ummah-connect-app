"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/base/accordion";
import { Card, CardContent } from "@/components/base/card";
import Button from "@/components/base/button";
import { Badge } from "@/components/base/badge";
import { Plus, Users, GripVertical } from "lucide-react";
import { Edit, Trash } from "iconsax-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import RemoveDialog from "@/components/widget/removeDialog";
import { invalidateQueries } from "@/app/providers";
import { Toast } from "@/components/base/toast";
import {
    removeCategoryFn,
    removeSecondaryCategory,
    updateCategoryOrderFn,
    addSecondaryCategory,
    updateSecondaryCategoryNameFn,
    updateCategoryNameFn,
} from "@/lib/endpoints/categoriesFns";
import type { CategoryData } from "@/types/data";
import { useCategoriesState } from "@/features/categories/context/useCategoryState";

type Props = { categories: CategoryData[] };

export default function ListCategories({ categories }: Props) {
    const [ordered, setOrdered] = useState<CategoryData[]>(
        [...categories].sort((a, b) => a.order - b.order),
    );
    const [deletingId, setDeletingId] = useState<string | undefined>();
    const { openModal } = useCategoriesState();

    useEffect(() => {
        setOrdered([...categories].sort((a, b) => a.order - b.order));
    }, [categories]);

    const { mutateAsync: updateOrder, isPending: isReordering } = useMutation({
        mutationFn: updateCategoryOrderFn,
        onSuccess: () => {
            invalidateQueries(["categories"]);
            Toast.success("Category order updated");
        },
        onError: () => Toast.error("Failed to update order"),
    });

    const { mutate: removeCategory, isPending: isDeletingCat } = useMutation({
        mutationFn: removeCategoryFn,
        onSuccess: () => {
            invalidateQueries(["categories"]);
            Toast.success("Category removed");
        },
        onError: () => Toast.error("Failed to remove category"),
    });

    const { mutate: deleteSpecialist } = useMutation({
        mutationFn: removeSecondaryCategory,
        onSuccess: () => {
            invalidateQueries(["categories"]);
            Toast.success("Specialist removed");
        },
        onError: () => Toast.error("Failed to remove specialist"),
    });

    return (
        <>
            <DragDropContext
                onDragEnd={async (result) => {
                    if (!result.destination) return;
                    const items = Array.from(ordered);
                    const [reordered] = items.splice(result.source.index, 1);
                    items.splice(result.destination.index, 0, reordered);
                    setOrdered(items);
                    try {
                        await updateOrder({ newData: items, oldData: categories });
                    } catch {}
                }}
            >
                <Droppable droppableId="categories" direction="vertical">
                    {(dropProvided) => (
                        <div ref={dropProvided.innerRef}>
                          <Accordion type="multiple" className="w-full flex flex-col py-4 px-4">
                                {ordered.map((category, index) => (
                                    <Draggable
                                        key={category.id}
                                        draggableId={category.id}
                                        index={index}
                                        isDragDisabled={isReordering}
                                    >
                                        {(dragProvided, snapshot) => (
                                            <div
                                                ref={dragProvided.innerRef}
                                                {...dragProvided.draggableProps}
                                                className={snapshot.isDragging ? "opacity-95 scale-[1.01]" : ""}
                                            >
                                                <CategoryRow
                                                    category={category}
                                                    dragHandleProps={dragProvided.dragHandleProps}
                                                    onEditProfession={() =>
                                                        openModal({
                                                            entity: "profession",
                                                            action: "edit",
                                                            initialValue: category.name,
                                                            mutationParams: { id: category.id },
                                                            onSubmit: ({ name }) =>
                                                                updateCategoryNameFn({ id: category.id, name }),
                                                        })
                                                    }
                                                    onDeleteCategory={() => setDeletingId(category.id)}
                                                    onAddSpecialist={() =>
                                                        openModal({
                                                            entity: "specialist",
                                                            action: "add",
                                                            initialValue: "",
                                                            mutationParams: { professionId: category.id },
                                                            onSubmit: ({ name, professionId }) =>
                                                                addSecondaryCategory({ name, professionId }),
                                                        })
                                                    }
                                                    onEditSpecialist={(specId, specName) =>
                                                        openModal({
                                                            entity: "specialist",
                                                            action: "edit",
                                                            initialValue: specName,
                                                            mutationParams: { id: specId, professionId: category.id },
                                                            onSubmit: ({ id, name, professionId }) =>
                                                                updateSecondaryCategoryNameFn({ id, name, professionId }),
                                                        })
                                                    }
                                                    onDeleteSpecialist={(specId) => deleteSpecialist(specId)}
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                            </Accordion>
                            {dropProvided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            <RemoveDialog
                name={`category (${categories.find((c) => c.id === deletingId)?.name ?? ""})`}
                open={!!deletingId}
                onClose={() => setDeletingId(undefined)}
                onRemove={() => {
                    if (deletingId) {
                        removeCategory(deletingId);
                        setDeletingId(undefined);
                    }
                }}
                loading={isDeletingCat}
            />
        </>
    );
}

function CategoryRow({
                         category,
                         dragHandleProps,
                         onEditProfession,
                         onDeleteCategory,
                         onAddSpecialist,
                         onEditSpecialist,
                         onDeleteSpecialist,
                     }: {
    category: CategoryData;
    dragHandleProps: any;
    onEditProfession: () => void;
    onDeleteCategory: () => void;
    onAddSpecialist: () => void;
    onEditSpecialist: (specId: string, specName: string) => void;
    onDeleteSpecialist: (specId: string) => void;
}) {
    return (
        <AccordionItem value={category.id} className="border-0 mb-3">
            <Card className="group hover:shadow-sm transition-all duration-200 border border-border/50 hover:border-primary/30 bg-gradient-to-r from-slate-50 to-white">
                <CardContent className="p-0">
                    {/* Header (click to toggle) */}
                    <AccordionTrigger className="hover:no-underline p-4">
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-3">
                                <div
                                    {...dragHandleProps}
                                    className="p-1.5 rounded-md hover:bg-muted/50 cursor-grab active:cursor-grabbing transition-colors"
                                    onClick={(e) => e.stopPropagation()} // prevent toggling while grabbing
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
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {category.specialists?.length || 0} specialist
                                            {(category.specialists?.length || 0) !== 1 ? "s" : ""}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Action buttons shouldn't toggle accordion */}
                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                <Badge variant="outline" className="bg-cyan-50 text-[#446576]">
                                    {category.specialists?.length || 0} items
                                </Badge>

                                <Button variant="unstyled" size="sm" onClick={onEditProfession} className="h-6 w-6 p-0">
                                    <Edit size={20} color="black" />
                                </Button>

                                <Button
                                    variant="unstyled"
                                    size="sm"
                                    onClick={onDeleteCategory}
                                    className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                                >
                                    <Trash size={20} color="black" />
                                </Button>
                            </div>
                        </div>
                    </AccordionTrigger>

                    {/* Collapsible specialists */}
                    <AccordionContent className="px-4 pb-4">
                        <div className="mt-2 space-y-2">
                            {category.specialists?.map((s, idx) => (
                                <div key={s.id} className="group/spec">
                                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg border border-border/30 transition-all duration-200 group hover:shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 bg-gradient-to-br from-[#669f9d] to-[#337f7c] rounded-full flex items-center justify-center text-xs font-medium text-white shadow-sm">
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-sm text-foreground">{s.name}</h4>
                                                <p className="text-xs text-muted-foreground">Specialist</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="unstyled"
                                                size="sm"
                                                onClick={() => onEditSpecialist(s.id, s.name)}
                                                className="h-6 w-6 p-0"
                                            >
                                                <Edit size={20} color="black" />
                                            </Button>
                                            <Button
                                                variant="unstyled"
                                                size="sm"
                                                onClick={() => onDeleteSpecialist(s.id)}
                                                className="h-6 w-6 p-0 text-red-500 hover:bg-red-50"
                                            >
                                                <Trash size={20} color="black" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="flex justify-center pt-2">
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={onAddSpecialist}
                                    className="transition-all duration-200"
                                >
                                    <Plus className="h-3 w-3 mr-1" />
                                    Add Specialist
                                </Button>
                            </div>
                        </div>
                    </AccordionContent>
                </CardContent>
            </Card>
        </AccordionItem>
    );
}
