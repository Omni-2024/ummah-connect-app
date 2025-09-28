import type { Metadata } from "next";
import ProviderProfilePage from "@/features/provider/components/ProviderProfilePage";
import { Suspense } from "react";
import {useChat} from "@/components/getStream/chat/ChatContextProvider";
import ProviderProfileSkeleton from "@/features/provider/components/ProviderProfileSkeleton";

export const metadata: Metadata = {
    title: "Service Provider Profile | Ummah Connect",
    alternates: { canonical: "/provider" },
};

interface PageProps {
    params: Promise<{ id: string }>; // Changed: params is now a Promise
}

function ProviderPageLoading() {
    return (
        <ProviderProfileSkeleton/>
    );
}

export default async function Page({ params }: PageProps) { // Changed: Made function async
    const { id } = await params;


    return (
        <Suspense fallback={<ProviderPageLoading />}>
            <ProviderProfilePage providerId={id} />
        </Suspense>
    );
}