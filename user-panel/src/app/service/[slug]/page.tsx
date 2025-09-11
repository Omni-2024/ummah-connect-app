import type { Metadata } from "next";
import ServicePage from "@/app/service/[slug]/ServicePage";

export const metadata: Metadata = {
    title: "Ummah Connect | Connecting the Islamic Community",
    alternates: { canonical: "/service" },
};

export default function Page() {
    return <ServicePage />;
}
