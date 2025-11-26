"use client";

import React, { forwardRef, useState, useMemo } from "react";
import ReviewCard from "./ReviewCard"; 
import RatingSummary from "./RatingSummary";
import Button from "@/components/base/Button";
import { Review } from "@/lib/endpoints/reviewFns";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

type SortOption = "recent" | "highest" | "lowest";

interface AllReviewsProps {
    reviews?: Review[];
    totalReviews?: number;
    onLoadMore?: () => void;
    isLoadingMore?: boolean;
    averageRating?: number;
    ratingBreakdown?: {
        5: number;
        4: number;
        3: number;
        2: number;
        1: number;
    };
    onStarFilter?: (stars: number[]) => void;
    activeStarFilter?: number[];
}

const AllReviews = forwardRef<HTMLDivElement, AllReviewsProps>(({ 
    reviews = [], 
    totalReviews,
    onLoadMore,
    isLoadingMore = false,
    averageRating = 0,
    ratingBreakdown,
    activeStarFilter: externalActiveFilter = [],
    onStarFilter
}, ref) => {
    const [sortBy, setSortBy] = useState<SortOption>("recent");
    const [internalFilter, setInternalFilter] = useState<number[]>(externalActiveFilter || []);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const activeStarFilter = Array.isArray(onStarFilter ? externalActiveFilter : internalFilter) 
        ? (onStarFilter ? externalActiveFilter : internalFilter) 
        : [];

    const handleStarFilter = (star: number) => {
        const newFilter = [...activeStarFilter];
        if (newFilter.includes(star)) {
            newFilter.splice(newFilter.indexOf(star), 1);
        } else {
            newFilter.push(star);
            newFilter.sort((a, b) => b - a);
        }

        if (onStarFilter) {
            onStarFilter(newFilter);
        } else {
            setInternalFilter(newFilter);
        }
    };

    const filteredAndSortedReviews = useMemo(() => {
        let result = [...reviews];
        
        if (activeStarFilter.length > 0) {
            result = result.filter(review => activeStarFilter.includes(review.stars));
        }
        
        if (searchQuery.trim()) {
            result = result.filter(review => 
                review.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                review.userName.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        
        switch (sortBy) {
            case "highest":
                result.sort((a, b) => b.stars - a.stars);
                break;
            case "lowest":
                result.sort((a, b) => a.stars - b.stars);
                break;
            default:
                result.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
        }
        return result;
    }, [reviews, activeStarFilter, sortBy, searchQuery]);

    const hasMore = totalReviews ? reviews.length < totalReviews : false;

    const circumference = 2 * Math.PI * 40;
    const strokeDashoffset = circumference - (averageRating / 5) * circumference;

    const clearAllFilters = () => {
        if (onStarFilter) {
            onStarFilter([]);
        } else {
            setInternalFilter([]);
        }
        setSearchQuery("");
    };
    const activeFiltersCount = (activeStarFilter.length > 0 ? activeStarFilter.length : 0) + (searchQuery.trim() ? 1 : 0);

    const sortOptions = [
        { value: "recent", label: "Most Recent", icon: "📅" },
        { value: "highest", label: "Highest Rated", icon: "⭐" },
        { value: "lowest", label: "Lowest Rated", icon: "📊" }
    ];

    const currentSortOption = sortOptions.find(opt => opt.value === sortBy);

    return (
        <div id="all-reviews" className="w-full my-6" ref={ref}>
        <div className="mb-6">
            <div className="flex items-baseline gap-3">
                <h2 className="text-2xl font-bold text-gray-900 mt-6">All Reviews</h2>
                {totalReviews != null && totalReviews > 0 && (
                    <span className="text-lg text-gray-600 font-medium">
                        {totalReviews.toLocaleString()} review{totalReviews !== 1 ? "s" : ""}
                    </span>
                )}
            </div>
        </div>

        {totalReviews != null && totalReviews > 0 && ratingBreakdown && (
            <RatingSummary
                averageRating={averageRating}
                totalReviews={totalReviews}
                ratingBreakdown={ratingBreakdown}
                activeStarFilter={activeStarFilter}
                onStarFilter={handleStarFilter}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                sortBy={sortBy}
                setSortBy={setSortBy}
                isDropdownOpen={isDropdownOpen}
                setIsDropdownOpen={setIsDropdownOpen}
                sortOptions={sortOptions}
                currentSortOption={currentSortOption}
            />
        )}
            {activeFiltersCount > 0 && (
                <div className="mb-3 flex flex-wrap gap-2 items-center bg-blue-50 p-2.5 rounded-lg border border-blue-100">
                    <span className="text-xs text-blue-900 font-medium">
                        {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''}:
                    </span>
                    {activeStarFilter.length > 0 && activeStarFilter.map((star) => (
                        <button
                            key={star}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleStarFilter(star);
                            }}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-gray-50 rounded-full text-xs font-medium text-gray-700 border border-gray-200 transition-colors"
                        >
                            <span>{star} stars</span>
                            <span className="text-gray-400">×</span>
                        </button>
                    ))}
                    {searchQuery.trim() && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setSearchQuery("");
                            }}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-gray-50 rounded-full text-xs font-medium text-gray-700 border border-gray-200 transition-colors"
                        >
                            <span>"{searchQuery.substring(0, 20)}{searchQuery.length > 20 ? '...' : ''}"</span>
                            <span className="text-gray-400">×</span>
                        </button>
                    )}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            clearAllFilters();
                        }}
                        className="text-xs text-blue-600 hover:text-blue-800 font-semibold ml-auto"
                    >
                        Clear all
                    </button>
                </div>
            )}
            
            {filteredAndSortedReviews.length > 0 ? (
                <div className="space-y-6"> {/* Changed from grid gap-3 to space-y-6 for consistent spacing */}
                    {filteredAndSortedReviews.map((review) => (
                        <ReviewCard
                            key={review.id}
                            review={review}
                            searchQuery={searchQuery} // Pass searchQuery to ReviewCard
                        />
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                    <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <MagnifyingGlassIcon className="h-7 w-7 text-gray-400" />
                    </div>
                    <p className="text-gray-700 font-medium mb-1">No reviews found</p>
                    <p className="text-gray-500 text-sm mb-3">
                        {activeFiltersCount > 0 
                            ? "Try adjusting your filters to see more results"
                            : "Be the first to leave a review!"}
                    </p>
                    {activeFiltersCount > 0 && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                clearAllFilters();
                            }}
                            className="px-4 py-1.5 text-blue-600 hover:text-blue-800 font-medium text-sm bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                            Clear all filters
                        </button>
                    )}
                </div>
            )}
            
            {hasMore && onLoadMore && !activeStarFilter.length && !searchQuery.trim() && (
                <div className="mt-3 flex justify-center">
                    <Button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (onLoadMore) onLoadMore();
                        }}
                        className="px-6 py-2 text-sm"
                        disabled={isLoadingMore}
                        isLoading={isLoadingMore}
                    >
                        See More Reviews
                    </Button>
                </div>
            )}
        </div>
    );
});
AllReviews.displayName = "AllReviews";

export default AllReviews;