"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useServiceState } from "@/features/services/context/useServiceState";
import { useServices } from "@/hooks/useServices";
import { GetAllServiceParams } from "@/lib/endpoints/serviceFns";
import { useCurrentUser } from "@/lib/hooks/useUserInfo";

import FilterTabs from "@/components/base/FilterTabs";
import Input from "@/components/base/form/Input";
import Button from "@/components/base/button";
import AdvancedPagination from "@/components/widget/advancedPagination";
import { ListEmptyStateWithFilters } from "@/components/widget/listEmptyStateWithFilters";
import FilterSheet from "@/components/widget/filterSheet";
import DivRenderer from "@/components/widget/renderDivs";
import { Card, CardContent } from "@/components/base/card";
import ServiceCardSkeletonList from "@/features/services/component/skeleton/serviceCardSkeleton";
import ServiceCard from "@/features/services/component/cards/ServiceCard";
import ServiceFilter, {
    ServiceCategoryFilterData,
} from "@/features/services/component/popups/serviceFilter";
import { OnboardingGuard } from "@/features/auth/onboardingGuard";

import { ServicesPageTabs, ServicesPageTabTiles } from "@/lib/types/tabs";
import { Setting4 } from "iconsax-react";
import { Plus } from "lucide-react";
import {Roles} from "@/types/data";

const ITEMS_PER_PAGE = 11;

export default function AdminGigsPage() {
    const router = useRouter();
    const { data } = useCurrentUser();

    /* =========================
       SERVICE STATE (MUST BE FIRST)
       ========================= */
    const {
        limit,
        offset,
        search,
        setOffset,
        setSearch,
        isPublished,
        setIsPublished,
        providers,
        setProviders,
        setProfession,
        setSpecialist,
        specialist,
        profession,
    } = useServiceState();

    /* =========================
       LOCAL UI STATE
       ========================= */
    const [selectedTab, setSelectedTab] = useState(ServicesPageTabs.Published);
    const [tabPublished, setTabPublished] = useState(true);
    const [filteredEducators, setFilteredEducators] = useState<string[]>([]);
    const [filterSheetOpen, setFilterSheetOpen] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState<
        ServiceCategoryFilterData | []
    >([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        if (!data?.id || !data?.role) return;

        if (data.role === Roles.BusinessAdmin) {
            setProviders([data.id]);
        }
    }, [data?.id, data?.role, setProviders]);

    const calculateOffset = (page: number) => (page - 1) * ITEMS_PER_PAGE;

    const serviceParams = useMemo(
        () =>
            ({
                limit: ITEMS_PER_PAGE,
                offset: calculateOffset(currentPage),
                search,
                isPublished,
                providers,
                profession,
                specialties: specialist,
            }) as GetAllServiceParams,
        [currentPage, search, isPublished, providers, profession, specialist]
    );

    const { data: services, isLoading, refetch } = useServices(serviceParams);

    const totalServices = services?.meta?.total || 0;
    const totalPages = Math.max(1, Math.ceil(totalServices / ITEMS_PER_PAGE));

    useEffect(() => {
        setCurrentPage(1);
        setOffset(0);
    }, [search, providers, profession, specialist, setOffset]);

    /* =========================
       HANDLERS
       ========================= */
    const handlePageChange = (page: number) => {
        const valid = Math.min(page, totalPages);
        setCurrentPage(valid);
        setOffset(calculateOffset(valid));
    };

    const handleSearch = () => {
        setOffset(0);
        setSearch(searchTerm);
    };

    const handleFilters = () => {
        setCurrentPage(1);
        setOffset(0);

        // Business admin stays locked to own ID
        if (data?.role === Roles.Admin && data?.id) {
            setProviders([data.id]);
        } else {
            setProviders(filteredEducators);
        }

        if (categoryFilter[0]) setProfession(categoryFilter[0]);
        if (categoryFilter[1]?.length) setSpecialist(categoryFilter[1]);
    };

    const clearFilters = () => {
        setCategoryFilter([]);
        setFilteredEducators([]);
        setCurrentPage(1);
        setOffset(0);
        setSearch("");
        setIsPublished(true);
        setProfession("");
        setSpecialist([]);
        setSearchTerm("");
        setTabPublished(true);

        if (data?.role === Roles.Admin && data?.id) {
            setProviders([data.id]);
        } else {
            setProviders([]);
        }

        refetch();
    };

    const filterCount = useMemo(() => {
        let count = 0;
        if (categoryFilter[0]) count++;
        if (categoryFilter[1]?.length) count++;
        if (filteredEducators.length) count++;
        return count;
    }, [categoryFilter, filteredEducators]);


    return (
        <OnboardingGuard>
            <div>
                <div className="flex justify-between py-8 px-4">
                    <FilterTabs
                        widthAuto
                        tabSize="lg"
                        onTabChange={(tab) => {
                            setSelectedTab(tab as ServicesPageTabs);
                            const published = tab === ServicesPageTabs.Published;
                            setIsPublished(published);
                            setTabPublished(published);
                        }}
                        items={Object.keys(ServicesPageTabTiles).map((key) => ({
                            id: key,
                            title: ServicesPageTabTiles[key as ServicesPageTabs],
                        }))}
                    />

                    <form
                        className="flex gap-3 px-2"
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <Input
                            className="py-3 px-6 min-w-72"
                            placeholder="Search here..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Button variant="secondary" onClick={handleSearch}>
                            Search
                        </Button>
                        <Button onClick={() => setFilterSheetOpen(true)}>
                            <Setting4 size={20} color="white" />
                            Filter
                            {filterCount > 0 && (
                                <span className="absolute top-0 right-0 h-6 w-6 rounded-full bg-primary-800 text-white">
                  {filterCount}
                </span>
                            )}
                        </Button>
                    </form>
                </div>

                <div className="grid grid-cols-[repeat(auto-fit,minmax(377px,1fr))] gap-4 px-5 py-3">
                    {tabPublished && (
                        <Card
                            className="border-2 border-dashed cursor-pointer"
                            onClick={() => router.push("/admin/services/create")}
                        >
                            <CardContent className="flex flex-col items-center justify-center h-80">
                                <Plus className="h-10 w-10 text-primary" />
                                <p>Add new service</p>
                            </CardContent>
                        </Card>
                    )}

                    {isLoading || !services ? (
                        <ServiceCardSkeletonList />
                    ) : (
                        services.data.map((service) => (
                            <ServiceCard
                                key={service.id}
                                service={service}
                                refetchAll={refetch}
                            />
                        ))
                    )}

                    <DivRenderer />
                </div>

                {services?.data.length === 0 && (
                    <ListEmptyStateWithFilters
                        isFiltered={filterCount > 0 || !!search}
                        onReset={clearFilters}
                        name="services"
                    />
                )}

                <AdvancedPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onChange={handlePageChange}
                />

                <FilterSheet
                    open={filterSheetOpen}
                    onClose={() => setFilterSheetOpen(false)}
                    onApply={handleFilters}
                >
                    <ServiceFilter
                        categoryFilter={categoryFilter}
                        setCategoryFilter={setCategoryFilter}
                        filteredEducators={filteredEducators}
                        setFilteredEducators={setFilteredEducators}
                    />
                </FilterSheet>
            </div>
        </OnboardingGuard>
    );
}
