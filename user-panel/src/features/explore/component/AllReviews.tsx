"use client";

import React, { forwardRef, useState, useMemo } from "react";
import * as Avatar from "@radix-ui/react-avatar";
import { StarFilledIcon, StarIcon } from "@radix-ui/react-icons";
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

// Separate component for individual review to avoid hooks in loops
const ReviewItem = ({ review }: { review: Review }) => {
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
                    <div className="flex items-center gap-2">
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
                    <p className="mt-2 text-sm leading-5 text-gray-800">{review.description}</p>
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
    }, [reviews, activeStarFilter, sortBy]);

    const hasMore = totalReviews ? reviews.length < totalReviews : false;

    const circumference = 2 * Math.PI * 40;
    const strokeDashoffset = circumference - (averageRating / 5) * circumference;

    return (
        <div id="all-reviews" className={`w-full my-6 ${showOnDesktop ? 'block' : 'block sm:hidden'} bg-gradient-to-br from-gray-50 to-white p-4 rounded-lg`} ref={ref}>
            <h2 className="text-xl text-gray-800 font-semibold mb-4">All Reviews</h2>
            
            {ratingBreakdown && totalReviews && totalReviews > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="flex-shrink-0 relative">
                            <svg className="w-24 h-24" viewBox="0 0 100 100">
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    stroke="#e0e0e0"
                                    strokeWidth="8"
                                    fill="none"
                                />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    stroke="#4B5EFC"
                                    strokeWidth="8"
                                    fill="none"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={strokeDashoffset}
                                    transform="rotate(-90 50 50)"
                                />
                                <text
                                    x="50"
                                    y="50"
                                    textAnchor="middle"
                                    dy=".3em"
                                    className="text-2xl font-bold text-gray-800"
                                >
                                    {averageRating.toFixed(1)}
                                </text>
                            </svg>
                            <p className="text-center text-sm text-gray-500 mt-2">{totalReviews} review{totalReviews !== 1 ? 's' : ''}</p>
                        </div>

                        <div className="flex-1 flex flex-col sm:flex-row sm:items-start sm:gap-6">
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 mb-2 text-sm">Rating Breakdown</h3>
                                <div className="space-y-1">
                                    {[5, 4, 3, 2, 1].map((star) => {
                                        const count = ratingBreakdown[star as keyof typeof ratingBreakdown] || 0;
                                        const isActive = activeStarFilter === star;

                                        return (
                                            <button
                                                key={star}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (count > 0 && onStarFilter) {
                                                        handleStarFilter(isActive ? 0 : star);
                                                    }
                                                }}
                                                disabled={count === 0 || !onStarFilter}
                                                className={`w-full flex items-center gap-2 p-1 rounded-md transition-colors ${
                                                    isActive ? "bg-blue-50" : ""
                                                } ${count === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50 cursor-pointer"}`}
                                            >
                                                <span className="text-xs font-medium text-gray-700 w-12">
                                                    {star} Star{star !== 1 ? "s" : ""}
                                                </span>
                                                <div className="flex items-center gap-0.5">
                                                    {Array.from({ length: 5 }).map((_, i) =>
                                                        i < star ? (
                                                            <StarFilledIcon key={i} className="h-3 w-3 text-yellow-500" />
                                                        ) : (
                                                            <StarIcon key={i} className="h-3 w-3 text-gray-300" />
                                                        )
                                                    )}
                                                </div>
                                                <span className="text-xs text-gray-500 w-8 text-right">({count})</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="mt-4 sm:mt-0">
                                <span className="text-sm text-gray-600 block mb-2">Sort By</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                                    className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                                >
                                    <option value="recent">Most recent</option>
                                    <option value="highest">Highest rated</option>
                                    <option value="lowest">Lowest rated</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            )}

            {(activeStarFilter > 0) && (
                <div className="mb-4 flex flex-wrap gap-2 items-center">
                    <span className="text-sm text-gray-600">Active filters:</span>
                    {activeStarFilter > 0 && (
                        <button
                            onClick={() => onStarFilter && handleStarFilter(0)}
                            className="inline-flex items-center gap-2 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs transition-colors"
                        >
                            <span>{activeStarFilter} stars</span>
                            <span className="text-gray-500">×</span>
                        </button>
                    )}
                    <button
                        onClick={() => onStarFilter && handleStarFilter(0)}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                        Clear all
                    </button>
                </div>
            )}
            
            {filteredAndSortedReviews.length > 0 ? (
                <div className="grid gap-3">
                    {filteredAndSortedReviews.map((review) => (
                        <ReviewItem key={review.id} review={review} />
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                    <p className="text-gray-500 text-sm">
                        No reviews found for {activeStarFilter}-star filter.
                    </p>
                    <button
                        onClick={() => onStarFilter && handleStarFilter(0)}
                        className="mt-3 text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                        Clear filters
                    </button>
                </div>
            )}
            
            {hasMore && onLoadMore && !activeStarFilter && (
                <div className="mt-4 flex justify-center">
                    <Button 
                        onClick={onLoadMore} 
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