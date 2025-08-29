"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Theme } from "@radix-ui/themes";

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
            <Theme>{children}</Theme>
            {/*<ReactQueryDevtools initialIsOpen={false} />*/}
        </QueryClientProvider>
    );
}
