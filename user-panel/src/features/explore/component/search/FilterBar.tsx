import { ArrowDown2, ArrowUp2, Setting4 } from "iconsax-react";
import { useState } from "react";

import Checkbox from "@/components/base/Checkbox";
import Label from "@/components/base/form/Label";
import IconButton from "@/components/base/IconButton";
import Separator from "@/components/base/Separator";
import Slider from "@/components/base/Slider";
import { cn } from "@/lib/className";
import { useCategories } from "@/lib/hooks/useCategories";
import { RadioGroup, RadioGroupItem } from "@/components/base/radio-group";
import { Specialist } from "@/types";
import {useExploreState} from "@/features/explore/context/exploreState";

const FilterBar = ({ resetPage }: { resetPage: () => void }) => {

  const {
    profession,
    specialties,
    setProfession,
    setProfessionName,
    setSearchTerm,
    setOffset,
    setLimit,
    setSpecialties
  } =useExploreState()


  const { data: categories } = useCategories();

  const handleProfessionChange = (professionId: string) => {
    resetPage(); // Reset the page number
    if (profession === professionId) {
      setSearchTerm("");
      setOffset(0);
      setLimit(9);
    } else {
      setProfession(professionId)
      setProfessionName(categories?.find((cat) => cat.id === professionId)?.name || "")
    }
  };

  const handleCategoryChange = (
    categoryId: string,
    isType: boolean,
    parentTypeId?: string,
    specialtiesData?: Specialist[],
  ) => {
    resetPage();
    if (isType) {
      setSpecialties(specialtiesData || [])
    }
  };


  return (
    <aside className="flex h-min min-w-72 max-w-72 flex-col rounded-3xl border p-5">
      <h3 className="flex items-center gap-3 font-primary text-lg font-bold">
        <Setting4 className="size-5 text-black" /> Filters
      </h3>

      <Separator className="my-4" />

      <div>
        <FilterItemWrapper title="Subcategory">
          <RadioGroup
            value={profession || ""}
            onValueChange={handleProfessionChange}
          >
            {categories?.map((category) => (
              <div
                key={category.id}
                className={cn("flex flex-col gap-1.5 py-1", {
                  "pointer-events-none opacity-50":
                    profession && profession !== category.id,
                })}
              >
                <div className="flex items-center justify-start gap-2">
                  <RadioGroupItem
                    value={category.id}
                    id={category.id}
                    onClick={() => handleProfessionChange(category.id)}
                    checked={profession === category.id}
                  />
                  <Label
                    htmlFor={category.id}
                    className="line-clamp-1 select-none text-left font-medium"
                  >
                    {category.name}
                  </Label>
                </div>

                {/*{profession === category.id && (*/}
                {/*  <div className="ml-4 flex flex-col">*/}
                {/*    {category.type.map((type) => (*/}
                {/*      <MenuFilterItem*/}
                {/*        key={type.id}*/}
                {/*        id={type.id}*/}
                {/*        title={type.name}*/}
                {/*        subMenu={type.specialist.map((specialist) => ({*/}
                {/*          id: specialist.id,*/}
                {/*          title: specialist.name,*/}
                {/*          onChange: (id: string) =>*/}
                {/*            handleCategoryChange(id, false, type.id), // Ensure type is selected*/}
                {/*          selectedCategories: specialties,*/}
                {/*        }))}*/}
                {/*        onChange={(id: string) =>*/}
                {/*          handleCategoryChange(*/}
                {/*            id,*/}
                {/*            true,*/}
                {/*            type.id,*/}
                {/*            type.specialist,*/}
                {/*          )*/}
                {/*        }*/}
                {/*        selectedCategories={types}*/}
                {/*      />*/}
                {/*    ))}*/}
                {/*  </div>*/}
                {/*)}*/}
              </div>
            ))}
          </RadioGroup>
        </FilterItemWrapper>

        <Separator className="my-3" />

        {/*<FilterItemWrapper title="CME Points">*/}
        {/*  <div className="space-y-3 py-3">*/}
        {/*    <div className="flex w-full items-center justify-between text-xs font-semibold text-dark-400">*/}
        {/*      <span className="">{cmeDown} Point</span>*/}
        {/*      <span className="">{cmeUp} Point</span>*/}
        {/*    </div>*/}

        {/*    <Slider*/}
        {/*      min={0}*/}
        {/*      step={0.5}*/}
        {/*      max={MAX_CME_POINTS}*/}
        {/*      defaultValue={[cmeDown, cmeUp]}*/}
        {/*      onValueChange={handleCMEPointsChange}*/}
        {/*      value={[cmeDown, cmeUp]}*/}
        {/*    />*/}
        {/*  </div>*/}
        {/*</FilterItemWrapper>*/}
      </div>
    </aside>
  );
};
export default FilterBar;

export interface FilterItemWrapperProps {
  title: string;
  children: React.ReactNode;
}
export const FilterItemWrapper = ({
  title,
  children,
}: FilterItemWrapperProps) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-2">
        <h4 className="font-primary text-lg font-bold">{title}</h4>

        <IconButton size="sm" onClick={() => setExpanded((prev) => !prev)}>
          {expanded ? (
            <ArrowUp2 className="size-4" />
          ) : (
            <ArrowDown2 className="size-4" />
          )}
        </IconButton>
      </div>

      <div className={cn({ hidden: !expanded })}>{children}</div>
    </div>
  );
};

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
    <div
      className={cn("flex flex-col gap-1.5 py-1", { "py-2": !subMenu.length })}
    >
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
