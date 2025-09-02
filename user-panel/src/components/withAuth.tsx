"use client";

import { useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAuthState } from "@/features/auth/context/useAuthState";
import { UserRole } from "@/lib/constants";

export default function withAuth(Component: any, requiredRoles: UserRole[]) {
    return function WithAuth(props: any) {
        const { isAuthenticated, role, isFirstLogin, logout } = useAuthState();
        const router = useRouter();
        const pathname = usePathname();
        const searchParams = useSearchParams();

        useEffect(() => {
            // Redirect to login if not authenticated
            if (!isAuthenticated) {
                logout(); // Clear local auth state

                const callback = pathname;
                const action = searchParams.get("_action");

                const redirectParams = new URLSearchParams();
                if (callback && callback !== "/user/login") {
                    redirectParams.set("_callback", callback);
                }
                if (action) {
                    redirectParams.set("_action", action);
                }

                router.push(`/user/login?${redirectParams.toString()}`);
                return;
            }

            if (isAuthenticated && isFirstLogin) {
                router.push("/onboarding");
                return;
            }

            // Role-based access control
            if (
                isAuthenticated &&
                requiredRoles.length > 0 &&
                !requiredRoles.includes(role)
            ) {
                router.push("/");
                return;
            }
        }, [isAuthenticated, isFirstLogin, role, pathname, searchParams, logout, router]);

        // Optional: hide content while redirecting
        if (
            !isAuthenticated ||
            (requiredRoles.length > 0 && !requiredRoles.includes(role))
        ) {
            return <p>Redirecting...</p>; // Or show a spinner
        }

        return <Component {...props} />;
    };
}
