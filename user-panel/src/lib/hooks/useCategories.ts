import { useQuery } from "@tanstack/react-query";
import { getCategoriesFn} from "@/lib/endpoints/categoryFns";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategoriesFn,
    // ? longer staleTime means queries will not refetch their data as often
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};
