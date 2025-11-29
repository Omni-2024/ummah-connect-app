"use client";

import { Review } from "@/lib/endpoints/reviewsFns";

type ReviewCardProps = {
  review: Review;
};

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="border rounded-xl hover:shadow-sm transition-all duration-200 border-border/50 hover:border-primary/30 bg-gradient-to-r from-slate-50 to-white p-4 flex gap-4">
      <img
        src={review.userImageUrl}
        className="w-12 h-12 rounded-full border object-cover"
      />

      <div className="flex-1">
        <h2 className="font-semibold text-black">{review.userName}</h2>
        <p className="text-gray-600 text-sm mt-1">{review.description}</p>

        {/* Stars */}
        <div className="flex mt-2">
          {Array.from({ length: review.stars }).map((_, i) => (
            <span key={i} className="text-yellow-500">★</span>
          ))}
          {Array.from({ length: 5 - review.stars }).map((_, i) => (
            <span key={i} className="text-gray-300">★</span>
          ))}
        </div>

        <p className="text-xs text-gray-400 mt-1">
          {new Date(review.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
