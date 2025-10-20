"use client";

import React from "react";
import * as Avatar from "@radix-ui/react-avatar";
import { StarFilledIcon, StarIcon } from "@radix-ui/react-icons";
import { buildAvatarUrl } from "@/features/app/components/Navbar";
import { getInitials } from "@/features/explore/component/ServiceHeader";
import { Review } from "@/lib/endpoints/reviewFns";

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

export default ReviewItem;