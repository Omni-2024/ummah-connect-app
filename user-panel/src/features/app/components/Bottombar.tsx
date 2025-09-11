import { Book1, Home, Profile, SearchNormal1 } from "iconsax-react";
import Link from "next/link";
import {usePathname} from "next/navigation";

import { cn } from "@/lib/className";
import { useAuthState } from "@/features/auth/context/useAuthState";

const BottomBar = () => {
  const pathname = usePathname() || "/";
  const { isAuthenticated } = useAuthState();

  const getTabActiveStatus = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 z-50 flex h-16 w-full items-center justify-between border-t border-[#E2E8F0] bg-white shadow-2xl !shadow-dark-300/5 lg:hidden">
      {[
        {
          title: "Home",
          icon: (isActive: boolean) => (
            <Home color={isActive ? "#f58120" : "#0f172a"}
              className={cn("size-6 text-dark-200", {
                "text-tertiary-500": isActive,
              })}
            />
          ),
          path: "/",
        },
        {
          title: "My Bookings",
          icon: (isActive: boolean) => (
            <Book1 color={isActive ? "#f58120" : "#0f172a"}
              className={cn("size-6 text-dark-200", {
                "text-tertiary-500": isActive,
              })}
            />
          ),
          path: isAuthenticated ? "/my/booking" : "/user/login",
        },
        {
          title: "Explore",
          icon: (isActive: boolean) => (
            <SearchNormal1 color={isActive ? "#f58120" : "#0f172a"}
              className={cn("size-6 text-dark-200", {
                "text-tertiary-500": isActive,
              })}
            />
          ),
          path: "/explore",
        },
        {
          title: "My Profile",
          icon: (isActive: boolean) => (
            <Profile color={isActive ? "#f58120" : "#0f172a"}
              className={cn("size-6 text-dark-200", {
                "text-tertiary-500": isActive,
              })}
            />
          ),
          path: isAuthenticated ? "/settings/profile" : "/user/login",
        },
      ].map(({ title, icon, path }) => {
        const isActive = getTabActiveStatus(path);
        return (
          <Link
            key={title}
            href={path}
            className="flex flex-1 select-none flex-col items-center justify-center gap-1"
          >
            {icon(isActive)}
            <span
              className={cn("text-center text-xs text-dark-200", {
                "text-tertiary-500": isActive,
              })}
            >
              {title}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomBar;
