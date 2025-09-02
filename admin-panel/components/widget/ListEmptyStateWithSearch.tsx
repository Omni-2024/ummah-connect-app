import Button from "@/components/ui/button";
import { Filter, SearchX } from "lucide-react";

export const ListEmptyStateWithSearch = ({
  searchQuery,
  name,
  onClear,
}: {
  searchQuery: string;
  name: string;
  onClear: () => void;
}) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
    <div className="bg-primary-50/50 p-6 rounded-full mb-6">
      <SearchX className="w-12 h-12 text-primary-500" />
    </div>

    <h3 className="text-xl font-semibold text-gray-900 mb-2">
      No matches found
    </h3>

    <p className="text-gray-500 text-center max-w-md">
      {`We couldn't find any ${name} matching "${searchQuery}". Try adjusting your search term.`}
    </p>

    <Button onClick={onClear} variant="secondary" className="gap-2 my-6">
      <Filter className="w-4 h-4" />
      Clear Search
    </Button>
  </div>
);
