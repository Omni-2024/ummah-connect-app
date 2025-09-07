"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import Label from "@/components/base/form/Label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/base/rawAccordion";
import { Slider } from "@/components/ui/slider";
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
      <div className="px-6 flex flex-col bg-white">
        <Accordion type="multiple" className="w-full bg-white">
          {/* Category (Profession) */}
          <AccordionItem value="category" disabled={categoriesLoading}>
            <AccordionTrigger className="font-primary text-xl font-bold ">
              Category
            </AccordionTrigger>

            <AccordionContent>
              <div className="flex items-center gap-2 ">
                {/* One-level accordion to keep per-profession expansion (optional) */}
                <Accordion type="single" className="w-full" value={selectedProfessionId}>
                  <RadioGroup
                      value={selectedProfessionId}
                      onValueChange={(value) => {
                        // switching profession resets specialists
                        setCategoryFilter([value, []]);
                      }}
                  >
                      {categoriesData.map((profession) => {
                          const inputId = `profession-${profession.id}`; // unique + matches htmlFor
                          return (
                              <AccordionItem value={profession.id} key={profession.id}>
                                  <div className="flex items-center gap-2">
                                      <RadioGroupItem value={profession.id} id={inputId} />
                                      <Label htmlFor={inputId} className="cursor-pointer">
                                          {profession.name}
                                      </Label>
                                  </div>

                                  {/* Specialists directly under profession */}
                                  <AccordionContent className="pt-2 pb-3">
                                      {profession.specialists?.length ? (
                                          <div className="flex flex-col gap-2 px-1">
                                              {profession.specialists.map((specialist: any) => {
                                                  const isChecked =
                                                      selectedProfessionId === profession.id &&
                                                      selectedSpecialistIds.includes(specialist.id);

                                                  const specId = `spec-${profession.id}-${specialist.id}`;

                                                  return (
                                                      <div key={specialist.id} className="flex items-center gap-3">
                                                          <Checkbox
                                                              value={specialist.id}
                                                              id={specId}
                                                              checked={isChecked}
                                                              onCheckedChange={(checked) => {
                                                                  const want = Boolean(checked);
                                                                  if (want) {
                                                                      setCategoryFilter([
                                                                          profession.id,
                                                                          Array.from(new Set([...selectedSpecialistIds, specialist.id])),
                                                                      ]);
                                                                  } else {
                                                                      setCategoryFilter([
                                                                          profession.id,
                                                                          selectedSpecialistIds.filter((i) => i !== specialist.id),
                                                                      ]);
                                                                  }
                                                              }}
                                                          />
                                                          <label htmlFor={specId} className="font-normal truncate w-60">
                                                              {specialist.name}
                                                          </label>
                                                      </div>
                                                  );
                                              })}
                                          </div>
                                      ) : (
                                          <div className="text-sm text-muted-foreground px-1">No specialists available</div>
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
