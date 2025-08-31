import { getCategoriesFn } from "@/lib/endpoints/categoriesFns";
import { useQuery } from "@tanstack/react-query";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategoriesFn(),
  });
};
