import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/base/Dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/base/Select";
import { useCategories } from "@/lib/hooks/useCategories";
import { FilterItemWrapper } from "./FilterBar";
import Slider from "@/components/base/Slider";
import Checkbox from "@/components/base/Checkbox";
import { cn } from "@/lib/className";
import Label from "@/components/base/form/Label";
import IconButton from "@/components/base/IconButton";
import { ArrowDown2, ArrowUp2 } from "iconsax-react";
import { useState } from "react";
import { Specialist } from "@/types";
import Button from "@/components/base/Button";
import {useExploreState} from "@/features/explore/context/exploreState";

interface FilterModalProps {
  showModal: boolean;
  handleModalChange: (open: boolean) => void;
  resetPage?: () => void;
}

const FilterModal = ({
  showModal,
  handleModalChange,
  resetPage,
}: FilterModalProps) => {
  const { data: categories } = useCategories();


  const {
    profession,
    professionName,
    specialties,
    setProfession,
    setProfessionName,
    setSearchTerm,
    setOffset,
    setLimit,
    setSpecialties


  } =useExploreState()
  //
  const resetFilters = () => {
    setSearchTerm("");
    setOffset(0);
    setLimit(9);
    resetPage?.();
  };
  //
  const handleProfessionChange = (value: string) => {
    resetPage?.();
    if (value === "all") {
      resetFilters();
    } else {
      setProfession(value)
      setProfessionName(categories?.find((cat) => cat.id === value)?.name || "")
    }
  };
  //
  const handleCategoryChange = (
    categoryId: string,
    isType: boolean,
    parentTypeId?: string,
    specialtiesData?: string[],
  ) => {
    resetPage?.();
    if (isType) {
      setSpecialties(specialtiesData || [])
    }
  };
  //
  return (
    <Dialog open={showModal} onOpenChange={handleModalChange}>
      <DialogContent className="h-full max-h-screen max-w-screen-lg lg:h-auto lg:max-h-full lg:max-w-3xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <DialogTitle>Filters</DialogTitle>
          </div>
        </DialogHeader>

        <div className="">
          <div className="h-dvh overflow-y-auto p-5 scrollbar-thin lg:h-auto">
            {/* Select Profession */}
            <div className="space-y-4">
              <label className="font-primary text-lg font-bold">
                Profession
              </label>
              <Select
                onValueChange={handleProfessionChange}
                defaultValue={profession || "all"}
              >
                <SelectTrigger>
                  <SelectValue placeholder>
                    {professionName || "All"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="all" value="all">
                    All
                  </SelectItem>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Select Subcategory */}
            <div className="mt-4 space-y-4">
              {profession && (
                <label className="font-primary text-lg font-bold">
                  Subcategory
                </label>
              )}
            </div>

            <div className="fixed bottom-0 left-0 right-0 flex flex-col space-y-2 bg-white px-2 py-4 lg:hidden">
              <Button
                onClick={() => handleModalChange(false)}
                variant="primary"
              >
                Show Results
              </Button>

              <Button
                onClick={resetFilters}
                variant="secondary"
                className="text-primary-500"
              >
                Clear All
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FilterModal;

interface MenuFilterItemProps {
  id: string;
  title: string;
  subMenu?: MenuFilterItemProps[];
  onChange: (id: string) => void;
  selectedCategories: string[];
}
const MenuFilterItem = ({
  id,
  title,
  subMenu = [],
  onChange,
  selectedCategories,
}: MenuFilterItemProps) => {
  const [expanded, setExpanded] = useState(false);

  const handleCheckboxChange = () => {
    onChange(id);
  };

  return (
    <div className={cn("flex flex-col gap-4", { "py-2": !subMenu.length })}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <Checkbox
            id={id}
            onCheckedChange={handleCheckboxChange}
            checked={selectedCategories.includes(id)}
          />
          <Label htmlFor={id} className="line-clamp-1 select-none font-medium">
            {title}
          </Label>
        </div>

        {subMenu.length > 0 && (
          <IconButton size="sm" onClick={() => setExpanded((prev) => !prev)}>
            {expanded ? (
              <ArrowUp2 className="size-4" />
            ) : (
              <ArrowDown2 className="size-4" />
            )}
          </IconButton>
        )}
      </div>

      {expanded && subMenu.length > 0 && (
        <div className="ml-2.5 flex flex-col">
          {subMenu.map((subMenuItem) => (
            <MenuFilterItem
              key={subMenuItem.id}
              id={subMenuItem.id}
              title={subMenuItem.title}
              subMenu={subMenuItem.subMenu}
              onChange={subMenuItem.onChange}
              selectedCategories={subMenuItem.selectedCategories}
            />
          ))}
        </div>
      )}
    </div>
  );
};
