"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Searchbar from "@/components/widgets/Searchbar";
import SearchResultsPreview from "./SearchHints";
import { useServicesHints} from "@/lib/hooks/useServices";
import { useDebounce } from "@uidotdev/usehooks";
import { useExploreState } from "@/features/explore/context/useExploreState";

type NavSearchbarProps = {
  onSearch?: () => void;
};

const NavSearchbar = (props: NavSearchbarProps) => {
  const router = useRouter();
  const params = useSearchParams();
  const urlParams = new URLSearchParams();
  const searchTermFromURL = params.get("search_query") || "";

  const inputRef = useRef<HTMLFormElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const { setSearchTerm } = useExploreState();

  const [search, setSearch] = useState<string>("");                // local input
  const [searchResultsOpen, setSearchResultsOpen] = useState(false);

  const debounced = useDebounce(search, 300);
  const { data: searchResults } = useServicesHints({
    limit: 4,
    search: debounced,
  });

  const hints = searchResults?.data ?? [];
  const hasHints = hints.length > 0;

  // Sync URL search term to global + local (optional)
  useEffect(() => {
    if (searchTermFromURL) {
      setSearchTerm(searchTermFromURL);
      setSearch(searchTermFromURL); // keep input in sync so placeholder doesn’t fight value
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTermFromURL]);

  const handleSearchSubmit = (searchTerm: string) => {
    const q = (searchTerm ?? "").trim();
    if (!q) return;
    if (q === searchTermFromURL) return;

    props.onSearch?.();
    setSearchTerm(q);
    urlParams.set("search_query", q);
    router.push(`/explore?${urlParams.toString()}`);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setSearchResultsOpen(true); // open preview as user types
  };

  const handleClickOutside = (event: MouseEvent | TouchEvent) => {
    if (
        inputRef.current?.contains(event.target as Node) ||
        resultsRef.current?.contains(event.target as Node)
    ) {
      return;
    }
    setSearchResultsOpen(false);
  };

  const handleFocus = () => setSearchResultsOpen(true);

  const handleBlur = () => {
    setTimeout(() => {
      if (document.activeElement !== inputRef.current) {
        setSearchResultsOpen(false);
      }
    }, 250);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
      <div className="w-full lg:w-80">
        <Searchbar
            ref={inputRef}
            className="max-w-full"
            value={search}
            onSubmit={handleSearchSubmit}
            placeholder={
              searchTermFromURL
                  ? `Showing results for "${searchTermFromURL}"`
                  : "What do you want to learn?"
            }
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            closePreview={() => setSearchResultsOpen(false)}
        />

        {/* Guard ALL the things */}
        {searchResultsOpen && hasHints && (
            <SearchResultsPreview
                hints={hints.filter((hint) =>
                    (hint.title ?? "").toLowerCase().includes(search.toLowerCase())
                )}
                open={searchResultsOpen}
                onClose={() => setSearchResultsOpen(false)}
                limit={4}
                ref={resultsRef}
            />
        )}
      </div>
  );
};

export default NavSearchbar;
