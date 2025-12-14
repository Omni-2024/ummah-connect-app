"use client";

import { Card } from "@/components/base/card";
import { Skeleton } from "@/components/base/skeleton";

export default function AdminSidebarSkeleton() {
  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
      <Card className="flex grow flex-col border-r border-border rounded-none">

        {/* Logo Area */}
        <div className="flex items-center justify-between p-6">
          <Skeleton className="h-8 w-40 rounded-md" /> 
        </div>

        {/* Nav Items */}
        <nav className="flex flex-1 flex-col px-6 py-0">
          <ul className="flex flex-1 flex-col gap-y-10">
            <li>
              <ul className="-mx-2 space-y-4">

                {Array.from({ length: 9 }).map((_, i) => (
                  <li key={i}>
                    <Skeleton className="h-10 w-full rounded-md" />
                  </li>
                ))}

              </ul>
            </li>
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-6">
          <Skeleton className="h-12 w-full rounded-md" />
        </div>

      </Card>
    </div>
  );
}
