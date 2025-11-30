"use client";

import { useAvatarUrl } from "@/hooks/userAvatarUrl";
import { Review } from "@/lib/endpoints/reviewsFns";
import { Teacher } from "iconsax-react";
import Image from "next/image";
import { useEffect, useState } from "react";

type ReviewCardProps = {
  review: Review;
};

export default function ReviewCard({ review }: ReviewCardProps) {
  const [imageError, setImageError] = useState(false);
    const avatarSrc = useAvatarUrl(review.userImageUrl);

  useEffect(() => {
    setImageError(false);
  }, [review.userImageUrl]);

  return (
    <div className="border rounded-xl hover:shadow-sm transition-all duration-200 border-border/50 hover:border-primary/30 bg-gradient-to-r from-slate-50 to-white p-4 flex gap-4">

      {/* === AVATAR === */}
      <div className="relative w-14 h-14 rounded-full border-2 border-[#337f7c] overflow-hidden bg-gradient-to-br from-emerald-400 to-teal-500">
        {imageError ? (
                                <Teacher />
                            ) : (
                                <Image
                                    src={avatarSrc}
                                    fill
                                    alt={review.userImageUrl}
                                    className="rounded-full object-cover"
                                    unoptimized
                                    onError={() => setImageError(true)}
                                />
                            )}
      </div>

      <div className="flex-1">
        <h2 className="font-semibold text-black">{review.userName}</h2>

        <p className="text-gray-600 text-sm mt-1">
          {review.description}
        </p>

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
