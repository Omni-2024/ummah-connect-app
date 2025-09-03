import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "@/features/auth/context/useAuthState";
import type { ADMIN_ROLES } from "@/lib/constants";
import { LoadingScreen } from "@/features/auth/components/loadingScreen";

type WithAuthComponentProps = Record<string, unknown>;

export default function withAuth<T extends WithAuthComponentProps>(
  Component: React.ComponentType<T>,
  requiredRoles: ADMIN_ROLES[]
) {
  return function WithAuth(props: T) {
    const { isAuthenticated, role, logout } = useAuthState();
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const [loading, setLoading] = useState(true);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
      setIsClient(true);

      // if the user is not authenticated
      if (!isAuthenticated) {
        logout(); // Clear the state
        router.push("/login");
      }

      // if the user is authenticated but does not have the required role
      if (!requiredRoles.includes(role)) {
        router.push("/login");
      }

      setLoading(false);
    }, [isAuthenticated, logout, role, router]);

    if (!isClient || loading) return <LoadingScreen />;

    if (requiredRoles.length === 0) {
      return `${Component.name} requires at least one role to be passed as a prop.`;
    }
    if (!isAuthenticated || !requiredRoles.includes(role)) {
      return <></>;
    }

    return <Component {...props} />;
  };
}

// export default function withAuth(Component: React.ComponentType) {
//   return Component;
// }
