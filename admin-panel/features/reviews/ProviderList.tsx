"use client";

import { useState, useEffect, useMemo } from "react";
import { useGeneralProviders } from "@/lib/hooks/useGeneralProviders";
import ProviderListSkeleton from "./skeleton/ProviderListReviewSkeleton";

type ProviderListProps = {
  onSelect: (providerId: string) => void;
};

export default function ProviderList({ onSelect }: ProviderListProps) {
  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data, isLoading } = useGeneralProviders({
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
    search: "", // keep API search empty, we filter client-side
  });

  // Auto adjust page if no results
  useEffect(() => {
    if ((data?.data?.length ?? 0) === 0 && page > 1) {
      setPage((prev) => prev - 1);
    }
  }, [data?.data?.length, page]);

  const filteredProviders = useMemo(() => {
    if (!searchQuery) return data?.data || [];
    const q = searchQuery.toLowerCase();
    return (data?.data || []).filter((p) =>
      p.name.toLowerCase().startsWith(q)
    );
  }, [data?.data, searchQuery]);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    onSelect(id);
  };

  if (isLoading || !data) return <ProviderListSkeleton />;

  return (
    <div className="space-y-4 p-4 mt-16 rounded-xl border border-border/50 hover:border-primary/30 bg-gradient-to-r from-slate-50 to-white">
      
      {/* Search */}
      <div className="relative pt-2">
        <input
          type="text"
          placeholder="Search freelancer..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1); // reset page when typing
          }}
          className="w-full pl-4 py-2 bg-white/80 border border-primary/20 rounded-xl shadow-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
        />
      </div>

      {/* Providers */}
      <ul className="space-y-2 pt-2">
        {filteredProviders.map((provider) => {
          const isSelected = selectedId === provider.id;
          return (
            <li
              key={provider.id}
              onClick={() => handleSelect(provider.id)}
              className={`p-3 rounded-xl border cursor-pointer shadow-sm transition-all
                ${
                  isSelected
                    ? "bg-primary-500 text-white border-primary-500"
                    : "bg-white/70 dark:bg-slate-800/50 border-primary/10 hover:bg-primary-100"
                }`}
            >
              {provider.name}
            </li>
          );
        })}
        {!filteredProviders.length && (
          <li className="p-3 text-center text-gray-500">No Freelancers found</li>
        )}
      </ul>

      {/* Pagination */}
      {data?.meta?.total && data.meta.total > PAGE_SIZE && (
        <div className="flex justify-between mt-6">
          <button
            disabled={page <= 1}
            onClick={() => setPage((prev) => prev - 1)}
            className="px-4 py-2 rounded-full border border-primary/20 text-primary hover:bg-primary hover:text-white transition disabled:opacity-40 disabled:hover:bg-transparent"
          >
            Prev
          </button>

          <button
            disabled={page * PAGE_SIZE >= data.meta.total}
            onClick={() => setPage((prev) => prev + 1)}
            className="px-4 py-2 rounded-full border border-primary/20 text-primary hover:bg-primary hover:text-white transition disabled:opacity-40 disabled:hover:bg-transparent"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
