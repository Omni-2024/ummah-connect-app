import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Searchbar from "@components/widgets/Searchbar";
import { exploreActions } from "@features/explore/context/slice";
import SearchResultsPreview from "./SearchHints";
import { useCoursesHints } from "@lib/hooks/useCourses";
import { useDebounce } from "@uidotdev/usehooks";

type NavSearchbarProps = {
  onSearch?: () => void;
};

const NavSearchbar = (props: NavSearchbarProps) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const params = useSearchParams();
  const searchTermFromURL = params.get("search_query");

  const inputRef = useRef<HTMLFormElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const [search, setSearch] = useState("");

  const [searchResultsOpen, setSearchResultsOpen] = useState(false);

  const { data: searchResults } = useCoursesHints({
    limit: 4,
    search: useDebounce(search, 300),
  });

  useEffect(() => {
    if (searchTermFromURL) {
      dispatch(exploreActions.setSearchTerm(searchTermFromURL));
    }
  }, [searchTermFromURL]);

  const handleSearchSubmit = (searchTerm: string) => {
    if (searchTerm === searchTermFromURL) return;
    if (!searchTerm?.trim()) return;

    props.onSearch?.();
    dispatch(exploreActions.setSearchTerm(search));
    router.push({
      pathname: "/explore",
      query: { search_query: searchTerm },
    });
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
