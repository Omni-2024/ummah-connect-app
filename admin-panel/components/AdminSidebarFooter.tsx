"use client";

import { LogOut } from "lucide-react";
import Button from "@/components/ui/button";
import { useAuthState } from "@/features/auth/context/useAuthState";
import { useCurrentUser } from "@/lib/hooks/useUserInfo";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminSidebarFooter() {
  const { isAuthenticated } = useAuthState();
  const { data: currentUser } = useCurrentUser();
  const router = useRouter();

  // Prevent SSR mismatch
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  const handleLogout = () => {
    router.push("/login");
  };

  if (!isClient) return null; // Render nothing on server

  return (
    <div className="p-4 border-t border-[#337f7c]/50">
      {isAuthenticated ? (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
            <span className="text-accent-foreground text-xs font-medium">
              {currentUser?.name?.[0] || "A"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {currentUser?.name || "Admin User"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {currentUser?.email || "admin@example.com"}
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleLogout}
            className="ml-auto text-red-500 hover:text-red-600"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button
          variant="secondary"
          onClick={handleLogout}
          className="w-full bg-transparent"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      )}
    </div>
  );
}
