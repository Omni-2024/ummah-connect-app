import Button from "@/components/base/button";
import { FileX2, FilterX, Plus, SearchX } from "lucide-react";
import LinkButton from "@/components/base/LinkButton";

export const ListEmptyStateWithFilters = ({
  isFiltered,
  onReset,
  name,
}: {
  isFiltered: boolean;
  onReset: () => void;
  name: string;
}) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
    <div className="bg-primary-50/50 p-6 rounded-full mb-6">
      {isFiltered ? (
        <SearchX className="w-12 h-12 text-primary-500" />
      ) : (
        <FileX2 className="w-12 h-12 text-primary-500" />
      )}
    </div>

    <h3 className="text-xl font-semibold text-gray-900 mb-2">
      {isFiltered ? "No matches found" : `No ${name} yet`}
    </h3>

    <p className="text-gray-500 text-center max-w-md mb-6">
      {isFiltered
        ? `We couldn't find any ${name} matching your current filters. Try adjusting your search criteria.`
        : `Get started by creating your first ${name}. Click the 'Add New' button to begin.`}
    </p>

    {isFiltered ? (
      <Button onClick={onReset} variant="secondary" className="gap-2">
        <FilterX className="w-4 h-4" />
        Reset Filters
      </Button>
    ) : (
      <LinkButton href="/admin/services/create" variant="secondary">
        <Plus className="w-4 h-4" />
        Add New {name}
      </LinkButton>
    )}
  </div>
);
