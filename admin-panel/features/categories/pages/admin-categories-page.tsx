// "use client"

// import { useCategories } from "@/hooks/useCategories"
// import  Button  from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { Skeleton } from "@/components/ui/skeleton"
// import { Plus, AlertCircle, Settings, Users, FolderOpen } from "lucide-react"
// import ListCategories from "./list-categories"
// import { useState } from "react"
// import CategoryAddEditPopup from "./categoryAdd"
// import { addCategoryFn } from "@/lib/endpoints/categoriesFns"

// export default function AdminCategoriesPage() {
//     const {
//         data: categories = [],
//         refetch,
//         isError,
//         error,
//         isLoading,
//         isFetched,
//     } = useCategories();
//     const [showAddCategory, setShowAddCategory] = useState(false)

//     const handleAddCategory = () => {
//         setShowAddCategory(true)
//     }

//     if (isLoading) {
//         return (
//             <div className="min-h-screen bg-background">
//                 <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
//                     <div className="container mx-auto px-6 py-4">
//                         <div className="flex items-center justify-between">
//                             <div className="flex items-center gap-3">
//                                 <div className="p-2 bg-primary/10 rounded-lg">
//                                     <FolderOpen className="h-6 w-6 text-primary" />
//                                 </div>
//                                 <div>
//                                     <h1 className="text-2xl font-bold text-foreground">Categories Management</h1>
//                                     <p className="text-sm text-muted-foreground">Organize professions and specialists</p>
//                                 </div>
//                             </div>
//                             <Skeleton className="h-10 w-36" />
//                         </div>
//                     </div>
//                 </div>

//                 <div className="container mx-auto px-6 py-8 max-w-6xl">
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//                         {[...Array(3)].map((_, i) => (
//                             <Skeleton key={i} className="h-24 w-full" />
//                         ))}
//                     </div>

//                     <div className="space-y-4">
//                         {[...Array(4)].map((_, i) => (
//                             <Skeleton key={i} className="h-32 w-full" />
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         )
//     }

//     if (isError) {
//         return (
//             <div className="min-h-screen bg-background">
//                 <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
//                     <div className="container mx-auto px-6 py-4">
//                         <div className="flex items-center gap-3">
//                             <div className="p-2 bg-primary/10 rounded-lg">
//                                 <FolderOpen className="h-6 w-6 text-primary" />
//                             </div>
//                             <div>
//                                 <h1 className="text-2xl font-bold text-foreground">Categories Management</h1>
//                                 <p className="text-sm text-muted-foreground">Organize professions and specialists</p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="container mx-auto px-6 py-8 max-w-6xl">
//                     <Alert variant="destructive" className="max-w-2xl">
//                         <AlertCircle className="h-4 w-4" />
//                         <AlertDescription className="flex items-center justify-between">
//                             <span>{error?.message || "Failed to load categories"}</span>
//                             <Button variant="secondary" size="sm" onClick={() => refetch()}>
//                                 Retry
//                             </Button>
//                         </AlertDescription>
//                     </Alert>
//                 </div>
//             </div>
//         )
//     }

//     const totalCategories = categories.length;
//     const totalProfessionals = categories.reduce(
//         (sum, cat) => sum + (cat.specialists?.length ?? 0),
//         0
//     );
//     const averagePrice =
//         categories.length > 0
//             ? categories.reduce((sum, cat) => sum + (cat.price ?? 0), 0) /
//             categories.length
//             : 0;

//     if (categories.length === 0) {
//         return (
//             <>
//             <div className="min-h-screen bg-background">
//                 <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
//                     <div className="container mx-auto px-6 py-4">
//                         <div className="flex items-center justify-between">
//                             <div className="flex items-center gap-3">
//                                 <div className="p-2 bg-primary/10 rounded-lg">
//                                     <FolderOpen className="h-6 w-6 text-primary" />
//                                 </div>
//                                 <div>
//                                     <h1 className="text-2xl font-bold text-foreground">Categories Management</h1>
//                                     <p className="text-sm text-muted-foreground">Organize professions and specialists</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="container mx-auto px-6 py-8 max-w-6xl">
//                     <div className="flex items-center justify-center min-h-[60vh]">
//                         <Card className="p-12 text-center max-w-md border-dashed border-2">
//                             <CardContent className="space-y-6">
//                                 <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
//                                     <FolderOpen className="h-8 w-8 text-primary" />
//                                 </div>
//                                 <div className="space-y-2">
//                                     <h3 className="text-xl font-semibold text-foreground">No categories yet</h3>
//                                     <p className="text-muted-foreground">
//                                         Create your first category to start organizing professions and specialists.
//                                     </p>
//                                 </div>
//                                 <Button size="lg" className="w-full" onClick={handleAddCategory}>
//                                     <Plus className="h-4 w-4 mr-2" />
//                                     Create First Profession
//                                 </Button>
//                             </CardContent>
//                         </Card>
//                     </div>
//                 </div>
//             </div>
//                 <CategoryAddEditPopup
//                     open={showAddCategory}
//                     action="add"
//                     type="Profession"
//                     onClose={() => setShowAddCategory(false)}
//                     mutationFn={addCategoryFn}
//                     mutationParams={{ price: 0 }}
//                 />
//                 </>
//         )
//     }

//     return (
//         <div className="min-h-screen bg-background">
//             <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border shadow-sm">
//                 <div className="container mx-auto px-6 py-4">
//                     <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-3">
//                             <div className="p-2 bg-primary/10 rounded-lg">
//                                 <FolderOpen className="h-6 w-6 text-primary" />
//                             </div>
//                             <div>
//                                 <h1 className="text-2xl font-bold text-foreground">Categories Management</h1>
//                                 <p className="text-sm text-muted-foreground">Organize professions and specialists</p>
//                             </div>
//                         </div>
//                         <Button onClick={handleAddCategory} className="bg-primary hover:bg-primary/90">
//                             <Plus className="h-4 w-4 mr-2" />
//                             Add Profession
//                         </Button>
//                     </div>
//                 </div>
//             </div>

//             <div className="container mx-auto px-6 py-8 max-w-6xl">
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//                     {/*<Card className="border-l-4 border-l-primary">*/}
//                     {/*    <CardContent className="p-6">*/}
//                     {/*        <div className="flex items-center justify-between">*/}
//                     {/*            <div>*/}
//                     {/*                <p className="text-sm font-medium text-muted-foreground">Total Categories</p>*/}
//                     {/*                <p className="text-3xl font-bold text-foreground">{totalCategories}</p>*/}
//                     {/*            </div>*/}
//                     {/*            <div className="p-3 bg-primary/10 rounded-lg">*/}
//                     {/*                <FolderOpen className="h-6 w-6 text-primary" />*/}
//                     {/*            </div>*/}
//                     {/*        </div>*/}
//                     {/*    </CardContent>*/}
//                     {/*</Card>*/}

//                     {/*<Card className="border-l-4 border-l-secondary">*/}
//                     {/*    <CardContent className="p-6">*/}
//                     {/*        <div className="flex items-center justify-between">*/}
//                     {/*            <div>*/}
//                     {/*                <p className="text-sm font-medium text-muted-foreground">Total Professionals</p>*/}
//                     {/*                <p className="text-3xl font-bold text-foreground">{totalProfessionals}</p>*/}
//                     {/*            </div>*/}
//                     {/*            <div className="p-3 bg-secondary/10 rounded-lg">*/}
//                     {/*                <Users className="h-6 w-6 text-secondary" />*/}
//                     {/*            </div>*/}
//                     {/*        </div>*/}
//                     {/*    </CardContent>*/}
//                     {/*</Card>*/}

//                     {/*<Card className="border-l-4 border-l-accent">*/}
//                     {/*    <CardContent className="p-6">*/}
//                     {/*        <div className="flex items-center justify-between">*/}
//                     {/*            <div>*/}
//                     {/*                <p className="text-sm font-medium text-muted-foreground">Average Price</p>*/}
//                     {/*                <p className="text-3xl font-bold text-foreground">${averagePrice.toFixed(0)}</p>*/}
//                     {/*            </div>*/}
//                     {/*            <div className="p-3 bg-accent/10 rounded-lg">*/}
//                     {/*                <Settings className="h-6 w-6 text-accent" />*/}
//                     {/*            </div>*/}
//                     {/*        </div>*/}
//                     {/*    </CardContent>*/}
//                     {/*</Card>*/}
//                 </div>

//                 <ListCategories categories={categories} />
//             </div>

//             <CategoryAddEditPopup
//                 open={showAddCategory}
//                 action="add"
//                 type="profession"
//                 onClose={() => setShowAddCategory(false)}
//                 mutationFn={addCategoryFn}
//                 mutationParams={{ price: 0 }}
//             />
//         </div>
//     )
// }

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
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border rounded-lg">
          <div className="container mx-auto px-6 py-4 rounded-lg">
            <div className="flex items-center justify-between rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <FolderOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Categories Management</h1>
                  <p className="text-sm text-muted-foreground">Organize professions and specialists</p>
                </div>
              </div>
              <Skeleton className="h-10 w-36" />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>

          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
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
