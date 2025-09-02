import { useRouter,useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Searchbar from "@/components/widgets/Searchbar";
import SearchResultsPreview from "./SearchHints";
import { useCoursesHints } from "@/lib/hooks/useServices";
import { useDebounce } from "@uidotdev/usehooks";
import {useExploreState} from "@/features/explore/context/exploreState";

type NavSearchbarProps = {
  onSearch?: () => void;
};

const NavSearchbar = (props: NavSearchbarProps) => {
  const router = useRouter();
  const params = useSearchParams();
  const urlParams = new URLSearchParams();
  const searchTermFromURL = params.get("search_query");

  const inputRef = useRef<HTMLFormElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const {
    searchTerm,
    setSearchTerm
  } =useExploreState()

  const [search, setSearch] = useState("");

  const [searchResultsOpen, setSearchResultsOpen] = useState(false);

  const { data: searchResults } = useCoursesHints({
    limit: 4,
    search: useDebounce(search, 300),
  });

  useEffect(() => {
    if (searchTermFromURL) {
      setSearchTerm(searchTermFromURL)
    }
  }, [searchTermFromURL]);

  const handleSearchSubmit = (searchTerm: string) => {
    if (searchTerm === searchTermFromURL) return;
    if (!searchTerm?.trim()) return;

    props.onSearch?.();
    setSearchTerm(search)
    urlParams.set("search_query", searchTerm);

    router.push(`/explore?${urlParams.toString()}`);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
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

  const handleFocus = () => {
    setSearchResultsOpen(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      if (document.activeElement !== inputRef.current) {
        setSearchResultsOpen(false);
      }
    }, 500);
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
      {searchResults && searchResults.data.length > 0 && (
        <SearchResultsPreview
          hints={searchResults?.data.filter((hint) =>
            hint.title.toLowerCase().includes(search.toLowerCase()),
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
