"use client";

import React from "react";
import { ChevronDownIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useExploreState } from "@/features/explore/context/useExploreState";
import type { CategoryData } from "@/types";

type ExploreDropDownProps = {
    exploreDropdownOpen: boolean;
    setExploreDropdownOpen: (open: boolean) => void;
    hoveredCategory: string | null;
    setHoveredCategory: (categoryId: string | null) => void;
    exploreCategories: CategoryData[];
    categoriesLoading: boolean;
    categoriesError: any;
};

const ExploreDropDown: React.FC<ExploreDropDownProps> = ({
                                                   exploreDropdownOpen,
                                                   setExploreDropdownOpen,
                                                   hoveredCategory,
                                                   setHoveredCategory,
                                                   exploreCategories,
                                                   categoriesLoading,
                                                   categoriesError,
                                               }) => {
    const router = useRouter();
    const { setProfession, setProfessionName, setSpecialties } = useExploreState();

    const hoveredCat = React.useMemo(
        () => exploreCategories.find((cat) => cat.id === hoveredCategory) || null,
        [exploreCategories, hoveredCategory]
    );

    return (
        <nav className="hidden lg:flex items-center space-x-1">
            <div className="relative">
                <button
                    onClick={() => setExploreDropdownOpen(!exploreDropdownOpen)}
                    onMouseEnter={() => setExploreDropdownOpen(true)}
                    className="flex items-center space-x-1 text-slate-700 hover:text-emerald-600 px-4 py-2 text-sm font-medium transition-all duration-200 relative group rounded-lg hover:bg-slate-50"
                >
                    <span>Explore</span>
                    <ChevronDownIcon
                        className={`w-4 h-4 transition-transform duration-200 ${
                            exploreDropdownOpen ? "rotate-180" : ""
                        }`}
                    />
                    <span className="absolute inset-x-3 -bottom-px h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full" />
                </button>

                {exploreDropdownOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => {
                                setExploreDropdownOpen(false);
                                setHoveredCategory(null);
                            }}
                        />
                        <div
                            className="absolute left-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 z-50 animate-in slide-in-from-top-2 duration-200 overflow-hidden"
                            onMouseLeave={() => {
                                setExploreDropdownOpen(false);
                                setHoveredCategory(null);
                            }}
                        >
                            <div className="flex min-h-[200px]">
                                {/* Left: categories */}
                                <div className="w-64 bg-slate-50 border-r border-slate-200">
                                    <div className="p-4">
                                        <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wide mb-3">
                                            Categories
                                        </h3>

                                        {categoriesLoading ? (
                                            <div className="flex items-center justify-center py-8">
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600" />
                                                <span className="ml-2 text-sm text-slate-600">Loading...</span>
                                            </div>
                                        ) : categoriesError ? (
                                            <div className="text-center py-8 text-red-600 text-sm">
                                                Error loading categories
                                            </div>
                                        ) : exploreCategories.length === 0 ? (
                                            <div className="text-center py-8 text-slate-600 text-sm">
                                                No categories available
                                            </div>
                                        ) : (
                                            <div className="space-y-1">
                                                {exploreCategories
                                                    .sort((a, b) => a.order - b.order)
                                                    .map((category) => {
                                                    const active = hoveredCategory === category.id;
                                                    return (
                                                        <button
                                                            key={category.id}
                                                            onMouseEnter={() => setHoveredCategory(category.id)}
                                                            onClick={() => {
                                                                setProfession(category.id);
                                                                setProfessionName(category.name);
                                                                setSpecialties([]); // clear specialists when choosing main
                                                                router.push("/explore");
                                                                setExploreDropdownOpen(false);
                                                                setHoveredCategory(null);
                                                            }}
                                                            className={`w-full flex items-center justify-between px-3 py-3 text-left text-sm rounded-lg transition-all duration-200 group ${
                                                                active
                                                                    ? "bg-emerald-100 text-emerald-700"
                                                                    : "text-slate-700 hover:bg-white hover:text-slate-900"
                                                            }`}
                                                        >
                                                            <span className="font-medium">{category.name}</span>
                                                            <ChevronRightIcon
                                                                className={`w-4 h-4 transition-colors duration-200 ${
                                                                    active
                                                                        ? "text-emerald-600"
                                                                        : "text-slate-400 group-hover:text-slate-600"
                                                                }`}
                                                            />
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Right: specialists of hovered category - only show when category is hovered */}
                                {hoveredCat && (
                                    <div className="w-60 bg-white h-min">
                                        <div className="p-4">
                                            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wide mb-3">
                                                {hoveredCat.name}
                                            </h3>

                                            <div className="space-y-1">
                                                {hoveredCat.specialists?.length ? (
                                                    hoveredCat.specialists.map((spec) => (
                                                        <button
                                                            key={spec.id}
                                                            onClick={() => {
                                                                setProfession(hoveredCat.id);
                                                                setProfessionName(hoveredCat.name);
                                                                setSpecialties([spec.id]); // MUST be an array
                                                                router.push("/explore");
                                                                setExploreDropdownOpen(false);
                                                                setHoveredCategory(null);
                                                            }}
                                                            className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200"
                                                        >
                                                            {spec.name}
                                                        </button>
                                                    ))
                                                ) : (
                                                    <div className="px-3 py-4 text-sm text-slate-500">
                                                        No specialists available
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </nav>
    );
};

export default ExploreDropDown;