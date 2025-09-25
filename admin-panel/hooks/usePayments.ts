import {useQuery} from "@tanstack/react-query";
import {getStatsFn, GetStatsParams} from "@/lib/endpoints/paymentFns";

export const useStats = (params: GetStatsParams) => {
    return useQuery({
        queryKey: ["stats", params],
        queryFn: () => getStatsFn(params),
    });
};