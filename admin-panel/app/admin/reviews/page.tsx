"use client";

import { useState } from "react";
import ProviderList from "@/features/reviews/ProviderList";
import ReviewList from "@/features/reviews/components/ReviewList";
import type { ReviewQuery } from "@/features/reviews/components/ReviewList";

export default function AdminReviewPage() {
  const [query, setQuery] = useState<ReviewQuery>({
    providerId: "",
    stars: 0,
    limit: 10,
    offset: 0,
  });
  
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);

  const handleProviderSelect = (providerId: string) => {
    // update query first so `ReviewList` mounts with the correct providerId
    setQuery({ providerId, stars: 0, limit: 10, offset: 0 });
    setSelectedProviderId(providerId);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Reviews</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Provider List */}
        <div className="md:col-span-1">
          <ProviderList onSelect={handleProviderSelect} />
        </div>

        {/* Right Column: Review List */}
        <div className="md:col-span-2">
          {selectedProviderId ? (
            <ReviewList
              key={selectedProviderId}
              filterType="provider"
              query={query}
              setQuery={setQuery}
            />
          ) : (
            <p className="text-gray-500">Select a provider to view reviews.</p>
          )}
        </div>
      </div>
    </div>
  );
}
