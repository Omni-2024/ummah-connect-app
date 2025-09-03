import type React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/base/Pagination";

interface AdvancedPaginationProps {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
  visibleRange?: number;
  disabled?: boolean;
}

const AdvancedPagination: React.FC<AdvancedPaginationProps> = ({
  currentPage,
  totalPages,
  onChange,
  visibleRange = 1,
  disabled = false,
}) => {
  const safeCurrentPage = Math.max(1, Math.min(currentPage, totalPages));

  const getPaginationItems = (): (number | string)[] => {
    const pages: (number | string)[] = [];

    pages.push(1);

    if (totalPages <= visibleRange + 4) {
      for (let i = 2; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (safeCurrentPage > visibleRange + 2) {
        pages.push("leading-ellipsis");
      }

      const start = Math.max(2, safeCurrentPage - visibleRange);
      const end = Math.min(totalPages - 1, safeCurrentPage + visibleRange);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (safeCurrentPage < totalPages - visibleRange - 1) {
        pages.push("trailing-ellipsis");
      }
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const handlePrevious = () => {
    if (!disabled && safeCurrentPage > 1) {
      onChange(safeCurrentPage - 1);
    }
  };

  const handleNext = () => {
    if (!disabled && safeCurrentPage < totalPages) {
      onChange(safeCurrentPage + 1);
    }
  };

  if (totalPages <= 1) return null;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={handlePrevious}
            aria-disabled={safeCurrentPage === 1}
            className="px-0 w-10"
          />
        </PaginationItem>

        {getPaginationItems().map((page) =>
          typeof page === "number" ? (
            <PaginationItem key={`page-${page}`}>
              <PaginationLink
                isActive={page === safeCurrentPage}
                onClick={() => onChange(page)}
                aria-current={page === safeCurrentPage ? "page" : undefined}
                className="px-0 w-10"
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationEllipsis className="px-0 w-10" />
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            onClick={handleNext}
            aria-disabled={safeCurrentPage === totalPages}
            className="px-0 w-10"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default AdvancedPagination;
