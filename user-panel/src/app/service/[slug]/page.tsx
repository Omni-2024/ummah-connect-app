"use client"
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useExploreState } from "@/features/explore/context/useExploreState";
import ServiceDetailsPage from "@/features/explore/component/ServiceDetailsPage";

export default function Service() {
    const params = useParams();
    const { setServiceSlug } = useExploreState();

    useEffect(() => {
        let slug = params?.slug;
        if (Array.isArray(slug)) {
            slug = slug[0];
        }
        if (slug) {
            setServiceSlug(slug);
        }
    }, [params, setServiceSlug]);

    return <ServiceDetailsPage />;
}
