import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuthState } from "@/features/auth/context/useAuthState";
import { UserRole } from "@/lib/constants";

export default function withAuth(Component: any, requiredRoles: UserRole[]) {
    return function WithAuth(props: any) {
        const { isAuthenticated, role, isFirstLogin, logout } = useAuthState();
        const router = useRouter();

        useEffect(() => {
            const currentPath = router.asPath;
            const loginUrl = new URL("/user/login", window.location.origin);

            // Redirect to login if the user is not authenticated
            if (!isAuthenticated) {
                logout(); // Clear the state

                // Add current path as callback if not already on login
                if (currentPath !== "/user/login") {
                    loginUrl.searchParams.set("_callback", currentPath);
                }

                // Preserve any existing action parameter
                const action = router.query._action;
                if (action && typeof action === "string") {
                    loginUrl.searchParams.set("_action", action);
                }

                router.push(loginUrl.toString());
                return;
            }

            // Redirect to onboarding if it's first login
            if (isAuthenticated && isFirstLogin) {
                router.push("/onboarding");
                return;
            }

            // Role-based access check
            if (
                isAuthenticated &&
                requiredRoles.length > 0 &&
                !requiredRoles.includes(role)
            ) {
                router.push("/");
                return;
            }
        }, [isAuthenticated, role, isFirstLogin, router]);

        /** This will prevent flashing of protected content,
         * if the user is not authenticated or
         * if the user does not have the required role */
        if (
            !isAuthenticated ||
            (requiredRoles.length > 0 && !requiredRoles.includes(role))
        ) {
            // TODO: Add a loading spinner
            return <p>Redirecting...</p>;
        }

        return <Component {...props} />;
    };
}
