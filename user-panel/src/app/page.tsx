import type { Metadata } from "next";
import HomePage from "@/app/Homepage";

export const metadata: Metadata = {
    title: "Ummah Connect | Connecting the Islamic Community",
    alternates: { canonical: "/" },
};

export default function Page() {
    return <HomePage />;
}
