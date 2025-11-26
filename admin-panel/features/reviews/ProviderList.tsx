"use client";

import { useState, useEffect } from "react";
import { useGeneralProviders } from "@/lib/hooks/useGeneralProviders";

type ProviderListProps = {
  onSelect: (providerId: string) => void;
};

export default function ProviderList({ onSelect }: ProviderListProps) {
  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, refetch } = useGeneralProviders({
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
    search,
  });

  useEffect(() => {
    if ((data?.data?.length ?? 0) === 0 && page > 1) {
      setPage((prev) => prev - 1);
    }
  }, [data?.data?.length, page]);

  if (isLoading) return <p>Loading providers...</p>;
  if (isError)
    return (
      <p>
        Error loading providers.{" "}
        <button onClick={() => refetch()} className="underline text-blue-600">
          Retry
        </button>
      </p>
    );

  return (
    <div className="space-y-4">
      {/* Search */}
      <input
        type="text"
        placeholder="Search provider..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 border rounded"
      />

      {/* Providers List */}
      <ul className="space-y-2">
        {data?.data?.map((provider) => (
          <li
            key={provider.id}
            className="cursor-pointer p-2 border rounded hover:bg-gray-100"
            onClick={() => onSelect(provider.id)}
          >
            {provider.name}
          </li>
        ))}
      </ul>

      {/* Pagination */}
      {data?.meta?.total && data.meta.total > PAGE_SIZE && (
        <div className="flex justify-between mt-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((prev) => prev - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <button
            disabled={page * PAGE_SIZE >= data.meta.total}
            onClick={() => setPage((prev) => prev + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
