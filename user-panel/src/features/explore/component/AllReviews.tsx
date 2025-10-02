"use client";

import React, { forwardRef, useState } from "react";
import * as Avatar from "@radix-ui/react-avatar";
import { StarFilledIcon } from "@radix-ui/react-icons";
import { useGeneralUser } from "@/lib/hooks/useUser";
import {buildAvatarUrl} from "@/features/app/components/Navbar";
import {getInitials} from "@/features/explore/component/ServiceHeader";
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

interface AllReviewsProps {
    reviews?: Review[];
    showOnDesktop?: boolean;
    totalReviews?: number;
    onLoadMore?: () => void;
    isLoadingMore?: boolean;
}

const AllReviews = forwardRef<HTMLDivElement, AllReviewsProps>(({ 
    reviews, 
    showOnDesktop = false,
    totalReviews,
    onLoadMore,
    isLoadingMore = false
}, ref) => {
    if (!reviews?.length) return null;

    const hasMore = totalReviews ? reviews.length < totalReviews : false;

    return (
        <div id="all-reviews" className={`w-full my-8 ${showOnDesktop ? 'block' : 'block sm:hidden'}`} ref={ref}>
            <h2 className="text-xl text-dark-450 font-semibold mb-4 mt-8">All Reviews</h2>
            <div className="grid gap-4">
                {reviews.map((review) => {
                    const { data: userData } = useGeneralUser(review.userId);
                    return (
                        <div key={review.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                            <div className="flex items-start sm:items-center gap-4">
                                <Avatar.Root className="h-12 w-12 shrink-0 rounded-full bg-violet-200 grid place-items-center text-white font-semibold">
                                    {review.userImageUrl ? (
                                        <img
                                            src={buildAvatarUrl(review.userImageUrl) ?? "/images/coverImage.png"}
                                            alt={review.userName}
                                            className="size-12 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="size-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                                            <span className="text-white font-medium text-sm">
                                                {getInitials(review.userName)}
                                            </span>
                                        </div>
                                    )}
                                </Avatar.Root>
                                <div className="min-w-0 flex-1">
                                    {/* Desktop layout */}
                                    <div className="hidden sm:block">
                                        <div className="flex items-center gap-2">
                                            <p className="truncate font-medium">{review.userName ?? "Anonymous"}</p>
                                            {userData?.country && <span className="text-sm text-gray-500">• {userData.country}</span>}
                                            <div aria-label={`${review.stars} stars`} className="ml-2 flex items-center gap-0.5">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <StarFilledIcon key={i} className={`h-4 w-4 ${i < review.stars ? "text-black" : "text-gray-300"}`} />
                                                ))}
                                            </div>
                                            <span className="ml-1 text-sm font-semibold">{review.stars}</span>
                                        </div>
                                        <p className="text-sm text-gray-500">{timeAgo(review.createdAt)}</p>
                                    </div>

                                    {/* Mobile layout - country below name */}
                                    <div className="sm:hidden">
                                        <p className="font-medium truncate">{review.userName ?? "Anonymous"}</p>
                                        {userData?.country && <p className="text-sm text-gray-500 mt-0.5">{userData.country}</p>}
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <div aria-label={`${review.stars} stars`} className="flex items-center gap-0.5">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <StarFilledIcon key={i} className={`h-4 w-4 ${i < review.stars ? "text-black" : "text-gray-300"}`} />
                                                ))}
                                            </div>
                                            <span className="text-sm font-semibold">{review.stars}</span>
                                            <span className="text-sm text-gray-500">• {timeAgo(review.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p className="mt-4 text-[15px] leading-6 text-gray-800">{review.description}</p>
                        </div>
                    );
                })}
            </div>
            
            {hasMore && onLoadMore && (
                <div className="text-blue-600 hover:text-blue-800 font-medium flex justify-center">
                    <Button 
                        onClick={onLoadMore} 
                        // variant="outline" 
                        className="px-8"
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