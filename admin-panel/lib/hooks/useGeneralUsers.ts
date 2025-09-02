import {getAllGeneralUsersFn, getGeneralUser} from "@/lib/endpoints/usersFns";
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
        queryKey: ["users", "general", data],
        queryFn: () => getAllGeneralUsersFn(data),
        placeholderData: keepPrevious ? (data) => data : undefined,
    });
};

export const useGeneralUser = (id?: string) => {
    return useQuery({
        queryKey: ["user", id],
        queryFn: () => getGeneralUser(id ?? ""),
        enabled: !!id,
    });
};

export const useDeleteUser = (id?: string) => {
    return useQuery({
        queryKey: ["rm-user", id],
        queryFn: () => (id ?? ""),
        enabled: !!id,
    });
};
