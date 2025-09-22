"use client"
import AdminCategoriesPage from "@/features/categories/pages/adminCategoriesPage"
import {useCategories} from "@/hooks/useCategories";
import LoadingError from "@/components/widget/loadingError";
import CategoriesSkeletonList from "@/features/categories/skeletons/categories";
import withAuth from "@/components/withAuth";
import {ADMIN_ROLES} from "@/lib/constants";

const  SuperAdminCategoriesDashboard=()=> {
    const {
        data: categories = [],
        refetch,
        isError,
        error,
        isLoading,
    } = useCategories()
    if (isError) return <LoadingError error={error.message} reload={refetch} />;
    if (isLoading || !categories) return <CategoriesSkeletonList />;
    return <AdminCategoriesPage categories={categories} />
}

const Page = withAuth(SuperAdminCategoriesDashboard, [
    ADMIN_ROLES.ADMIN,
    ADMIN_ROLES.OPERATIONAL_ADMIN,
    ADMIN_ROLES.ROOT,
]);

export default function CategoriesPage(props: any) {
    return <Page {...props} />;
}
