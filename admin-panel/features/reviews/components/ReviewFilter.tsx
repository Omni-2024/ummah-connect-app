"use client";

type FilterType = "service" | "provider";

type ReviewQuery = {
  stars: number;
  limit: number;
  offset: number;
} & (
  | { serviceId: string; providerId?: undefined }
  | { providerId: string; serviceId?: undefined }
);

type ReviewFilterProps = {
  filterType: FilterType;
  setFilterType: (v: FilterType) => void;
  query: ReviewQuery;
  setQuery: (q: ReviewQuery) => void;
};

export default function ReviewFilter({
  filterType,
  setFilterType,
  query,
  setQuery,
}: ReviewFilterProps) {
  const update = (key: string, value: any) => {
    setQuery({ ...query, [key]: value, offset: 0 });
  };

  return (
    <div className="bg-white border rounded-xl shadow p-4 mb-5">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Filter Type */}
        <div>
          <label className="text-sm font-semibold">Filter Type</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as FilterType)}
            className="w-full p-2 border rounded bg-white text-black"
          >
            <option value="service">By Service</option>
            <option value="provider">By Provider</option>
          </select>
        </div>

        {/* ID Input */}
        <div>
          <label className="text-sm font-semibold">
            {filterType === "service" ? "Service ID" : "Provider ID"}
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded bg-white text-black"
            value={
              filterType === "service"
                ? query.serviceId || ""
                : query.providerId || ""
            }
            onChange={(e) =>
              update(
                filterType === "service" ? "serviceId" : "providerId",
                e.target.value
              )
            }
          />
        </div>

        {/* Stars */}
        <div>
          <label className="text-sm font-semibold">Stars</label>
          <select
            value={query.stars}
            onChange={(e) => update("stars", Number(e.target.value))}
            className="w-full p-2 border rounded"
          >
            <option value={0}>All</option>
            <option value={5}>★★★★★</option>
            <option value={4}>★★★★☆</option>
            <option value={3}>★★★☆☆</option>
            <option value={2}>★★☆☆☆</option>
            <option value={1}>★☆☆☆☆</option>
          </select>
        </div>
      </div>
    </div>
  );
}
