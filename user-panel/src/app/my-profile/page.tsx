import type { Metadata } from "next";
import MyProfile from "@/app/my-profile/MyProfile";

export const metadata: Metadata = {
    title: "Profile - Ummah Connect | Connecting the Islamic Community",
    alternates: { canonical: "/my-profile" },
};

export default function Page() {
    return <MyProfile />;
}
