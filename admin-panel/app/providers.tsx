"use client";

import {
    QueryClient,
    type QueryKey,
    type QueryFilters, QueryClientProvider,
} from "@tanstack/react-query";
import Toaster from "@/components/base/toast";
import {ChatProvider} from "@/components/getStream/chat/ChatContextProvider";


export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 0,                // always consider stale -> easy refresh
            refetchOnWindowFocus: false, // your preference
            refetchOnReconnect: true,        },
    },
});

export const invalidateQueries = (
    queryKey: QueryKey,
    filters?: Omit<QueryFilters, "queryKey">
) =>
    queryClient.invalidateQueries({
        queryKey,
        refetchType: "active",
        ...filters,
    });


export default function Providers({ children }: { children: React.ReactNode }) {
    // ensure one client per browser tab

    return (

            <QueryClientProvider client={queryClient}>
                <ChatProvider >
                <Toaster />
                {children}
                </ChatProvider>
            </QueryClientProvider>
    );
}
