"use client";

import { LogOut } from "lucide-react";
import Button from "@/components/base/button";
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
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => setIsClient(true), []);

  const handleLogout = () => {
    router.push("/login");
  };

  if (!isClient) return null;

  return (
    <>
      <div className="p-4 border-t border-primary-100">
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
              onClick={() => setConfirmOpen(true)}
              className="ml-auto text-red-500 hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button
            variant="secondary"
            onClick={() => setConfirmOpen(true)}
            className="w-full bg-transparent"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        )}
      </div>

      {/* === LOGOUT CONFIRMATION MODAL === */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">

            {/* Header */}
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Confirm Logout
              </h3>
            </div>

            {/* Body */}
            <div className="px-6 py-5">
              <p className="text-sm text-gray-600 leading-relaxed">
                Are you sure you want to log out?
                <br />
                <span className="text-red-600 font-medium">
                  You will need to sign in again to continue.
                </span>
              </p>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50 rounded-b-2xl">
              <Button
                variant="secondary"
                onClick={() => setConfirmOpen(false)}
              >
                Cancel
              </Button>

              <Button
                variant="primary"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
