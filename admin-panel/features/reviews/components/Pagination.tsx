"use client";

type PaginationProps = {
  meta: { total: number; limit: number; offset: number };
  query: any;
  setQuery: (q: any) => void;
};

export default function Pagination({ meta, query, setQuery }: PaginationProps) {
  const next = meta.offset + meta.limit < meta.total;
  const prev = meta.offset > 0;

  const nextPage = () => setQuery({ ...query, offset: query.offset + query.limit });
  const prevPage = () =>
    setQuery({ ...query, offset: Math.max(0, query.offset - query.limit) });

  return (
    <div className="flex justify-between mt-6">
      <button
        disabled={!prev}
        onClick={prevPage}
        className="px-4 py-2 bg-gray-100 rounded disabled:opacity-40"
      >
        Previous
      </button>

      <button
        disabled={!next}
        onClick={nextPage}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}
