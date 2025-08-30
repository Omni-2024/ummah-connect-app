"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import envs from "@/lib/env";

function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: { refetchOnWindowFocus: false },
        },
    });
}

export default function Providers({ children }: { children: React.ReactNode }) {
    // ensure one client per browser tab
    const [queryClient] = useState(() => makeQueryClient());

    return (
            <QueryClientProvider client={queryClient}>
                {children}
                {/*<ReactQueryDevtools initialIsOpen={false} />*/}
            </QueryClientProvider>
    );
}
