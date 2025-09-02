import {useQuery} from "@tanstack/react-query";
import { getAllSpecialistByProfessionIdFn} from "@/lib/endpoints/categoryFns";

export const useSpecialists = (professionId: string) => {
    return useQuery({
        queryKey: ["specialists",professionId],
        queryFn: () => getAllSpecialistByProfessionIdFn(professionId),
    });
};