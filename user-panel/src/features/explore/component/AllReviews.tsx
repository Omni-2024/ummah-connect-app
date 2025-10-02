"use client";

import React, { forwardRef, useState, useMemo } from "react";
import * as Avatar from "@radix-ui/react-avatar";
import { StarFilledIcon, StarIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { buildAvatarUrl } from "@/features/app/components/Navbar";
import { getInitials } from "@/features/explore/component/ServiceHeader";
import { Review } from "@/lib/endpoints/reviewFns";
import Button from "@/components/base/Button";

function timeAgo(iso?: string) {
    if (!iso) return "";
    const diff = Date.now() - new Date(iso).getTime();
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (d >= 7) return `${Math.floor(d / 7)} weeks ago`;
    if (d >= 1) return `${d} day${d > 1 ? "s" : ""} ago`;
    const h = Math.floor(diff / (1000 * 60 * 60));
    if (h >= 1) return `${h} hour${h > 1 ? "s" : ""} ago`;
    const m = Math.floor(diff / (1000 * 60));
    return `${m} min ago`;
}

type SortOption = "recent" | "highest" | "lowest";

interface AllReviewsProps {
    reviews?: Review[];
    showOnDesktop?: boolean;
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
    onStarFilter?: (stars: number) => void;
    activeStarFilter?: number;
}

const ReviewItem = ({ review, searchQuery }: { review: Review; searchQuery: string }) => {
    const highlightText = (text: string) => {
        if (!searchQuery.trim()) return text;
        
        const regex = new RegExp(`(${searchQuery})`, 'gi');
        const parts = text.split(regex);
        
        return parts.map((part, index) => 
            regex.test(part) ? (
                <mark key={index} className="bg-yellow-200 text-gray-900 rounded px-0.5">
                    {part}
                </mark>
            ) : (
                part
            )
        );
    };

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:bg-gray-50 transition-colors">
            <div className="flex items-start sm:items-center gap-3">
                <Avatar.Root className="h-10 w-10 shrink-0 rounded-full bg-violet-200 grid place-items-center text-white font-semibold">
                    {review.userImageUrl ? (
                        <img
                            src={buildAvatarUrl(review.userImageUrl) ?? "/images/coverImage.png"}
                            alt={review.userName}
                            className="size-10 rounded-full object-cover"
                        />
                    ) : (
                        <div className="size-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                            <span className="text-white font-medium text-xs">
                                {getInitials(review.userName)}
                            </span>
                        </div>
                    )}
                </Avatar.Root>
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                        <p className="truncate font-medium text-sm text-gray-800">{review.userName ?? "Anonymous"}</p>
                        <div aria-label={`${review.stars} stars`} className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) =>
                                i < review.stars ? (
                                    <StarFilledIcon key={i} className="h-3 w-3 text-yellow-500" />
                                ) : (
                                    <StarIcon key={i} className="h-3 w-3 text-gray-300" />
                                )
                            )}
                        </div>
                        <span className="text-xs font-semibold text-gray-700">{review.stars}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{timeAgo(review.createdAt)}</p>
                    <p className="mt-2 text-sm leading-5 text-gray-800">
                        {highlightText(review.description)}
                    </p>
                </div>
            </div>
        </div>
    );
};

const AllReviews = forwardRef<HTMLDivElement, AllReviewsProps>(({ 
    reviews = [], 
    showOnDesktop = false,
    totalReviews,
    onLoadMore,
    isLoadingMore = false,
    averageRating = 0,
    ratingBreakdown,
    activeStarFilter: externalActiveFilter = 0,
    onStarFilter
}, ref) => {
    const [sortBy, setSortBy] = useState<SortOption>("recent");
    const [internalFilter, setInternalFilter] = useState<number>(externalActiveFilter);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const activeStarFilter = onStarFilter ? externalActiveFilter : internalFilter;

    const handleStarFilter = (value: number) => {
        if (onStarFilter) {
            onStarFilter(value);
        } else {
            setInternalFilter(value);
        }
    };

    const filteredAndSortedReviews = useMemo(() => {
        let result = [...reviews];
        
        if (activeStarFilter > 0) {
            result = result.filter(review => review.stars === activeStarFilter);
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
        onStarFilter && handleStarFilter(0);
        setSearchQuery("");
    };

    const activeFiltersCount = (activeStarFilter > 0 ? 1 : 0) + (searchQuery.trim() ? 1 : 0);

    const sortOptions = [
        { value: "recent", label: "Most Recent", icon: "📅" },
        { value: "highest", label: "Highest Rated", icon: "⭐" },
        { value: "lowest", label: "Lowest Rated", icon: "📊" }
    ];

    const currentSortOption = sortOptions.find(opt => opt.value === sortBy);

    return (
        <div id="all-reviews" className={`w-full my-6 ${showOnDesktop ? 'block' : 'block sm:hidden'} bg-gradient-to-br from-gray-50 to-white p-4 rounded-lg`} ref={ref}>
            <h2 className="text-xl text-gray-800 font-semibold mb-3">All Reviews</h2>
            
            {ratingBreakdown && totalReviews && totalReviews > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-3">
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex-shrink-0 relative">
                                <svg className="w-20 h-20" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="40" stroke="#e0e0e0" strokeWidth="8" fill="none" />
                                    <circle cx="50" cy="50" r="40" stroke="#4B5EFC" strokeWidth="8" fill="none"
                                        strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                                        transform="rotate(-90 50 50)" />
                                    <text x="50" y="50" textAnchor="middle" dy=".3em" className="text-2xl font-bold text-gray-800">
                                        {averageRating.toFixed(1)}
                                    </text>
                                </svg>
                                <p className="text-center text-xs text-gray-500 mt-1">{totalReviews} review{totalReviews !== 1 ? 's' : ''}</p>
                            </div>

                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 mb-1.5 text-sm">Rating Breakdown</h3>
                                <div className="space-y-0.5">
                                    {[5, 4, 3, 2, 1].map((star) => {
                                        const count = ratingBreakdown[star as keyof typeof ratingBreakdown] || 0;
                                        const isActive = activeStarFilter === star;

                                        return (
                                            <button key={star} onClick={(e) => {
                                                    e.preventDefault();
                                                    if (count > 0 && onStarFilter) {
                                                        handleStarFilter(isActive ? 0 : star);
                                                    }
                                                }}
                                                disabled={count === 0 || !onStarFilter}
                                                className={`w-full flex items-center gap-2 p-1 rounded-md transition-all ${
                                                    isActive ? "bg-blue-50 ring-1 ring-blue-300" : ""
                                                } ${count === 0 ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-50 cursor-pointer"}`}
                                            >
                                                <span className="text-xs font-medium text-gray-700 w-12">
                                                    {star} Star{star !== 1 ? "s" : ""}
                                                </span>
                                                <div className="flex items-center gap-0.5">
                                                    {Array.from({ length: 5 }).map((_, i) =>
                                                        i < star ? (
                                                            <StarFilledIcon key={i} className="h-2.5 w-2.5 text-yellow-500" />
                                                        ) : (
                                                            <StarIcon key={i} className="h-2.5 w-2.5 text-gray-300" />
                                                        )
                                                    )}
                                                </div>
                                                <span className="text-xs text-gray-500 w-8 text-right">({count})</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-gray-100">
                        <div className="flex-1 relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input type="text" placeholder="Search reviews..." value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white placeholder:text-gray-400"
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    <span className="text-lg">×</span>
                                </button>
                            )}
                        </div>

                        <div className="relative">
                            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="w-full sm:w-auto flex items-center justify-between gap-2 pl-3 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors min-w-[160px]">
                                <span className="flex items-center gap-1.5">
                                    <span>{currentSortOption?.icon}</span>
                                    <span>{currentSortOption?.label}</span>
                                </span>
                                <svg className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {isDropdownOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                                    <div className="absolute right-0 mt-1 w-full sm:w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
                                        {sortOptions.map((option) => (
                                            <button key={option.value}
                                                onClick={() => {
                                                    setSortBy(option.value as SortOption);
                                                    setIsDropdownOpen(false);
                                                }}
                                                className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors ${
                                                    sortBy === option.value 
                                                        ? 'bg-blue-50 text-blue-700 font-semibold' 
                                                        : 'text-gray-700 hover:bg-gray-50'
                                                }`}>
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
            )}

            {activeFiltersCount > 0 && (
                <div className="mb-3 flex flex-wrap gap-2 items-center bg-blue-50 p-2.5 rounded-lg border border-blue-100">
                    <span className="text-xs text-blue-900 font-medium">
                        {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''}:
                    </span>
                    {activeStarFilter > 0 && (
                        <button onClick={() => onStarFilter && handleStarFilter(0)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-gray-50 rounded-full text-xs font-medium text-gray-700 border border-gray-200 transition-colors">
                            <span>{activeStarFilter} stars</span>
                            <span className="text-gray-400">×</span>
                        </button>
                    )}
                    {searchQuery.trim() && (
                        <button onClick={() => setSearchQuery("")}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-gray-50 rounded-full text-xs font-medium text-gray-700 border border-gray-200 transition-colors">
                            <span>"{searchQuery.substring(0, 20)}{searchQuery.length > 20 ? '...' : ''}"</span>
                            <span className="text-gray-400">×</span>
                        </button>
                    )}
                    <button onClick={clearAllFilters}
                        className="text-xs text-blue-600 hover:text-blue-800 font-semibold ml-auto">
                        Clear all
                    </button>
                </div>
            )}
            
            {filteredAndSortedReviews.length > 0 ? (
                <div className="grid gap-3">
                    {filteredAndSortedReviews.map((review) => (
                        <ReviewItem key={review.id} review={review} searchQuery={searchQuery} />
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
                        <button onClick={clearAllFilters}
                            className="px-4 py-1.5 text-blue-600 hover:text-blue-800 font-medium text-sm bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                            Clear all filters
                        </button>
                    )}
                </div>
            )}
            
            {hasMore && onLoadMore && !activeStarFilter && !searchQuery.trim() && (
                <div className="mt-3 flex justify-center">
                    <Button onClick={onLoadMore} className="px-6 py-2 text-sm"
                        disabled={isLoadingMore} isLoading={isLoadingMore}>
                        See More Reviews
                    </Button>
                </div>
            )}
        </div>
    );
});
AllReviews.displayName = "AllReviews";

export default AllReviews;