"use client"
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useExploreState } from "@/features/explore/context/exploreState";
import { useCategories } from "@/lib/hooks/useCategories";
import { GetAllServiceParams } from "@/types";
import { useServices } from "@/lib/hooks/useServices";
import { SkeletonServicesCard } from "@/features/explore/component/SkeletonCourseCard";
import NoServicesFound from "@/features/explore/component/NoServicesFound";
import ServiceCard from "@/features/app/components/ServiceCard";
import CertificatBanner from "@/features/explore/component/CertificatBanner";
import { setProfession, setProfessionName, setSpecialties } from "@/features/explore/context/useExploreState";
import FilterModal from "@/features/explore/component/search/FilterModal";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/base/Breadcrumb";
import IconButton from "@/components/base/IconButton";
import Button from "@/components/base/Button"
import { Cross2Icon } from "@radix-ui/react-icons";
import FilterBar from "@/features/explore/component/search/FilterBar";
import NavSearchbar from "@/features/explore/component/search/NavSearchbar";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink, PaginationNext,
    PaginationPrevious
} from "@/components/base/Pagination";
import FilterTabs from "@/components/base/FilterTabs";
import Navbar from "@/features/app/components/Navbar";
import NavbarMobile, {NavbarTitle} from "@/features/app/components/Navbar.mobile";
import {Setting4} from "iconsax-react";
import Bottombar from "@/features/app/components/Bottombar";

export default function ExploreServiceRoute() {

    const router = useRouter();
    const searchParams = useSearchParams();
    const [showBanner, _setShowBanner] = useState(true); // TODO: Show banner based on auth status
    const [totalServices, setTotalServices] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const {
        limit,
        offset,
        searchTerm,
        profession,
        professionName,
        specialties,
        setOffset,
        setSearchTerm,
        setLimit,

    } = useExploreState()

    const { data: categories } = useCategories();

    useEffect(() => {
        setOffset((currentPage - 1) * limit)
    }, [currentPage, limit]);

    const serviceParams = { limit, offset } as GetAllServiceParams;

    if (searchTerm) {
        serviceParams.search = searchTerm;
    }
    if (profession) {
        serviceParams.profession = profession;
    }
    if (specialties) {
        serviceParams.specialties = specialties as string[];
    }

    const { data: services, isLoading } = useServices(serviceParams);

    useEffect(() => {
        if (services?.meta?.total) {
            setTotalServices(services.meta.total);
        }
    }, [services]);

    const totalPages = Math.ceil(totalServices / limit);


    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            window.scrollTo({ top: 0 });
            setCurrentPage(newPage);
        }
    };

    const handleResetFilters = () => {
        setCurrentPage(1);
        setSearchTerm("");
        setProfession("")
        setSpecialties([])
        setOffset(0);
        setLimit(9);
        const searchQuery = searchParams.get("search_query");

        if (searchQuery) {
            router.push("/explore");
        }
    };

    const getCourseCardsWithBanner = () => {
        if (isLoading) {
            const skeletonCards = Array.from({ length: 9 }).map((_, idx) => (
                <SkeletonServicesCard key={idx} size="sm" />
            ));

            if (showBanner) {
                skeletonCards.splice(
                    6,
                    0,
                    <div key="banner" className="hidden w-full py-10 lg:block">
                        <CertificatBanner />
                    </div>,
                );
            }

            return skeletonCards;
        }

        if (!services?.data || services.data.length === 0) {
            return <NoServicesFound onExploreMoreServices={handleResetFilters} />;
        }

        const serviceCards = services.data.map((service, idx) => (
            <ServiceCard key={idx} size="sm" service={service} className="h-auto" />
        ));

        if (showBanner) {
            serviceCards.splice(
                6,
                0,
                <div key="banner" className="hidden w-full py-10 lg:block">
                    <CertificatBanner />
                </div>,
            );
        }

        return serviceCards;
    };

    const onTabChange = (tabId: string) => {
        setCurrentPage(1); // Reset to the first page
        setProfession(tabId)
        setProfessionName(categories?.find((cat) => cat.id === tabId)?.name || "")
    };

    const [showMobileFilterModal, setShowMobileFilterModal] = useState(false);

    const handleFilterModalChange = (open: boolean) => {
        setShowMobileFilterModal(open);
    };

    return (
        <div className="min-h-screen w-full pb-16 lg:pb-0">
            <Navbar />
            <NavbarMobile
                className="px-4"
                left={<NavbarTitle title="Search" size="md" />}
                right={
                    <IconButton variant="primary">
                        <Setting4
                            className="size-6 "
                            onClick={() => setShowMobileFilterModal(true)}
                            color="black"
                        />
                    </IconButton>
                }
            />
            <FilterModal
                showModal={showMobileFilterModal}
                handleModalChange={handleFilterModalChange}
                resetPage={() => {
                    handlePageChange(1);
                }}
            />

            <div className="container px-4 py-4 lg:px-6 lg:py-9">
                <div className="mb-8 hidden justify-between lg:flex">
                    <Breadcrumb className="inline-flex rounded-full border border-dark-50 px-4 py-2">
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink
                                    className="cursor-pointer text-dark-400 hover:text-primary-500"
                                    onClick={handleResetFilters}
                                >
                                    All services
                                </BreadcrumbLink>
                            </BreadcrumbItem>

                            {profession && (
                                <>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbLink className="text-primary-500">
                                            {professionName}
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                </>
                            )}

                            {searchTerm && (
                                <>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage className="text-primary-500">
                                            Searched "{searchTerm}"
                                        </BreadcrumbPage>
                                    </BreadcrumbItem>
                                </>
                            )}
                        </BreadcrumbList>

                        {(profession || searchTerm) && (
                            <IconButton
                                onClick={handleResetFilters}
                                className="ml-4 size-5 p-0 text-primary-800"
                            >
                                <Cross2Icon />
                            </IconButton>
                        )}
                    </Breadcrumb>

                    {searchTerm && services?.data && (
                        <p className="font-bold text-dark-400">
                            {services?.data.length === 0
                                ? `0 results`
                                : `0${services?.data.length} results`}
                        </p>
                    )}
                </div>

                <div className="flex gap-2">
                    <div className="hidden lg:block">
                        <FilterBar
                            resetPage={() => {
                                handlePageChange(1);
                            }}
                        />
                    </div>

                    <div className="flex-1">
                        <div className="mb-4 space-y-4 lg:hidden">
                            <div className="w-full">
                                <NavSearchbar
                                    onSearch={() => {
                                        setCurrentPage(1);
                                    }}
                                />
                            </div>

                            {/* TODO: Mobile UI for filter section */}
                            <div className="flex lg:hidden">
                                <FilterTabs
                                    widthAuto
                                    tabSize="lg"
                                    items={[{ id: "all", title: "All" }].concat(
                                        categories?.map((profession) => ({
                                            id: profession.id,
                                            title: profession.name,
                                        })) || [],
                                    )}
                                    onTabChange={(selectedTabId) => {
                                        selectedTabId === "all"
                                            ? handleResetFilters()
                                            : onTabChange(selectedTabId);
                                    }}
                                    activeItemId={profession || "all"}
                                />
                            </div>

                            {searchTerm && (
                                <div className="flex items-center gap-2 lg:hidden">
                                    <div>Search for </div>
                                    <div className="flex max-w-[200px] items-center gap-2 rounded-full border border-gray-200 bg-primary-50 px-3 py-1.5">
                                        <span className="truncate text-sm text-primary-700">
                                            {searchTerm}
                                        </span>
                                        <Button
                                            variant={"icon"}
                                            onClick={() => {
                                                setCurrentPage(1);
                                                setSearchTerm("")
                                                const searchQuery = searchParams.get("search_query");

                                                if (searchQuery) {
                                                    router.push("/explore");
                                                }
                                            }}
                                            className="size-4 p-0 text-primary-700"
                                        >
                                            <Cross2Icon className="size-3" />
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* add here */}
                        </div>

                        <div className="flex flex-wrap justify-center gap-x-4 gap-y-4 lg:gap-y-10">
                            {getCourseCardsWithBanner()}
                        </div>

                        {/* if no courses found, hide pagination */}
                        {services?.data && totalPages > 1 && (
                            <div className="mt-6 flex w-full items-center justify-center lg:mt-14">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                onClick={() => handlePageChange(currentPage - 1)}
                                            />
                                        </PaginationItem>
                                        {Array.from({ length: totalPages }).map((_, index) => (
                                            <PaginationItem key={index}>
                                                <PaginationLink
                                                    isActive={currentPage === index + 1}
                                                    onClick={() => handlePageChange(index + 1)}
                                                >
                                                    {index + 1}
                                                </PaginationLink>
                                            </PaginationItem>
                                        ))}
                                        <PaginationItem>
                                            <PaginationNext
                                                onClick={() => handlePageChange(currentPage + 1)}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Bottombar/>
        </div>
    )

}