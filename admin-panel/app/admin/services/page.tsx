"use client"
import { useServiceState } from "@/features/services/context/useServiceState";
import { useServices } from "@/hooks/useServices";
import {GetAllServiceParams} from "@/lib/endpoints/serviceFns";
import { useEffect, useMemo, useState } from "react";
import FilterTabs from "@/components/base/FilterTabs";
import { ServicesPageTabs, ServicesPageTabTiles } from "@/lib/types/tabs";
import Input from "@/components/base/form/Input";
import Button from "@/components/base/button";
import { Setting4 } from "iconsax-react";
import AdvancedPagination from "@/components/widget/advancedPagination";
import { ListEmptyStateWithFilters } from "@/components/widget/listEmptyStateWithFilters";
import ServiceFilter, { ServiceCategoryFilterData } from "@/features/services/component/popups/serviceFilter";
import FilterSheet from "@/components/widget/filterSheet";
import DivRenderer from "@/components/widget/renderDivs";
import { Card, CardContent } from "@/components/base/card";
import {Plus} from "lucide-react";
import {useRouter} from "next/navigation";
import ServiceCardSkeletonList from "@/features/services/component/skeleton/serviceCardSkeleton";
import ServiceCard from "@/features/services/component/cards/ServiceCard";
import { OnboardingGuard } from "@/features/auth/onboardingGuard";
import withAuth from "@/components/withAuth";
import { ADMIN_ROLES } from "@/lib/constants";




const ITEMS_PER_PAGE = 11;


export default function AdminGigsPage() {
    const router=useRouter()
    const [selectedTab, setSelectedTab] = useState(ServicesPageTabs.Published);
    const [tabPublished, setTabPublished] = useState<Boolean>(true);

    const [filteredEducators, setFilteredEducators] = useState<string[]>([]);
    const [filterSheetOpen, setFilterSheetOpen] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState<
        ServiceCategoryFilterData | []
    >([]);

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);


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

    const calculateOffset = (page: number) => {
        return (page - 1) * ITEMS_PER_PAGE;
    };

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
        [
            currentPage,
            search,
            isPublished,
            providers,
            profession,
            specialist
        ]
    );
    const {
        data: services,
        isLoading,
        refetch: refetchServices,
    } = useServices(serviceParams);


    const totalServices = services?.meta?.total || 0;

    const totalPages = useMemo(() => {
        return Math.max(1, Math.ceil(totalServices / ITEMS_PER_PAGE));
    }, [totalServices]);

    useEffect(() => {
        setCurrentPage(1);
        setOffset(0);
    }, [
        search,
        providers,
        profession,
        specialist,
        setOffset,
    ]);

    useEffect(() => {
        if (services?.data.length === 0 && currentPage > 1) {
            const newPage = Math.min(currentPage - 1, totalPages);
            setCurrentPage(newPage);
            setOffset((newPage - 1) * limit);
        }
    }, [services?.data.length, currentPage, totalPages, limit, setOffset]);

    const handlePageChange = (newPage: number) => {
        const validPage = Math.min(newPage, totalPages);
        setCurrentPage(validPage);
        setOffset(calculateOffset(validPage));
    };

    const onChangeSearch = (search: string) => {
        setSearchTerm(search);
    };

    const handleSearch = () => {
        setOffset(0);
        setSearch(searchTerm);
    };

    const handleFilters = () => {
        setCurrentPage(1);
        setOffset(0);

        setProviders(filteredEducators);


        if (categoryFilter[0]) {
            console.log(categoryFilter[0]);
            setProfession(categoryFilter[0]);
        }
        if (categoryFilter[1] && categoryFilter[1]?.length > 0) {
            setSpecialist(categoryFilter[1]);
        }
    };

    const clearFilters = (refresh = true) => {
        setCategoryFilter([]);
        setFilteredEducators([]);
        setCurrentPage(1);
        setOffset(0);
        setSearch("");
        setIsPublished(true);
        setProviders([]);
        setProfession("");
        setSpecialist([]);
        setSearchTerm("");
        setTabPublished(true);
        if (refresh) refetchServices();
    };

    const filterCount = useMemo(() => {
        let count = 0;
        if (categoryFilter[0]) count++;
        if (categoryFilter[1] && categoryFilter[1]?.length > 0) count++;
        if (filteredEducators.length > 0) count++;
        return count;
    }, [categoryFilter, filteredEducators]);

    const handleDeleteGig = (gigId: string) => {
        if (confirm("Are you sure you want to delete this gig?")) {
            console.log("Delete service:", gigId)
        }
    }

    return (
        <OnboardingGuard>
        <div>
            <div className="flex justify-between py-8 px-4">
                <FilterTabs
                    widthAuto
                    onTabChange={(tab) => {
                        setSelectedTab(tab as ServicesPageTabs);
                        if (tab === ServicesPageTabs.Published) {
                            setIsPublished(true);
                            setTabPublished(true);
                        } else {
                            setIsPublished(false);
                            setTabPublished(false);
                        }
                    }}
                    tabSize="lg"
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
                        onChange={(e) => onChangeSearch(e.target.value)}
                    />
                    <Button
                        variant="secondary"
                        className="py-3 h-auto"
                        onClick={handleSearch}
                        type="submit"
                    >
                        Search
                    </Button>
                    <Button
                        className="py-3 h-auto relative"
                        onClick={() => setFilterSheetOpen(true)}
                        type="button"
                    >
                        <Setting4 color="white" size={20} />
                        Filter
                        {filterCount !== 0 && (
                            <div className="absolute right-0 top-0 bg-primary-800 flex items-center justify-center h-6 w-6 rounded-full">
                                {filterCount}
                            </div>
                        )}
                    </Button>
                </form>
            </div>

            {search.length > 0 && (
                <div className="px-5 text-lg pb-4 font-medium">
                    Search results for &quot;{search}&quot;
                </div>
            )}



            <div className="grid grid-cols-[repeat(auto-fit,_minmax(377px,1fr))] gap-4 px-5 py-3 ">
                {tabPublished && (
                    <Card
                        className="border-2 border-dashed border-gray-300 hover:border-[#669f9d] cursor-pointer transition-colors bg-white"
                        onClick={()=>router.push("/admin/services/create")}
                    >
                        <CardContent className="flex flex-col items-center justify-center h-80 text-center">
                            <div className="w-16 h-16 bg-cyan-50 rounded-full flex items-center justify-center mb-4">
                                <Plus className="h-8 w-8 text-[#669f9d] to-[#337f7c]" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Add new service</h3>
                            <p className="text-gray-500 text-sm">Create a new service offering</p>
                        </CardContent>
                    </Card>
                )}
                {isLoading || !services ? (
                    <ServiceCardSkeletonList />
                ) : (
                    services?.data.map((service) => (
                        <ServiceCard
                          key={service.id}
                          service={service}
                          refetchAll={refetchServices}
                        />
                    ))
                )}
                <DivRenderer />
            </div>

            {services?.data.length === 0 && (
                <ListEmptyStateWithFilters
                    isFiltered={filterCount > 0 || search.length > 0}
                    onReset={clearFilters}
                    name="services"
                />
            )}

            <div className="flex justify-center py-8">
                <AdvancedPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onChange={handlePageChange}
                />
            </div>

                
            <FilterSheet
                open={filterSheetOpen}
                onClose={() => setFilterSheetOpen(false)}
                onApply={() => handleFilters()}
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
    )
}

const Page = withAuth(AdminGigsPage, [
    ADMIN_ROLES.ADMIN,
    ADMIN_ROLES.OPERATIONAL_ADMIN,
    ADMIN_ROLES.BUSINESS_ADMIN,
    ADMIN_ROLES.ROOT,
]);