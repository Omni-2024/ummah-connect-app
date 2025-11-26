import {useQuery} from "@tanstack/react-query";
import {getAccountStats, getOnboardingLinkFn} from "@/lib/endpoints/stripeFns";

export const useOnboardingLink = (accountId: string) => {
    return useQuery({
        queryKey: ["provider-id", accountId],
        queryFn: () => getOnboardingLinkFn(accountId),
        enabled: false, // 🔥 NEVER run automatically
    });
};

export const useAccountStats = (accountId: string) => {
    return useQuery({
        queryKey: ["account-id", accountId],
        queryFn: () => getAccountStats(accountId),
        enabled: !!accountId,
    });
};



// const { data: session, isError: isSessionError } = useSessionStatus(sessionId)
