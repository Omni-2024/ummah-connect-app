"use client";

import {useLayoutEffect, useState} from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Toaster from "@/components/base/Toast";

import { Theme } from "@radix-ui/themes";
import {GoogleOAuthProvider} from "@react-oauth/google";
import envs from "@/lib/env";
import {hydrateAuthFromStorage} from "@/features/auth/context/AuthState";
import {ChatProvider} from "@/components/getStream/chat/ChatContextProvider";

function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: { refetchOnWindowFocus: false },
        },
    });
}

export default function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => makeQueryClient());

    useLayoutEffect(() => {
        hydrateAuthFromStorage();
    }, []);

    return (
        <GoogleOAuthProvider clientId={envs.googleAuthClientId}>
            <ChatProvider >
                <QueryClientProvider client={queryClient}>
                    <Toaster/>
                    <Theme>{children}</Theme>
                    {/*<ReactQueryDevtools initialIsOpen={false} />*/}
                </QueryClientProvider>
            </ChatProvider>
        </GoogleOAuthProvider>
    );
}
