"use client";

import { useAvatarUrl } from "@/hooks/userAvatarUrl";
import { Review, deleteReview } from "@/lib/endpoints/reviewsFns";
import { Teacher } from "iconsax-react";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

type ReviewCardProps = {
  review: Review;
  onDeleted?: () => void;
};

export default function ReviewCard({ review, onDeleted }: ReviewCardProps) {
  const [imageError, setImageError] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const avatarSrc = useAvatarUrl(review.userImageUrl);

  useEffect(() => {
    setImageError(false);
  }, [review.userImageUrl]);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteReview(review.id);
      onDeleted?.();
      setConfirmOpen(false);
    } catch (e) {
      console.error(e);
      alert("Failed to delete review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative border rounded-xl hover:shadow-sm transition-all duration-200 border-border/50 hover:border-primary/30 bg-gradient-to-r from-slate-50 to-white p-4 flex gap-4">

      {/* === AVATAR === */}
      <div className="relative w-14 h-14 rounded-full border-2 border-[#337f7c] overflow-hidden bg-gradient-to-br from-emerald-400 to-teal-500">
        {imageError ? (
          <Teacher />
        ) : (
          <Image
            src={avatarSrc}
            fill
            alt={review.userName}
            className="rounded-full object-cover"
            unoptimized
            onError={() => setImageError(true)}
          />
        )}
      </div>

      {/* === CONTENT === */}
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

      {/* === DELETE ICON === */}
      <button
        onClick={() => setConfirmOpen(true)}
        className="absolute bottom-4 right-4 text-red-600 hover:text-red-700"
        aria-label="Delete review"
      >
        <Trash2 size={18} />
      </button>

      {/* === CONFIRMATION MODAL === */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">

            {/* HEADER */}
            <div className="flex items-center gap-3 px-6 py-4 border-b">
              
              <h3 className="text-lg font-semibold text-gray-900">
                Delete Review
              </h3>
            </div>

            {/* BODY */}
            <div className="px-6 py-5">
              <p className="text-sm text-gray-600 leading-relaxed">
                Are you sure you want to delete this review?
                <br />
                <span className="text-red-600 font-medium">
                  This action cannot be undone.
                </span>
              </p>
            </div>

            {/* FOOTER */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50 rounded-b-2xl">
              <button
                onClick={() => setConfirmOpen(false)}
                disabled={loading}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-60"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
