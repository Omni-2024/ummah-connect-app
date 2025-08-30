import { getAllGeneralUsersFn } from "@/lib/endpoints/usersFns";
import { useQuery } from "@tanstack/react-query";

export const useGeneralUsers = (data: { limit: number; offset: number }) => {
    return useQuery({
        queryKey: ["user", "general", data],
        queryFn: () => getAllGeneralUsersFn(data),
    });
};
