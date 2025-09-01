"use client"

import { useCategories } from "@/hooks/useCategories"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, AlertCircle } from "lucide-react"
import ListCategories from "./list-categories"

export default function AdminCategoriesPage() {
    const { data, refetch, isError, error, isLoading } = useCategories()

    if (isLoading) {
        return (
            <div className="container mx-auto p-6 max-w-4xl">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Categories</h1>
                    <Skeleton className="h-10 w-32" />
                </div>
                <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-20 w-full" />
                    ))}
                </div>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="container mx-auto p-6 max-w-4xl">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Categories</h1>
                </div>
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="flex items-center justify-between">
                        <span>{error?.message || "Failed to load categories"}</span>
                        <Button variant="outline" size="sm" onClick={() => refetch()}>
                            Retry
                        </Button>
                    </AlertDescription>
                </Alert>
            </div>
        )
    }

    if (data.length === 0) {
        return (
            <div className="container mx-auto p-6 max-w-4xl">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Categories</h1>
                </div>
                <Card className="p-8 text-center">
                    <CardContent>
                        <h3 className="text-lg font-semibold mb-2">No categories yet</h3>
                        <p className="text-muted-foreground mb-4">Get started by adding your first category.</p>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Category
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Categories</h1>
            </div>

            <ListCategories categories={data} />
        </div>
    )
}
