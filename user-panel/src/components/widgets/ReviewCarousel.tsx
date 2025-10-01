"use client";

import * as React from "react";
import * as Avatar from "@radix-ui/react-avatar";
import { StarFilledIcon } from "@radix-ui/react-icons";
import type { Review } from "@/lib/endpoints/reviewFns";
import {buildAvatarUrl} from "@/features/app/components/Navbar";
import {getInitials} from "@/features/explore/component/ServiceHeader";
import {useGeneralUser} from "@/lib/hooks/useUser";

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

export function pickTopReviews(all: Review[], limit = 4, offset = 0): Review[] {
    return [...(all ?? [])]
        .sort((a, b) => {
            // 1) highest stars first
            if (b.stars !== a.stars) return b.stars - a.stars;
            // 2) helpful votes next (treat undefined as 0)
            // const hb = (b.helpful ?? 0) - (a.helpful ?? 0);
            // if (hb !== 0) return hb;
            // 3) newest last
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        })
        .slice(offset, offset + limit);
}

export default function ReviewCarousel({ 
    apiReviews, 
    onLoadMore 
}: { 
    apiReviews?: Review[];
    onLoadMore?: () => void;
}) {
    const [currentOffset, setCurrentOffset] = React.useState(0);
    const reviewsPerPage = 4;
    
    const displayedReviews = React.useMemo(() => 
        pickTopReviews(apiReviews ?? [], reviewsPerPage, currentOffset), 
        [apiReviews, currentOffset]
    );

    const totalReviews = apiReviews?.length ?? 0;
    const hasMore = currentOffset + reviewsPerPage < totalReviews;

    const handleSeeMore = () => {
        setCurrentOffset(prev => prev + reviewsPerPage);
        onLoadMore?.();
    };

    if (!displayedReviews.length) return null;

    return (
        <div className=" sm:block w-full my-16">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl text-dark-450 font-semibold">What people loved about this service</h2>
            </div>

            <div className="space-y-4">
                {displayedReviews.map((r) => (
                    <ReviewCard key={r.id} review={r} />
                ))}
            </div>

            {hasMore && (
                <div className="flex justify-end mt-4">
                    <button
                        onClick={handleSeeMore}
                        className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
                    >
                        See more reviews →
                    </button>
                </div>
            )}
        </div>
    );
}

function ReviewCard({ review }: { review: Review }) {
    const {data}=useGeneralUser(review.userId)

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
                <Avatar.Root className="h-12 w-12 shrink-0 rounded-full bg-violet-200 grid place-items-center text-white font-semibold">
                    {review.userImageUrl ? (
                        <img
                            src={
                                review.userImageUrl
                                    ? buildAvatarUrl(review.userImageUrl)!!
                                    : "/images/coverImage.png"
                            }
                            alt={review.userName}
                            className="size-12 rounded-full object-cover"
                        />
                    ) : (
                        <div className="size-12 rounded-full bg-gradient-to-br from-green-400 to-green-600  flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {getInitials(review.userName)}
                    </span>
                        </div>
                    )}
                </Avatar.Root>

                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <p className="truncate font-medium">{review.userName ?? "Anonymous"}</p>
                        {data?.country && <span className="text-sm text-gray-500">• {data.country}</span>}
                        <div aria-label={`${review.stars} stars`} className="ml-2 flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <StarFilledIcon key={i} className={`h-4 w-4 ${i < review.stars ? "text-black" : "text-gray-300"}`} />
                            ))}
                        </div>
                        <span className="ml-1 text-sm font-semibold">{review.stars}</span>
                    </div>
                    <p className="text-sm text-gray-500">{timeAgo(review.createdAt)}</p>
                </div>
            </div>

            <p className="mt-4 text-[15px] leading-6 text-gray-800">{review.description}</p>
        </div>
    );
}