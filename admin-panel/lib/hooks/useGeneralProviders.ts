import {useQuery} from "@tanstack/react-query";
import {getAllGeneralProvidersFn} from "@/lib/endpoints/providersFns";

export const useGeneralProviders= (
    data: {
        limit: number;
        offset: number;
        search:string;
    },
    keepPrevious?: boolean
) => {
    return useQuery({
        queryKey: ["providers", "general", data],
        queryFn: () => getAllGeneralProvidersFn(data),
        placeholderData: keepPrevious ? (data) => data : undefined,
    });
};