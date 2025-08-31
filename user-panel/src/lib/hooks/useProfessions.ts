import { getAllProfessionsFn, getProfessionByIdFn } from "@/lib/endpoints/categoryFns";
import { useQuery } from "@tanstack/react-query";

export const useProfession = (id: string) => {
  return useQuery({
    queryKey: ["profession", id],
    queryFn: () => getProfessionByIdFn(id),
    enabled: !!id, // ! Should be enabled only when id is present
  });
};

export const useProfessions = () => {
  return useQuery({
    queryKey: ["professions"],
    queryFn: () => getAllProfessionsFn(),
  });
};