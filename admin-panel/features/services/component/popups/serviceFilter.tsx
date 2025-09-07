import {Checkbox} from "@/components/ui/checkbox";
import Label from "@/components/base/form/Label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/base/rawAccordion";
import {Slider} from "@/components/ui/slider";
import { useServiceState } from "@/features/services/context/useServiceState";
import { MAX_CME_POINTS } from "@/lib/constants";
import { useCategories } from "@/lib/hooks/useCategories";
// import { useEducators } from "@/lib/hooks/userEducators";

// Category , SubCategory[], Specialist[]
export type ServiceCategoryFilterData = [string, string[], string[]];

type ServiceFilterProps = {
  categoryFilter: ServiceCategoryFilterData | [];
  setCategoryFilter: React.Dispatch<
    React.SetStateAction<ServiceCategoryFilterData | []>
  >;
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
  // const { data: educatorsData, isLoading: educatorsLoading } = useEducators({
  //   limit: 20,
  //   offset: 0,
  //   search: "",
  // });

  const { data: categoriesData, isLoading: categoriesLoading } =
    useCategories();

  return (
    <div className="px-6 flex flex-col">
      <Accordion type="multiple" className="w-full">
        <AccordionItem value="category" disabled={categoriesLoading}>
          <AccordionTrigger className="font-primary text-xl font-bold ">
            Category
          </AccordionTrigger>

          <AccordionContent>
            <div className="flex items-center gap-2">
              <Accordion
                type="single"
                className="w-full"
                value={categoryFilter[0] as string}
              >
                {/*<RadioGroup*/}
                {/*  onValueChange={(value) => {*/}
                {/*    setCategoryFilter([value, [], []]);*/}
                {/*  }}*/}
                {/*>*/}
                {/*  {categoriesData?.map((category) => (*/}
                {/*    <AccordionItem value={category.id} key={category.id}>*/}
                {/*      <div className="flex justify-between items-center">*/}
                {/*        <div>*/}
                {/*          <RadioGroupItem*/}
                {/*            value={category.id}*/}
                {/*            key={category.id}*/}
                {/*            id={category.id}*/}
                {/*            label={category.name}*/}
                {/*          />*/}
                {/*        </div>*/}
                {/*      </div>*/}

                {/*      <AccordionContent className="pb-0">*/}
                {/*        <Accordion type="multiple" className="px-3 py-2">*/}
                {/*          {category.specialists.map((subCategory) => (*/}
                {/*            <AccordionItem*/}
                {/*              value={subCategory.id}*/}
                {/*              key={subCategory.id}*/}
                {/*            >*/}
                {/*              <div className="flex  py-1 text-left items-center justify-between">*/}
                {/*                <Checkbox*/}
                {/*                  value={subCategory.id}*/}
                {/*                  key={subCategory.id}*/}
                {/*                  id={`${category.name}-${subCategory.id}`}*/}
                {/*                  checked={*/}
                {/*                    categoryFilter[0] === category.id &&*/}
                {/*                    categoryFilter[1]?.includes(subCategory.id)*/}
                {/*                  }*/}
                {/*                  onCheckedChange={(checked) => {*/}
                {/*                    if (checked) {*/}
                {/*                      setCategoryFilter([*/}
                {/*                        category.id,*/}
                {/*                        [*/}
                {/*                          ...(categoryFilter[1] ?? []),*/}
                {/*                          subCategory.id,*/}
                {/*                        ],*/}
                {/*                        [*/}
                {/*                          ...(categoryFilter[2] ?? []),*/}
                {/*                          ...subCategory.specialist.map(*/}
                {/*                            (i) => i.id*/}
                {/*                          ),*/}
                {/*                        ],*/}
                {/*                      ]);*/}
                {/*                    } else {*/}
                {/*                      if (*/}
                {/*                        categoryFilter[1]?.includes(*/}
                {/*                          subCategory.id*/}
                {/*                        )*/}
                {/*                      ) {*/}
                {/*                        setCategoryFilter([*/}
                {/*                          category.id,*/}
                {/*                          categoryFilter[1]?.filter(*/}
                {/*                            (i) => i !== subCategory.id*/}
                {/*                          ) ?? [],*/}
                {/*                          categoryFilter[2]?.filter(*/}
                {/*                            (c) =>*/}
                {/*                              !subCategory.specialist*/}
                {/*                                .map((i) => i.id)*/}
                {/*                                .includes(c)*/}
                {/*                          ) ?? [],*/}
                {/*                        ]);*/}
                {/*                      }*/}
                {/*                    }*/}
                {/*                  }}*/}
                {/*                />*/}
                {/*                <label*/}
                {/*                  htmlFor={`${category.name}-${subCategory.id}`}*/}
                {/*                  className="font-normal truncate w-60"*/}
                {/*                >*/}
                {/*                  {subCategory.name}*/}
                {/*                </label>*/}
                {/*                <AccordionTrigger className="font-primary text-base font-medium py-0.5">*/}
                {/*                  {" "}*/}
                {/*                </AccordionTrigger>*/}
                {/*              </div>*/}
                {/*              <AccordionContent className="pt-0 pb-2">*/}
                {/*                {subCategory.specialist.map((specialist) => (*/}
                {/*                  <div*/}
                {/*                    key={specialist.id}*/}
                {/*                    className="flex items-center px-3 gap-3"*/}
                {/*                  >*/}
                {/*                    <Checkbox*/}
                {/*                      value={specialist.id}*/}
                {/*                      id={`${subCategory.name}-${specialist.id}`}*/}
                {/*                      checked={*/}
                {/*                        categoryFilter[0] === category.id &&*/}
                {/*                        categoryFilter[1]?.includes(*/}
                {/*                          subCategory.id*/}
                {/*                        ) &&*/}
                {/*                        categoryFilter[2]?.includes(*/}
                {/*                          specialist.id*/}
                {/*                        )*/}
                {/*                      }*/}
                {/*                      onCheckedChange={(checked) => {*/}
                {/*                        if (checked) {*/}
                {/*                          setCategoryFilter([*/}
                {/*                            category.id,*/}
                {/*                            [*/}
                {/*                              ...(categoryFilter[1] ?? []),*/}
                {/*                              subCategory.id,*/}
                {/*                            ],*/}
                {/*                            [*/}
                {/*                              ...(categoryFilter[2] ?? []),*/}
                {/*                              specialist.id,*/}
                {/*                            ],*/}
                {/*                          ]);*/}
                {/*                        } else {*/}
                {/*                          if (*/}
                {/*                            categoryFilter[2]?.includes(*/}
                {/*                              specialist.id*/}
                {/*                            )*/}
                {/*                          ) {*/}
                {/*                            setCategoryFilter([*/}
                {/*                              category.id,*/}
                {/*                              categoryFilter[1] ?? [],*/}
                {/*                              categoryFilter[2]?.filter(*/}
                {/*                                (i) => i !== specialist.id*/}
                {/*                              ) ?? [],*/}
                {/*                            ]);*/}
                {/*                          }*/}
                {/*                        }*/}
                {/*                      }}*/}
                {/*                    />*/}
                {/*                    <label*/}
                {/*                      htmlFor={`${subCategory.name}-${specialist.id}`}*/}
                {/*                      className="font-normal truncate w-60 "*/}
                {/*                    >*/}
                {/*                      {specialist.name}*/}
                {/*                    </label>*/}
                {/*                  </div>*/}
                {/*                ))}*/}
                {/*              </AccordionContent>*/}
                {/*            </AccordionItem>*/}
                {/*          ))}*/}
                {/*        </Accordion>*/}
                {/*      </AccordionContent>*/}
                {/*    </AccordionItem>*/}
                {/*  ))}*/}
                {/*</RadioGroup>*/}
              </Accordion>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* CME Points */}
        {/*<AccordionItem value="cme points">*/}
        {/*  <AccordionTrigger className="font-primary text-xl font-bold ">*/}
        {/*    CME Points*/}
        {/*  </AccordionTrigger>*/}
        {/*  <AccordionContent className="pt-3 px-1">*/}
        {/*    <div className="flex justify-between pb-1">*/}
        {/*      <div className="text-sm font-primary">{cmeDownLocal} Points</div>*/}
        {/*      <div className="text-sm font-primary">{cmeUpLocal} Points</div>*/}
        {/*    </div>*/}
        {/*    <Slider*/}
        {/*      min={0}*/}
        {/*      step={0.5}*/}
        {/*      max={MAX_CME_POINTS}*/}
        {/*      defaultValue={[cmeDownLocal, cmeUpLocal]}*/}
        {/*      onValueChange={(value) => {*/}
        {/*        setCmeDownLocal(value[0]);*/}
        {/*        setCmeUpLocal(value[1]);*/}
        {/*      }}*/}
        {/*      value={[cmeDownLocal, cmeUpLocal]}*/}
        {/*    />*/}
        {/*  </AccordionContent>*/}
        {/*</AccordionItem>*/}

        {/* Educators */}
        {/*<AccordionItem value="educators" disabled={educatorsLoading}>*/}
        {/*  <AccordionTrigger className="font-primary text-xl font-bold ">*/}
        {/*    Educators*/}
        {/*  </AccordionTrigger>*/}
        {/*  <AccordionContent className="flex flex-col gap-3">*/}
        {/*    {educatorsData?.data?.map((educator) => (*/}
        {/*      <div key={educator.id} className="flex items-center gap-3">*/}
        {/*        <Checkbox*/}
        {/*          value={educator.id}*/}
        {/*          id={educator.id}*/}
        {/*          checked={filteredEducators.includes(educator.id)}*/}
        {/*          onCheckedChange={(checked) => {*/}
        {/*            if (checked)*/}
        {/*              setFilteredEducators([...filteredEducators, educator.id]);*/}
        {/*            else*/}
        {/*              setFilteredEducators(*/}
        {/*                filteredEducators.filter((i) => i !== educator.id)*/}
        {/*              );*/}
        {/*          }}*/}
        {/*        />*/}
        {/*        <Label htmlFor={educator.id} className="text-base font-medium">*/}
        {/*          {educator.name}*/}
        {/*        </Label>*/}
        {/*      </div>*/}
        {/*    ))}*/}
        {/*  </AccordionContent>*/}
        {/*</AccordionItem>*/}
      </Accordion>
    </div>
  );
};

export default ServiceFilter;
