"use client";

import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import type { EmblaOptionsType } from "embla-carousel";
import * as Avatar from "@radix-ui/react-avatar";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    StarFilledIcon,
} from "@radix-ui/react-icons";

type Review = {
    id: string;
    name: string;
    country: string;
    rating: number; // 1..5
    text: string;
    ago: string;
    avatarUrl?: string;
};

const reviews: Review[] = [
    {
        id: "1",
        name: "buenaventura_de",
        country: "Australia",
        rating: 5,
        text:
            "Exceptional custom website development with precise execution. Every feature was implemented seamlessly, design is modern and appealing, and the website performs…",
        ago: "3 weeks ago",
        avatarUrl: undefined,
    },
    {
        id: "2",
        name: "buenaventura_de",
        country: "Australia",
        rating: 4,
        text:
            "Exceptional custom website development with precise execution. Every feature was implemented seamlessly, design is modern and appealing, and the website performs…",
        ago: "3 weeks ago",
        avatarUrl: undefined,
    },
    // add more reviews...
];

const options: EmblaOptionsType = {
    loop: true,
    align: "start",
    dragFree: false,   // keep snapping like your screenshot
};

export default function ReviewCarousel() {
    const autoplay = React.useRef(
        Autoplay({ delay: 19500, stopOnInteraction: true })
    );

    const [emblaRef, emblaApi] = useEmblaCarousel(options, [autoplay.current]);
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);

    React.useEffect(() => {
        if (!emblaApi) return;

        const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
        setScrollSnaps(emblaApi.scrollSnapList());
        emblaApi.on("select", onSelect);
        emblaApi.on("reInit", () => {
            setScrollSnaps(emblaApi.scrollSnapList());
            onSelect();
        });
    }, [emblaApi]);

    const scrollPrev = React.useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = React.useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
    const scrollTo = React.useCallback(
        (i: number) => emblaApi?.scrollTo(i),
        [emblaApi]
    );

    return (
        <div className="relative w-full mb-5">
            {/* Header row like “What people loved…” */}
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-semibold">What people loved about this freelancer</h2>
                <div className="flex items-center gap-2">
                    <button
                        onClick={scrollPrev}
                        aria-label="Previous"
                        className="rounded-full p-2 shadow hover:bg-gray-50 active:scale-95 transition"
                    >
                        <ChevronLeftIcon className="h-5 w-5" />
                    </button>
                    <button
                        onClick={scrollNext}
                        aria-label="Next"
                        className="rounded-full p-2 shadow hover:bg-gray-50 active:scale-95 transition"
                    >
                        <ChevronRightIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Embla viewport */}
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                    {reviews.map((r) => (
                        <div
                            key={r.id}
                            className="min-w-0 shrink-0 basis-full md:basis-[100%] lg:basis-[100%] "
                            aria-roledescription="slide"
                        >
                            <ReviewCard review={r} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Dots */}
            <div className="mt-4 flex justify-center gap-2 hidden">
                {scrollSnaps.map((_, i) => (
                    <button
                        key={i}
                        aria-label={`Go to slide ${i + 1}`}
                        onClick={() => scrollTo(i)}
                        className={[
                            "h-2.5 w-2.5 rounded-full transition",
                            i === selectedIndex ? "bg-gray-900" : "bg-gray-300 hover:bg-gray-400",
                        ].join(" ")}
                    />
                ))}
            </div>
        </div>
    );
}

function ReviewCard({ review }: { review: Review }) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
                <Avatar.Root className="h-12 w-12 shrink-0 rounded-full bg-violet-200 grid place-items-center text-white font-semibold">
                    {review.avatarUrl ? (
                        <Avatar.Image
                            className="h-full w-full rounded-full object-cover"
                            src={review.avatarUrl}
                            alt={review.name}
                        />
                    ) : (
                        <span>{review.name?.[0]?.toUpperCase() ?? "U"}</span>
                    )}
                    <Avatar.Fallback className="h-12 w-12 rounded-full bg-violet-500 text-white">
                        {review.name?.[0]?.toUpperCase() ?? "U"}
                    </Avatar.Fallback>
                </Avatar.Root>

                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <p className="truncate font-medium">{review.name}</p>
                        <span className="text-sm text-gray-500">• {review.country}</span>
                        <div aria-label={`${review.rating} stars`} className="ml-2 flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <StarFilledIcon
                                    key={i}
                                    className={`h-4 w-4 ${i < review.rating ? "text-black" : "text-gray-300"}`}
                                />
                            ))}
                        </div>
                        <span className="ml-1 text-sm font-semibold">5</span>
                    </div>
                    <p className="text-sm text-gray-500">{review.ago}</p>
                </div>
            </div>

            <p className="mt-4 text-[15px] leading-6 text-gray-800">
                {review.text}
            </p>
        </div>
    );
}
