"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Toaster from "@/components/base/Toast";

import { Theme } from "@radix-ui/themes";
import {GoogleOAuthProvider} from "@react-oauth/google";
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
        <GoogleOAuthProvider clientId={envs.googleAuthClientId}>
            <QueryClientProvider client={queryClient}>
                <Toaster/>
                <Theme>{children}</Theme>
                {/*<ReactQueryDevtools initialIsOpen={false} />*/}
            </QueryClientProvider>
        </GoogleOAuthProvider>
    );
}
