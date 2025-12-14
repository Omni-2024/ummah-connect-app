"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Card } from "@/components/base/card";
import AdminSidebarFooter from "./AdminSidebarFooter";
import Image from "next/image";
import { NAV_LOGO_SRC, ADMIN_ROLES } from "@/lib/constants";
import { navigation } from "../../../lib/navigation";
import { useCurrentUser } from "@/hooks/useUserInfo";
import AdminSidebarSkeleton from "./AdminSIdebarSkeleton";

export default function AdminSidebar() {
  const pathname = usePathname();
  const { data: profile, isLoading } = useCurrentUser();

  // 👉 Immediately show skeleton before anything loads
  if (isLoading || !profile) return <AdminSidebarSkeleton />;

  const role = profile.role;

  const sidebarAccess: Record<string, string[]> = {
    [ADMIN_ROLES.ADMIN]: navigation.map((n) => n.href),
    [ADMIN_ROLES.OPERATIONAL_ADMIN]: navigation.map((n) => n.href),
    [ADMIN_ROLES.ROOT]: navigation.map((n) => n.href),
    [ADMIN_ROLES.BUSINESS_ADMIN]: [
      "/admin",
      "/admin/services",
      "/admin/revenue",
      "/admin/profile",
    ],
  };

  const allowedLinks = sidebarAccess[role] ?? [];
  const filteredNavigation = navigation.filter((item) =>
    allowedLinks.includes(item.href)
  );

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
      <Card className="flex grow flex-col border-r border-border rounded-none">
        <div className="flex items-center justify-between p-6">
          <Image
            width={140}
            height={40}
            src={NAV_LOGO_SRC}
            alt="Ummah-community"
          />
        </div>

        <nav className="flex flex-1 flex-col px-6 py-0">
          <ul className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul className="-mx-2 space-y-1">
                {filteredNavigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors",
                          pathname === item.href
                            ? "bg-primary-500 text-white"
                            : "text-muted-foreground hover:bg-primary-100 hover:text-foreground"
                        )}
                      >
                        <Icon className="h-5 w-5 shrink-0" />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          </ul>
        </nav>

        <AdminSidebarFooter />
      </Card>
    </div>
  );
}
