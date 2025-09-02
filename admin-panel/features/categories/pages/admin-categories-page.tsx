"use client"

import { useCategories } from "@/hooks/useCategories"
import Button from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, AlertCircle, FolderOpen } from "lucide-react"
import ListCategories from "./list-categories"
import { useState } from "react"
import CategoryAddEditPopup from "./categoryAdd"
import { addCategoryFn } from "@/lib/endpoints/categoriesFns"

export default function AdminCategoriesPage() {
  const {
    data: categories = [],
    refetch,
    isError,
    error,
    isLoading,
  } = useCategories()
  const [showAddCategory, setShowAddCategory] = useState(false)

  const handleAddCategory = () => setShowAddCategory(true)

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background">
                <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
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
                            <Skeleton className="h-10 w-48 rounded-full" />
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-6 py-8 max-w-6xl">
                    {/*<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">*/}
                    {/*    {[...Array(3)].map((_, i) => (*/}
                    {/*        <Skeleton key={i} className="h-24 w-full" />*/}
                    {/*    ))}*/}
                    {/*</div>*/}

                    <div className="space-y-4">
                        {[...Array(4)].map((_, i) => (
                            <Skeleton key={i} className="h-20 w-full" />
                        ))}
                    </div>
                </div>
            </div>
        )
    }

  if (isError) {
    return (
      <div className="min-h-screen bg-background">
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FolderOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Categories Management</h1>
                <p className="text-sm text-muted-foreground">Organize professions and specialists</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8 max-w-6xl">
          <Alert variant="destructive" className="max-w-2xl">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{error?.message || "Failed to load categories"}</span>
              <Button variant="secondary" size="sm" onClick={() => refetch()}>
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

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
            <Button onClick={handleAddCategory} className="bg-gradient-to-br from-[#669f9d] to-[#337f7c] hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Profession
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <ListCategories categories={categories} />
      </div>

      <CategoryAddEditPopup
        open={showAddCategory}
        action="add"
        type="profession"
        onClose={() => setShowAddCategory(false)}
        mutationFn={addCategoryFn}
      />
    </div>
  )
}
