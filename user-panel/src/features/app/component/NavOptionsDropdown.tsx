import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/base/DropdownMenu";
import { useRouter } from "next/router";
import { useAuthState } from "@features/auth/context/useAuthState";
import { useCurrentUser } from "@lib/hooks/useUser";
import ComingSoonToolTip from "@components/widgets/ComingSoonToolTip";

interface Props {
  children: React.ReactNode;
}

const NavOptionsDropdown: React.FC<Props> = ({ children }) => {
  const router = useRouter();
  //
  const { isAuthenticated, id, logout } = useAuthState();
  const { data: currentUser, isLoading: isCurrentUserLoading } =
    useCurrentUser();
  //
  const handleLogout = () => {
    logout();
    router.push("/user/login");
  };
  //
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="outline-none ring-0 focus-visible:ring-0"
        disabled={!isAuthenticated}
      >
        {children}
      </DropdownMenuTrigger>

      <DropdownMenuContent className="mr-2 w-56 rounded-lg px-2.5">
        <DropdownMenuLabel className="py-2" asChild>
          <div className="flex flex-col gap-0.5">
            <div className="line-clamp-1 text-sm font-bold text-primary-500">
              {currentUser?.name}
            </div>
            <p className="line-clamp-1 text-xs font-normal text-dark-300">
              {currentUser?.email}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <Link href="/my/learning">
            <DropdownMenuItem className="py-2">My Learning</DropdownMenuItem>
          </Link>

          <Link href="/my/purchases">
            <DropdownMenuItem className="py-2">My Purchases</DropdownMenuItem>
          </Link>

          <Link href="/my/certifications">
            <DropdownMenuItem className="py-2">
              My Certifications
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <Link href="/settings/account">
          <DropdownMenuItem className="bg- py-2">
            Account Settings
          </DropdownMenuItem>
        </Link>

        {/*
        TODO:: Disabled for next release
        <Link href="/my/subscriptions">
          <DropdownMenuItem className="py-2">Subscriptions</DropdownMenuItem>
        </Link> */}

        <ComingSoonToolTip>
          <DropdownMenuItem className="py-2" disabled>
            Subscriptions
          </DropdownMenuItem>
        </ComingSoonToolTip>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleLogout} className="py-2">
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavOptionsDropdown;
