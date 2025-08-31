import { useQuery } from "@tanstack/react-query";
// import { getEducatorByIdFn } from "@lib/endpoints/educatorFns";

export const useEducator = (id: string) => {
  // return useQuery({
  //   queryKey: ["educator", id],
  //   queryFn: () => getEducatorByIdFn(id),
  //   enabled: !!id, // ! Should be enabled only when id is present
  // });
};
