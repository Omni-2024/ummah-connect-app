"use client";

import { useState } from "react";
import { Checkbox } from "@/components/base/checkbox";
import Label from "@/components/base/form/Label";
import { RadioGroup, RadioGroupItem } from "@/components/base/radio-group";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/base/rawAccordion";
import { Slider } from "@/components/base/slider";
import { useServiceState } from "@/features/services/context/useServiceState";
import { MAX_CME_POINTS } from "@/lib/constants";
import { useCategories } from "@/lib/hooks/useCategories";

// professionId, specialistIds[]
export type ServiceCategoryFilterData = [string, string[]];

type ServiceFilterProps = {
  categoryFilter: ServiceCategoryFilterData | [];
  setCategoryFilter: React.Dispatch<React.SetStateAction<ServiceCategoryFilterData | []>>;
  filteredEducators: string[];
  setFilteredEducators: React.Dispatch<React.SetStateAction<string[]>>;
};

const ServiceFilter: React.FC<ServiceFilterProps> = ({
                                                       categoryFilter,
                                                       setCategoryFilter,
                                                       filteredEducators,
                                                       setFilteredEducators,
                                                     }) => {
  const { cmeUp, cmeDown, setCMEUp, setCMEDown } = useServiceState();
  const { data: categoriesData = [], isLoading: categoriesLoading } = useCategories();

  // Safely read current selection (since union allows [])
  const selectedProfessionId = (Array.isArray(categoryFilter) ? categoryFilter[0] : undefined) as
      | string
      | undefined;
  const selectedSpecialistIds = (Array.isArray(categoryFilter) ? categoryFilter[1] : []) as string[];

  return (
      <div className="px-6 flex flex-col">
        <Accordion type="multiple" className="w-full">
          {/* Category (Profession) */}
          <AccordionItem value="category" disabled={categoriesLoading}>
            <AccordionTrigger
              className={`font-primary text-xl font-semibold text-gray-800 rounded-md px-0 py-2 transition-all duration-200
                hover:bg-[#337f7c]/10 `}
            >
              Category
            </AccordionTrigger>

            <AccordionContent>
              <div className="flex flex-col gap-2 mt-3">
                {/* One-level accordion for per-profession expansion */}
                <Accordion type="single" className="w-full" value={selectedProfessionId}>
                  <RadioGroup
                    value={selectedProfessionId}
                    onValueChange={(value) => setCategoryFilter([value, []])}
                  >
                    {categoriesData.map((profession) => {
                      const inputId = `profession-${profession.id}`;
                      const isActive = selectedProfessionId === profession.id;

                      return (
                        <AccordionItem value={profession.id} key={profession.id}>
                          {/* Profession Row */}
                          <div
                            className={`flex items-center gap-3 py-2 px-3 rounded-md cursor-pointer transition-all duration-200
                              ${isActive ? "text-green-900 bg-[#337f7c]/10" : ""}
                              hover:bg-[#337f7c]/10`}
                          >
                            <RadioGroupItem value={profession.id} id={inputId} />
                            <Label htmlFor={inputId} className="cursor-pointer font-medium text-gray-700">
                              {profession.name}
                            </Label>
                          </div>

                          {/* Specialists directly under profession */}
                          <AccordionContent className="pt-2 pb-3 pl-6 flex flex-col gap-1">
                            {profession.specialists?.length ? (
                              <div className="flex flex-col gap-2">
                                {profession.specialists.map((specialist: any) => {
                                  const isChecked =
                                    selectedProfessionId === profession.id &&
                                    selectedSpecialistIds.includes(specialist.id);

                                  const specId = `spec-${profession.id}-${specialist.id}`;

                                  return (
                                    <div
                                      key={specialist.id}
                                      className={`flex items-center gap-3 py-1 px-8 rounded-md transition-all duration-200
                                        ${isChecked ? "text-black" : ""}
                                        `}
                                    >
                                      <Checkbox
                                        value={specialist.id}
                                        id={specId}
                                        checked={isChecked}
                                        onCheckedChange={(checked) => {
                                          const want = Boolean(checked);
                                          setCategoryFilter([
                                            profession.id,
                                            want
                                              ? Array.from(new Set([...selectedSpecialistIds, specialist.id]))
                                              : selectedSpecialistIds.filter((i) => i !== specialist.id),
                                          ]);
                                        }}
                                      />
                                      <label
                                        htmlFor={specId}
                                        className="font-normal truncate text-gray-600"
                                      >
                                        {specialist.name}
                                      </label>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="text-sm text-gray-400 px-2">No specialists available</div>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </RadioGroup>
                </Accordion>
              </div>
            </AccordionContent>
          </AccordionItem>


          {/* CME Points (keep commented out if not needed)
        <AccordionItem value="cme-points">
          <AccordionTrigger className="font-primary text-xl font-bold ">
            CME Points
          </AccordionTrigger>
          <AccordionContent className="pt-3 px-1">
            <div className="flex justify-between pb-1">
              <div className="text-sm font-primary">{cmeDown} Points</div>
              <div className="text-sm font-primary">{cmeUp} Points</div>
            </div>
            <Slider
              min={0}
              step={0.5}
              max={MAX_CME_POINTS}
              defaultValue={[cmeDown, cmeUp]}
              onValueChange={(value) => {
                setCMEDown(value[0]);
                setCMEUp(value[1]);
              }}
              value={[cmeDown, cmeUp]}
            />
          </AccordionContent>
        </AccordionItem>
        */}

          {/* Educators block omitted as per your comment */}
        </Accordion>
      </div>
  );
};

export default ServiceFilter;
