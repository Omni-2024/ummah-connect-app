"use client";

import { useState } from "react";
import ProviderList from "@/features/reviews/ProviderList";
import ReviewList from "@/features/reviews/components/ReviewList";
import type { ReviewQuery } from "@/features/reviews/components/ReviewList";
import withAuth from "@/components/withAuth";
import { ADMIN_ROLES } from "@/lib/constants";



export default function AdminReviewPage() {
  const [query, setQuery] = useState<ReviewQuery>({
    providerId: "",
    stars: 0,
    limit: 10,
    offset: 0,
  });
  
  // derive selected provider from query to avoid race between two states
  const selectedProviderId = query.providerId || null;

  const handleProviderSelect = (providerId: string) => {
    setQuery({ providerId, stars: 0, limit: 10, offset: 0 });
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


const Page = withAuth(AdminReviewPage, [
    ADMIN_ROLES.ADMIN,
    ADMIN_ROLES.ROOT,
]);