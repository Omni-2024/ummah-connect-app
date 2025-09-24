"use client";
import Button from "@/components/base/Button";

export function ReviewsPagination({
                                      total,
                                      limit,
                                      offset,
                                      onPageChange,
                                  }: {
    total: number;
    limit: number;
    offset: number;
    onPageChange: (nextOffset: number) => void;
}) {
    const totalPages = Math.max(1, Math.ceil(total / (limit || 1)));
    const currentPage = Math.floor((offset || 0) / (limit || 1)) + 1;

    const canPrev = currentPage > 1;
    const canNext = currentPage < totalPages;

    return (
        <div className="flex items-center justify-between pt-2">
      <span className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
            <div className="flex gap-2">
                <Button
                    size="sm"
                    variant="secondary"
                    disabled={!canPrev}
                    onClick={() => onPageChange(Math.max(0, offset - limit))}
                >
                    Prev
                </Button>
                <Button
                    size="sm"
                    variant="secondary"
                    disabled={!canNext}
                    onClick={() => onPageChange(offset + limit)}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
