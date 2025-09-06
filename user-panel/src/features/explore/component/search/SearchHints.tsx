import { cn } from "@/lib/className";
import Link from "next/link";
import { forwardRef } from "react";
import { Service } from "@/types";

type SearchResults = {
  title: string;
  description: string;
  href: string;
};

type SearchResultsPreviewProps = {
  hints: Service[];
  open: boolean;
  onClose: () => void;
  limit?: number;
};

const SearchResultsPreview = forwardRef<
  HTMLDivElement,
  SearchResultsPreviewProps
>(({ limit = 5, hints, open, onClose }, ref) => {
  // limit the number of hints to show
  if (hints.length > limit) {
    hints = hints.slice(0, limit);
  }

  return (
    <div
      ref={ref}
      className={cn(
        "relative z-10 hidden w-full",
        open && hints.length !== 0 && "block",
      )}
    >
      <div className="absolute top-2 z-10 w-full gap-1 overflow-auto rounded-xl border bg-white p-2 scrollbar-thin scrollbar-track-primary-50 scrollbar-thumb-dark-200 scrollbar-corner-transparent">
        {hints.map((hint) => (
          <Link
            key={hint.title}
            href={`/service/${hint.slug}`}
            className="flex flex-col gap-1 rounded-lg px-4 py-2 hover:bg-primary-50"
            onClick={onClose}
          >
            <div className="mt-2 text-base font-medium text-black">
              {hint.title}
            </div>
            <div className="text-[13px] font-normal text-dark-400">
              {hint.tagline}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
});

export default SearchResultsPreview;
