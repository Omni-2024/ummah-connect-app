"use client";

import * as React from "react";
import Button from "@/components/base/button";
import { Plus, FolderOpen } from "lucide-react";
import { useCategoriesState } from "@/features/categories/context/useCategoryState";
import { addCategoryFn } from "@/lib/endpoints/categoriesFns";
import type { CategoryData } from "@/types/data";
import CategoryAddEditModal from "@/features/categories/pages/CategoryAddEditPopup";
import ListCategories from "@/features/categories/pages/listCategories";

export default function AdminCategoriesPage({ categories }: { categories: CategoryData[] }) {
    const { openModal } = useCategoriesState();

    const getNextOrder = (list: Pick<CategoryData, "order">[]) =>
        list.length ? Math.max(...list.map(c => c.order ?? 0)) + 1 : 1;

    const handleAddProfession = () =>
        openModal({
            entity: "profession",
            action: "add",
            initialValue: "",
            mutationParams: {},
            onSubmit: async ({ name }) =>
                addCategoryFn({ name, order: getNextOrder(categories) }), // <-- add order
        });

    return (
        <div className="min-h-screen bg-background">
            <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border shadow-sm">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <FolderOpen className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-foreground">Categories Management</h1>
                                <p className="text-sm text-muted-foreground">Organize professions and specialists</p>
                            </div>
                        </div>

                        <Button
                            onClick={handleAddProfession}
                            className="bg-gradient-to-br from-[#669f9d] to-[#337f7c] hover:bg-primary/90"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Profession
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8 max-w-6xl">
                <ListCategories categories={categories} />
            </div>

            <CategoryAddEditModal />
        </div>
    );
}
