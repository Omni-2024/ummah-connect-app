import { getAllGeneralUsersFn } from "@/lib/endpoints/usersFns";
import { useQuery } from "@tanstack/react-query";

export const useGeneralUsers = (
    data: {
        limit: number;
        offset: number;
        search:string;
    },
    keepPrevious?: boolean
    ) => {
    return useQuery({
        queryKey: ["user", "general", data],
        queryFn: () => getAllGeneralUsersFn(data),
        placeholderData: keepPrevious ? (data) => data : undefined,
    });
};
