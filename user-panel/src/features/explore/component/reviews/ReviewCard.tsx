"use client";

import React from "react";
import * as Avatar from "@radix-ui/react-avatar";
import { StarFilledIcon } from "@radix-ui/react-icons";
import { buildAvatarUrl } from "@/features/app/components/Navbar";
import { getInitials } from "@/features/explore/component/ServiceHeader";
import { Review } from "@/lib/endpoints/reviewFns";
import { useGeneralUser } from "@/lib/hooks/useUser";

// Define the shape of the user data returned by useGeneralUser
interface UserData {
    country?: string;
    // Add other fields as needed based on your useGeneralUser hook
}

const ReviewCard = ({ review, searchQuery }: { review: Review; searchQuery: string }) => {
    // Use useGeneralUser with proper typing
    const { data: userData } = useGeneralUser(review.userId) as { data: UserData | undefined };

    // Memoize timeAgo to avoid recalculation on every render
    const timeAgo = React.useMemo(() => {
        if (!review.createdAt) return "";
        const diff = Date.now() - new Date(review.createdAt).getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (days >= 7) return `${Math.floor(days / 7)} week${days >= 14 ? "s" : ""} ago`;
        if (days >= 1) return `${days} day${days > 1 ? "s" : ""} ago`;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        if (hours >= 1) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
        const minutes = Math.floor(diff / (1000 * 60));
        return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
    }, [review.createdAt]);

    // Highlight text based on search query
    const highlightText = (text: string) => {
        if (!searchQuery.trim()) return text;

        const regex = new RegExp(`(${searchQuery})`, "gi");
        return text.split(regex).map((part, index) =>
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
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:bg-gray-50 transition-colors duration-200">
            <div className="flex items-center gap-4">
                <Avatar.Root className="h-12 w-12 shrink-0 rounded-full bg-violet-200 grid place-items-center text-white font-semibold">
                    {review.userImageUrl ? (
                        <img
                            src={buildAvatarUrl(review.userImageUrl) ?? "/images/coverImage.png"}
                            alt={`${review.userName}'s profile`}
                            className="h-12 w-12 rounded-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = "/images/coverImage.png"; // Fallback on error
                            }}
                        />
                    ) : (
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                                {getInitials(review.userName)}
                            </span>
                        </div>
                    )}
                </Avatar.Root>
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <p className="truncate font-medium text-gray-900 text-sm">{review.userName ?? "Anonymous"}</p>
                        {userData?.country && <span className="text-sm text-gray-500">• {userData.country}</span>}
                        <div aria-label={`${review.stars} stars`} className="ml-2 flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <StarFilledIcon
                                    key={i}
                                    className={`h-4 w-4 ${i < review.stars ? "text-yellow-500" : "text-gray-300"}`}
                                />
                            ))}
                        </div>
                        <span className="ml-1 text-sm font-semibold text-gray-600">{review.stars}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{timeAgo}</p>
                </div>
            </div>
            <p className="mt-4 text-[15px] leading-6 text-gray-800">
                {highlightText(review.description || "")}
            </p>
        </div>
    );
};

export default ReviewCard;