"use client";

import { useState } from "react";
import ProviderList from "@/features/reviews/ProviderList";
import ReviewList from "@/features/reviews/components/ReviewList";
import type { ReviewQuery } from "@/features/reviews/components/ReviewList";
import withAuth from "@/components/withAuth";
import { ADMIN_ROLES } from "@/lib/constants";
import { Star } from "lucide-react";
import { OnboardingGuard } from "@/features/auth/onboardingGuard";


export default function AdminReviewPage() {
  const [query, setQuery] = useState<ReviewQuery>({
    providerId: "",
    stars: 0,
    limit: 10,
    offset: 0,
  });

  const selectedProviderId = query.providerId || null;

  const handleProviderSelect = (providerId: string) => {
    setQuery({ providerId, stars: 0, limit: 10, offset: 0 });
  };

  return (
    <OnboardingGuard>
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
            <div className="flex flex-col items-center justify-center h-full py-16 border border-dashed border-primary/20 rounded-xl bg-white/60 dark:bg-slate-800/40">
              <Star className="w-12 h-12 text-primary-500 mb-3" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Select a freelancer
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Choose a freelancer from the panel to view their reviews.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
    </OnboardingGuard>
  );
}

const Page = withAuth(AdminReviewPage, [
  ADMIN_ROLES.ADMIN,
  ADMIN_ROLES.ROOT,
]);

