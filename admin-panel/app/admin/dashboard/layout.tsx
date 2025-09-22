"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "@/features/app/components/AdminSidebar";
import AdminMobileSidebar from "@/features/app/components/AdminMobileSidebar";
import AdminTopbar from "@/features/app/components/AdminTopbar";

const HIDE_SIDEBAR = (pathname: string) => {
    if (pathname === "/admin/dashboard/services/create") return true;
    if (pathname.startsWith("/admin/dashboard/services/edit/")) return true;
    return false;
};

export default function AdminDashboardLayout({
                                                 children,
                                             }: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();
    const hideChrome = HIDE_SIDEBAR(pathname ?? "");

    if (hideChrome) {
        return (
            <div className="h-[calc(100vh-4rem)] bg-white">
                <AdminTopbar setSidebarOpen={setSidebarOpen} />
                <main className="min-h-screen">{children}</main>
            </div>
        );
    }

    // Default layout with sidebars
    return (
        <div className="min-h-screen bg-background">
            <AdminMobileSidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />
            <AdminSidebar />
            <div className="lg:pl-64">
                <AdminTopbar setSidebarOpen={setSidebarOpen}/>
                <main className="py-6 overflow-y-auto h-[calc(100vh-4rem)]">
                    <div className="px-4 sm:px-6 lg:px-8">{children}</div>
                </main>
            </div>
        </div>
    );
}
