import type { Metadata } from "next";
import ExplorePage from "@/app/explore/ExplorePage";

export const metadata: Metadata = {
    title: "Explore - Ummah Connect | Connecting the Islamic Community",
    alternates: { canonical: "/explore" },
};

export default function Page() {
    return <ExplorePage />;
}
