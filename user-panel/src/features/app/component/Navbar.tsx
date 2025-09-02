import {
  ArrowRight as ArrowRightIcon,
  Notification as BellIcon,
  ArrowDown2 as ChevronDownIcon,
  TextalignCenter as TextAlignCenterIcon,
  ProfileCircle as UserCircleIcon,
} from "iconsax-react";
import Link from "next/link";

import Button from "@/components/base/Button";
import IconButton from "@/components/base/IconButton";
import Separator from "@/components/base/Separator";
import NestedMenu, { MenuItem } from "@/components/widgets/NestedMenu";
import NotificationsDropdown from "@/features/app/component/notifications/NotificationsDropdown";
import NavSearchbar from "@/features/explore/components/search/NavSearchbar";
import { ColorPalatte } from "@/lib/constants";
import NavOptionsDropdown from "./NavOptionsDropdown";
import { useCategories } from "@/lib/hooks/useCategories";
import { useAuthState } from "@/features/auth/context/useAuthState";
import { Fragment } from "react";
import ComingSoonToolTip from "@/components/widgets/ComingSoonToolTip";
import { cn } from "@/lib/className";

type NavbarProps = {
  clearPage?: () => void;
};

const Navbar = (props: NavbarProps) => {
  const { isAuthenticated } = useAuthState();
  //
  const { data: categories, isLoading } = useCategories();
  // Transforming the categories data into the MenuItem structure
  const MenuItemsList: MenuItem[] =
    categories?.map((profession) => ({
      isProfession: true,
      id: profession.id,
      title: profession.name,
      subMenu: profession?.map((type) => ({
        parentProfession: { id: profession.id, title: profession.name },
        isType: true,
        id: type.id,
        title: type.name,
        subMenu: type.specialist?.map((specialist) => ({
          parentProfession: { id: profession.id, title: profession.name },
          parentType: type,
          isSpecialty: true,
          id: specialist.id,
          title: specialist.name,
        })),
      })),
    })) || [];
  //
  // Rendering the Navbar based on the user's authentication status
  if (!isAuthenticated) {
    return (
      <NotLoggedInNavbar
        MenuItemsList={MenuItemsList}
        isLoading={isLoading}
        resetPage={props.clearPage}
      />
    );
  }
  //
  return (
    <div className="contianer sticky top-0 z-50 w-full">
      <nav className="hidden w-full items-center justify-between bg-white px-4 py-4 shadow-lg !shadow-dark-300/5 lg:flex">
        <div className="flex items-center justify-center gap-4">
          <Link href="/">
            <img
              alt="MedLearning Logo"
              src="/images/logo.svg"
              className="max-h-12 min-w-20 cursor-pointer object-contain"
            />
          </Link>

          <NestedMenu menuItems={MenuItemsList}>
            <Button
              disabled={isLoading}
              variant="secondary"
              rightIcon={
                <ChevronDownIcon
                  className="size-4"
                  color={ColorPalatte.primary[500]}
                />
              }
            >
              Explore
            </Button>
          </NestedMenu>

          <NavSearchbar onSearch={props.clearPage} />
        </div>

        <div className="flex items-center justify-center gap-4">
          {/* TODO::: disabled for next release */}
          {/* <Link href="/my/subscriptions">
            <Button
              variant="secondary"
              rightIcon={
                <ArrowRightIcon
                  className="size-4"
                  color={ColorPalatte.primary[500]}
                />
              }
            >
              Upgrade
            </Button>
          </Link> */}

          <ComingSoonToolTip>
            <Button
              variant="secondary"
              disabled
              rightIcon={
                <ArrowRightIcon
                  className="size-4"
                  // color={ColorPalatte.primary[500]}
                />
              }
            >
              Upgrade
            </Button>
          </ComingSoonToolTip>

          <Separator orientation="vertical" />

          <div className="h-10 w-[1px] bg-dark-50" />

          <Link href="/my/learning">
            <Button className="px-0 font-medium text-black" variant="unstyled">
              My Learning
            </Button>
          </Link>

          {/* TODO:: Temporary */}
          <NotificationsDropdown disabled>
            <ComingSoonToolTip>
              <IconButton size="lg">
                <BellIcon className="size-5" />
              </IconButton>
            </ComingSoonToolTip>
          </NotificationsDropdown>

          <NavOptionsDropdown>
            <ProfileMenuButton />
          </NavOptionsDropdown>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;

export const ProfileMenuButton = ({ onClick }: { onClick?: () => void }) => {
  return (
    <Button asChild variant="unstyled">
      <div
        onClick={onClick}
        className="flex cursor-pointer select-none items-center gap-2 rounded-full border border-dark-50 px-3 py-1.5 transition-colors ease-in hover:border-transparent hover:bg-primary-50 active:bg-primary-100"
      >
        <TextAlignCenterIcon className="size-5" />

        <div className="flex items-center justify-center rounded-full bg-primary-500 p-1.5">
          <UserCircleIcon className="size-5 text-white" color="white" />
        </div>
      </div>
    </Button>
  );
};

const NotLoggedInNavbar = ({
  MenuItemsList,
  isLoading,
  resetPage,
}: {
  MenuItemsList: MenuItem[];
  isLoading: boolean;
  resetPage?: () => void;
}) => {
  const navLinks = [
    { href: "/", label: "Home" },
    {
      href: "/business",
      label: "MedLearning Business",
      disabled: true,
      hideOnLg: true,
    },
    { href: "/insights", label: "Insights", hideOnLg: true, disabled: true },
    { href: "/contact", label: "Contact", disabled: true },
  ];
  //
  return (
    <div className="contianer sticky top-0 z-50 w-full">
      <nav className="hidden w-full items-center justify-between bg-white px-4 py-4 shadow-lg !shadow-dark-300/5 lg:flex">
        <div className="flex items-center justify-center gap-4">
          <Link href="/">
            <img
              alt="MedLearning Logo"
              src="/images/logo.svg"
              className="max-h-12 min-w-20 cursor-pointer object-contain"
            />
          </Link>

          <NestedMenu menuItems={MenuItemsList}>
            <Button
              disabled={isLoading}
              variant="secondary"
              rightIcon={
                <ChevronDownIcon
                  className="size-4"
                  color={ColorPalatte.primary[500]}
                />
              }
            >
              Explore
            </Button>
          </NestedMenu>

          {/* show the search bar only in large screens */}
          <div className="hidden xl:block">
            <NavSearchbar onSearch={resetPage} />
          </div>
        </div>

        <div className="flex items-center justify-center">
          {navLinks.map((link) => (
            <Fragment key={link.href}>
              {link.disabled ? (
                <ComingSoonToolTip>
                  <Button
                    variant="unstyled"
                    disabled
                    className={cn(link.hideOnLg && "xl:hidden 2xl:flex")}
                  >
                    {link.label}
                  </Button>
                </ComingSoonToolTip>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(link.hideOnLg && "xl:hidden 2xl:flex")}
                >
                  <Button variant="unstyled">{link.label}</Button>
                </Link>
              )}
            </Fragment>
          ))}

          <div className="flex items-center justify-center gap-4">
            <Link href="/user/login">
              <Button variant="secondary">Login</Button>
            </Link>

            <Link href="/user/signup">
              <Button
                variant="primary"
                rightIcon={<ArrowRightIcon className="size-4" />}
              >
                Join for Free
              </Button>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};
