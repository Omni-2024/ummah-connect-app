"use client";

import { useState, useEffect, useMemo } from "react";
import { useGeneralProviders } from "@/lib/hooks/useGeneralProviders";
import { Search, X } from "lucide-react";
import ProviderListSkeleton from "./skeleton/ProviderListReviewSkeleton";

type ProviderListProps = {
  onSelect: (providerId: string) => void;
};

export default function ProviderList({ onSelect }: ProviderListProps) {
  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);

  const [pendingSearch, setPendingSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data, isLoading, isError } = useGeneralProviders({
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
    search: "",
  });

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

  const executeSearch = () => {
    setSearchQuery(pendingSearch.trim());
    setPage(1);
  };

  const clearSearch = () => {
    setPendingSearch("");
    setSearchQuery("");
    setPage(1);
  };

  if (isLoading || !data) return <ProviderListSkeleton />;

  return (
    <div className="space-y-4 p-4 mt-16 rounded-xl border border-border/50 hover:border-primary/30 bg-gradient-to-r from-slate-50 to-white">
      
      {/* Search */}
      <div className="relative pt-2">
        <input
          type="text"
          placeholder="Search provider..."
          value={pendingSearch}
          onChange={(e) => setPendingSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && executeSearch()}
          className="w-full pl-4 pr-12 py-2 bg-white/80 border border-primary/20 rounded-xl shadow-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
        />

        {pendingSearch && (
          <button
            onClick={clearSearch}
            className="absolute right-10 top-1/2 -translate-y-2.5 text-gray-500 hover:text-red-500 transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={executeSearch}
          className="absolute right-2 top-1/2 -translate-y-2.5 p-1.5 rounded-lg bg-primary-700 text-white hover:bg-primary-800 transition"
        >
          <Search className="w-4 h-4" />
        </button>
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
      </ul>

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
