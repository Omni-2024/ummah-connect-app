import {
  SearchNormal1 as MagnifyingGlassIcon,
  CloseCircle,
} from "iconsax-react";
import { forwardRef, useEffect, useRef } from "react";

import IconButton from "@/components/base/IconButton";
import { cn } from "@/lib/className";
import { Cross1Icon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import {useExploreState} from "@/features/explore/context/useExploreState";

interface Props {
  value?: string;
  className?: string;
  placeholder?: string;
  defaultValue?: string;
  onSubmit?: (value: string) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onClick?: () => void;
  closePreview?: () => void;
}

const Searchbar = forwardRef<HTMLFormElement, Props>(
  (
    {
      value,
      onSubmit,
      onChange,
      onBlur,
      onFocus,
      onClick,
      className,
      defaultValue,
      placeholder = "What do you want to learn?",
      closePreview,
    },
    ref,
  ) => {
    const router = useRouter();
    const input = useRef<HTMLInputElement>(null);
      const {
          searchTerm:search,
      } =useExploreState()


    const handleSubmit = () => {
      if (onSubmit) {
        onSubmit(input.current?.value || "");
        closePreview?.();
      }
    };

    const handleClear = () => {
      onChange?.({
        target: { value: "" },
      } as React.ChangeEvent<HTMLInputElement>);
      // resetPage?.();
      // dispatch(exploreActions.setSearchTerm(""));
      // router.push("/explore");
    };

    useEffect(() => {
      onChange?.({
        target: { value: search },
      } as React.ChangeEvent<HTMLInputElement>);
    }, [search]);

    return (
      <form
        ref={ref}
        className="relative w-full"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <input
          ref={input}
          value={value}
          onChange={(e) => onChange?.(e)}
          onFocus={() => onFocus?.()}
          onBlur={() => onBlur?.()}
          onClick={() => onClick?.()}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className={cn(
            "h-12 w-full rounded-full border border-dark-50 pl-5 pr-24 text-sm text-black outline-none placeholder:text-dark-100 focus:border-primary-400",
            className,
          )}
        />
        <div className="absolute right-3 top-0 flex h-full items-center gap-2">
          {value && (
            <IconButton
              type="button"
              variant="secondary"
              onClick={handleClear}
              className="hover:bg-gray-100"
            >
              <Cross1Icon />
            </IconButton>
          )}
          <IconButton type="submit" variant="primary" onClick={handleSubmit}>
            <MagnifyingGlassIcon className="size-4" color="white" />
          </IconButton>
        </div>
      </form>
    );
  },
);

export default Searchbar;
