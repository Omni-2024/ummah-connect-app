"use client";

import { useState } from "react";
import { Setting4, ArrowDown2, ArrowUp2 } from "iconsax-react";
import { cn } from "@/lib/className";
import Separator from "@/components/base/Separator";
import IconButton from "@/components/base/IconButton";
import Label from "@/components/base/form/Label";
import Checkbox from "@/components/base/Checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/base/radio-group";
import {useExploreFilters} from "@/features/explore/context/useExploreFilters";

export const FilterItemWrapper = ({
                                      title,
                                      children,
                                  }: {
    title: string;
    children: React.ReactNode;
}) => {
    const [expanded, setExpanded] = useState(true);
    return (
        <div className="space-y-1">
            <div className="flex items-center justify-between gap-2">
                <h4 className="font-primary text-lg font-bold">{title}</h4>
                <IconButton size="sm" onClick={() => setExpanded((p) => !p)}>
                    {expanded ? <ArrowUp2 className="size-4" /> : <ArrowDown2 className="size-4" />}
                </IconButton>
            </div>
            <div className={cn({ hidden: !expanded })}>{children}</div>
        </div>
    );
};

const MenuFilterItem = ({
                            id,
                            title,
                            onChange,
                            selectedCategories,
                        }: {
    id: string;
    title: string;
    onChange: (id: string) => void;
    selectedCategories: readonly string[];
}) => {
    const checked = selectedCategories.includes(id);
    return (
        <div className="flex items-center justify-between gap-2 py-1">
            <div className="flex items-center gap-2.5">
                <Checkbox id={id} onCheckedChange={() => onChange(id)} checked={checked} />
                <Label htmlFor={id} className="line-clamp-1 select-none font-medium">
                    {title}
                </Label>
            </div>
        </div>
    );
};

const FilterBar = ({ resetPage }: { resetPage: () => void }) => {
    const { categories, profession, specialties, changeProfession, toggleSpecialty } =
        useExploreFilters(resetPage);


    return (
        <aside className="flex h-min min-w-72 max-w-72 flex-col rounded-3xl border p-5">
            <h3 className="flex items-center gap-3 font-primary text-lg font-bold">
                <Setting4 className="size-5 text-black" /> Filters
            </h3>

            <Separator className="my-4" />

            <FilterItemWrapper title="Profession">
                <RadioGroup value={profession || ""} onValueChange={changeProfession}>
                    <div className="flex items-center justify-start gap-2 py-1">
                        <RadioGroupItem value="" id="__all" checked={!profession} />
                        <Label htmlFor="__all" className="select-none text-left font-medium">
                            All
                        </Label>
                    </div>

                    {categories?.sort((a, b) => a.order - b.order).map((category) => {
                        const active = profession === category.id;
                        return (
                            <div key={category.id} className="flex flex-col gap-1.5 py-1">
                                <div
                                    className="flex items-center justify-start gap-2"
                                    // allow clicking the row to toggle/clear
                                    onClick={() => changeProfession(active ? "" : category.id)}
                                >
                                    <RadioGroupItem value={category.id} id={category.id} checked={active} />
                                    <Label htmlFor={category.id} className="line-clamp-1 select-none text-left font-medium">
                                        {category.name}
                                    </Label>
                                </div>

                                {active && !!category.specialists?.length && (
                                    <div className="ml-4 mt-2 flex flex-col">
                                        <div className="mb-1 text-sm font-semibold text-dark-400">Specialists</div>
                                        {category.specialists.map((spec: { id: string; name: string }) => (
                                            <MenuFilterItem
                                                key={spec.id}
                                                id={spec.id}
                                                title={spec.name}
                                                onChange={toggleSpecialty}
                                                selectedCategories={specialties}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </RadioGroup>
            </FilterItemWrapper>

            <Separator className="my-3" />
        </aside>
    );
};

export default FilterBar;
