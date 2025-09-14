"use client";

import Link from "next/link";
import { X, Shield } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Button from "@/components/base/button";
import { navigation } from "@/lib/navigation";
import AdminSidebarFooter from "./AdminSidebarFooter";

export default function AdminMobileSidebar({
  sidebarOpen,
  setSidebarOpen,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}) {
  const pathname = usePathname();

  if (!sidebarOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/30"
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 flex flex-col shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <Link
            href="/admin-panel/public"
            className="flex items-center space-x-2"
          >
            <div className="h-8 w-8 rounded-lg bg-primary-500 flex items-center justify-center">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">
              Admin Panel
            </span>
          </Link>

          <Button
            variant="secondary"
            size="sm"
            className="p-2 border-none"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5 text-gray-700" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-primary-500 text-white"
                    : "text-muted-foreground hover:bg-primary-100 hover:text-foreground"
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4">
          <AdminSidebarFooter />
        </div>
      </div>
    </div>
  );
}
