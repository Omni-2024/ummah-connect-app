import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@components/base/Dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/base/Select";
import {
  selectCMEDown,
  selectCMEUp,
  selectProfession,
  selectProfessionName,
  selectSpecialties,
  selectTypes,
} from "@features/explore/context/selectors";
import { exploreActions } from "@features/explore/context/slice";
import { useCategories } from "@lib/hooks/useCategories";
import { useSelector, useDispatch } from "react-redux";
import { FilterItemWrapper } from "./FilterBar";
import { MAX_CME_POINTS } from "@lib/constants";
import Slider from "@components/base/Slider";
import Checkbox from "@components/base/Checkbox";
import { cn } from "@lib/className";
import Label from "@components/base/form/Label";
import IconButton from "@components/base/IconButton";
import { ArrowDown2, ArrowUp2 } from "iconsax-react";
import { useState } from "react";
import { Specialist } from "@/types";
import Button from "@components/base/Button";

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
  const dispatch = useDispatch();
  const { data: categories } = useCategories();
  //
  const profession = useSelector(selectProfession);
  const professionName = useSelector(selectProfessionName);
  const types = useSelector(selectTypes);
  const specialties = useSelector(selectSpecialties);
  const cmeUp = useSelector(selectCMEUp) ?? 15;
  const cmeDown = useSelector(selectCMEDown) ?? 1;
  //
  const resetFilters = () => {
    dispatch(exploreActions.resetFilters());
    dispatch(exploreActions.setCMEUp(MAX_CME_POINTS));
    dispatch(exploreActions.setCMEDown(0));
    resetPage?.();
  };
  //
  const handleProfessionChange = (value: string) => {
    resetPage?.();
    if (value === "all") {
      resetFilters();
    } else {
      dispatch(
        exploreActions.setProfession({
          profession: value,
          professionName:
            categories?.find((cat) => cat.id === value)?.name || "",
        }),
      );
    }
  };
  //
  const handleCMEPointsChange = (value: number[]) => {
    resetPage?.();
    dispatch(exploreActions.setCMEDown(value[0]));
    dispatch(exploreActions.setCMEUp(value[1]));
  };
  //
  const handleCategoryChange = (
    categoryId: string,
    isType: boolean,
    parentTypeId?: string,
    specialtiesData?: Specialist[],
  ) => {
    resetPage?.();
    if (isType) {
      dispatch(
        exploreActions.toggleType({
          id: categoryId,
          specialties: specialtiesData || [],
        }),
      ); // Toggle type selection
    } else {
      if (parentTypeId && !types?.includes(parentTypeId)) {
        dispatch(
          exploreActions.toggleType({ id: parentTypeId, specialties: [] }),
        ); // Ensure parent type is selected
      }
      dispatch(exploreActions.toggleSpecialty(categoryId)); // Toggle specialty selection
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

              {categories
                ?.filter((category) => profession === category.id) // Filter categories based on the selected profession
                .map((category) =>
                  category.type.map((type) => (
                    <MenuFilterItem
                      key={type.id}
                      id={type.id}
                      title={type.name}
                      subMenu={type.specialist.map((specialist) => ({
                        id: specialist.id,
                        title: specialist.name,
                        onChange: (id: string) =>
                          handleCategoryChange(id, false, type.id), // Ensure type is selected
                        selectedCategories: specialties || [],
                      }))}
                      onChange={(id: string) =>
                        handleCategoryChange(id, true, type.id, type.specialist)
                      } // Handling type
                      selectedCategories={types || []}
                    />
                  )),
                )}
            </div>

            <div className="mt-4 space-y-4 pb-44">
              <FilterItemWrapper title="CME Points">
                <div className="space-y-3 py-3">
                  <div className="flex w-full items-center justify-between text-xs font-semibold text-dark-400">
                    <span className="">{cmeDown} Point</span>
                    <span className="">{cmeUp} Point</span>
                  </div>

                  <Slider
                    min={1}
                    step={1}
                    max={MAX_CME_POINTS}
                    defaultValue={[cmeDown, cmeUp]}
                    onValueChange={handleCMEPointsChange}
                    value={[cmeDown, cmeUp]}
                  />
                </div>
              </FilterItemWrapper>
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
