"use client";

import React from "react";
import { StarFilledIcon, StarIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";

interface RatingSummaryProps {
    averageRating: number;
    totalReviews: number;
    ratingBreakdown: {
        5: number;
        4: number;
        3: number;
        2: number;
        1: number;
    };
    activeStarFilter: number[];
    onStarFilter: (star: number) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    sortBy: string;
    setSortBy: (sort: "recent" | "highest" | "lowest") => void;
    isDropdownOpen: boolean;
    setIsDropdownOpen: (open: boolean) => void;
    sortOptions: { value: string; label: string; icon: string }[];
    currentSortOption: { value: string; label: string; icon: string } | undefined;
}

const RatingSummary = ({
    averageRating,
    totalReviews,
    ratingBreakdown,
    activeStarFilter,
    onStarFilter,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    isDropdownOpen,
    setIsDropdownOpen,
    sortOptions,
    currentSortOption,
}: RatingSummaryProps) => {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-3">
            <div className="flex flex-col gap-3">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 text-center">
                        <div className="text-4xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
                        <div className="flex items-center justify-center gap-0.5 mt-1">
                            {Array.from({ length: 5 }).map((_, i) =>
                                i < Math.round(averageRating) ? (
                                    <StarFilledIcon key={i} className="h-3.5 w-3.5 text-yellow-500" />
                                ) : (
                                    <StarIcon key={i} className="h-3.5 w-3.5 text-gray-300" />
                                )
                            )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{totalReviews} review{totalReviews !== 1 ? 's' : ''}</p>
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="space-y-1">
                            {[5, 4, 3, 2, 1].map((star) => {
                                const count = ratingBreakdown[star as keyof typeof ratingBreakdown] || 0;
                                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                                const isActive = activeStarFilter.includes(star);

                                return (
                                    <button
                                        key={star}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            if (count > 0) {
                                                onStarFilter(star);
                                            }
                                        }}
                                        disabled={count === 0}
                                        className={`w-full flex items-center gap-2 group transition-all ${
                                            isActive ? "opacity-100" : ""
                                        } ${count === 0 ? "opacity-40" : "hover:opacity-100 cursor-pointer opacity-80"}`}
                                    >
                                        <span className="text-xs font-medium text-gray-600 w-5">{star}</span>
                                        <StarFilledIcon className="h-3 w-3 text-yellow-500 flex-shrink-0" />
                                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all ${
                                                    isActive ? "bg-blue-500" : "bg-gradient-to-r from-yellow-400 to-yellow-500"
                                                }`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-gray-500 w-8 text-right">{count}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-gray-100">
                    <div className="flex-1 relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search reviews..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white placeholder:text-gray-400"
                        />
                        {searchQuery && (
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setSearchQuery("");
                                }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <span className="text-lg">×</span>
                            </button>
                        )}
                    </div>

                    <div className="relative">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsDropdownOpen(!isDropdownOpen);
                            }}
                            className="w-full sm:w-auto flex items-center justify-between gap-2 pl-3 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors min-w-[160px]"
                        >
                            <span className="flex items-center gap-1.5">
                                <span>{currentSortOption?.icon}</span>
                                <span>{currentSortOption?.label}</span>
                            </span>
                            <svg
                                className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {isDropdownOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setIsDropdownOpen(false);
                                }} />
                                <div className="absolute right-0 mt-1 w-full sm:w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
                                    {sortOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setSortBy(option.value as "recent" | "highest" | "lowest");
                                                setIsDropdownOpen(false);
                                            }}
                                            className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors ${
                                                sortBy === option.value 
                                                    ? 'bg-blue-50 text-blue-700 font-semibold' 
                                                    : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                        >
                                            <span className="text-base">{option.icon}</span>
                                            <span>{option.label}</span>
                                            {sortBy === option.value && (
                                                <svg className="w-4 h-4 ml-auto text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RatingSummary;