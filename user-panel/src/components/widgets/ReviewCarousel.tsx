"use client";

import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import type { EmblaOptionsType } from "embla-carousel";
import * as Avatar from "@radix-ui/react-avatar";
import { ChevronLeftIcon, ChevronRightIcon, StarFilledIcon } from "@radix-ui/react-icons";
import type { Review } from "@/lib/endpoints/reviewFns";
import {buildAvatarUrl} from "@/features/app/components/Navbar";
import {getInitials} from "@/features/explore/component/ServiceHeader";
import { useGeneralUser } from "@/lib/hooks/useUser";

const options: EmblaOptionsType = { loop: true, align: "start", dragFree: false };

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

export default function ReviewCarousel({ apiReviews, onSeeAllReviews }: { apiReviews?: Review[], onSeeAllReviews: () => void }) {
    const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay({ delay: 14500, stopOnInteraction: true })]);
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    React.useEffect(() => {
        if (!emblaApi) return;
        const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
        emblaApi.on("select", onSelect);
        emblaApi.on("reInit", onSelect);
    }, [emblaApi]);

    const scrollPrev = React.useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = React.useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

    if (!apiReviews?.length) return null;

    return (
            <div className="hidden sm:block w-full my-8">
                <div className="mb-4 flex items-center justify-between px-4 sm:px-0">
                <h2 className="text-xl text-dark-450 font-semibold">What people loved about this service</h2>
                <button onClick={onSeeAllReviews} className="text-blue-600 hover:text-blue-800 font-medium">See all reviews</button>
            </div>
            <div className="flex items-end justify-end mb-2 px-4 sm:px-0">
                {apiReviews.length > 1 && (
                    <div className="flex items-center gap-2">
                        <button onClick={scrollPrev} aria-label="Previous" className="rounded-full p-2 shadow hover:bg-gray-50 active:scale-95 transition">
                            <ChevronLeftIcon className="h-5 w-5" />
                        </button>
                        <button onClick={scrollNext} aria-label="Next" className="rounded-full p-2 shadow hover:bg-gray-50 active:scale-95 transition">
                            <ChevronRightIcon className="h-5 w-5" />
                        </button>
                    </div>
                )}
            </div>

            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                    {apiReviews.map((r) => (
                        <div key={r.id} className="min-w-0 shrink-0 basis-full" aria-roledescription="slide">
                            <ReviewCard review={r} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function ReviewCard({ review }: { review: Review }) {
    const { data } = useGeneralUser(review.userId);

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm mx-4 sm:mx-0">
            <div className="flex items-center gap-4">
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