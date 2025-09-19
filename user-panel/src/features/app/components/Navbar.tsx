"use client";

import React, { useState, useEffect, useMemo, Fragment } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRightIcon, BellIcon } from "@radix-ui/react-icons";

import { useAuthState } from "@/features/auth/context/useAuthState";
import { useCurrentUser } from "@/lib/hooks/useUser";
import { useCategories } from "@/lib/hooks/useCategories";
import { NAV_LOGO_SRC } from "@/lib/constants";
import envs from "@/lib/env";

import ProfileDropdown from "./ProfileDropdown";
import NavSearchbar from "@/features/explore/component/search/NavSearchbar";
import ExploreDropDown from "./ExploreDropDown";
import Button from "@/components/base/Button";
import { CategoryData } from "@/types";


export const buildAvatarUrl = (img?: string | null): string | null => {
  if (!img) return null;
  if (/^https?:\/\//i.test(img)) return img;
  const base = envs.imageBaseUrl;
  return `${base}/${img}`;
};

type NavbarProps = {
  clearPage?: () => void;
};


export default function Navbar({ clearPage }: NavbarProps) {
  const router = useRouter();
  const { isAuthenticated, logout , isHydrated} = useAuthState();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [exploreDropdownOpen, setExploreDropdownOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [avatarBroken, setAvatarBroken] = useState(false);

  const { data: user, isFetched, isLoading: userLoading } = useCurrentUser();
  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  const avatarUrl = buildAvatarUrl(user?.profileImage);

  const handleLogout = () => {
    logout();
    router.push("/");
    setProfileDropdownOpen(false);
  };

  const exploreCategoriesForNav: CategoryData[] = useMemo(
      () => (categories && !categoriesError ? categories : []),
      [categories, categoriesError]
  );

    if (!isHydrated){
        return (
            <NavbarSkeleton
                isLoading={userLoading}
                resetPage={clearPage}
                exploreDropdownOpen={exploreDropdownOpen}
                setExploreDropdownOpen={setExploreDropdownOpen}
                hoveredCategory={hoveredCategory}
                setHoveredCategory={setHoveredCategory}
                exploreCategories={exploreCategoriesForNav}
                categoriesLoading={categoriesLoading}
                categoriesError={categoriesError}
            />
        )
    }


    if (!isAuthenticated) {
    return (
        <NotLoggedInNavbar
            isLoading={userLoading}
            resetPage={clearPage}
            exploreDropdownOpen={exploreDropdownOpen}
            setExploreDropdownOpen={setExploreDropdownOpen}
            hoveredCategory={hoveredCategory}
            setHoveredCategory={setHoveredCategory}
            exploreCategories={exploreCategoriesForNav}
            categoriesLoading={categoriesLoading}
            categoriesError={categoriesError}
        />
    );
  }

  return (
      <div className=" sticky top-0 z-50  w-full ">
      <nav className="hidden w-full items-center h-[80px] justify-between bg-white px-4 py-4 shadow-lg !shadow-dark-300/5 lg:flex">
        <div className="flex items-center justify-center gap-4">
            <Link href="/">
              <img
                  alt="Ummah Logo"
                  src={NAV_LOGO_SRC}
                  className="max-h-12 min-w-20 cursor-pointer object-contain"
              />
            </Link>
            <ExploreDropDown
                exploreDropdownOpen={exploreDropdownOpen}
                setExploreDropdownOpen={setExploreDropdownOpen}
                hoveredCategory={hoveredCategory}
                setHoveredCategory={setHoveredCategory}
                exploreCategories={exploreCategoriesForNav}
                categoriesLoading={categoriesLoading}
                categoriesError={categoriesError}
            />

            <NavSearchbar onSearch={clearPage} />

        </div>
        <div className="flex items-center justify-center gap-4">
          <Link href="/start-selling">
            <Button variant="unstyled">Become a Seller</Button>
          </Link>
            <button
                className="relative rounded-lg p-2 text-slate-600 transition-all duration-200 hover:bg-slate-50 hover:text-emerald-600"
                aria-label="Notifications"
                type="button"
            >
                <BellIcon className="h-5 w-5" />
                <span className="absolute -right-1 -top-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
              </span>
            </button>

            <ProfileDropdown
                profileDropdownOpen={profileDropdownOpen}
                setProfileDropdownOpen={setProfileDropdownOpen}
                user={user}
                avatarUrl={avatarUrl}
                avatarBroken={avatarBroken}
                setAvatarBroken={setAvatarBroken}
                isFetched={isFetched}
                isLoading={userLoading}
                router={router}
                handleLogout={handleLogout}
            />
        </div>
      </nav>
      </div>
  );
}


type NotLoggedInNavbarProps = {
  isLoading: boolean;
  resetPage?: () => void;
  exploreDropdownOpen: boolean;
  setExploreDropdownOpen: (open: boolean) => void;
  hoveredCategory: string | null;
  setHoveredCategory: (cat: string | null) => void;
  exploreCategories: CategoryData[];
  categoriesLoading: boolean;
  categoriesError: unknown;
};

const NotLoggedInNavbar = ({
                             isLoading,
                             resetPage,
                             exploreDropdownOpen,
                             setExploreDropdownOpen,
                             hoveredCategory,
                             setHoveredCategory,
                             exploreCategories,
                             categoriesLoading,
                             categoriesError,
                           }: NotLoggedInNavbarProps) => {
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

  return (
      <div className=" sticky top-0 z-50  w-full ">
          <nav className="hidden w-full items-center  h-[80px] bg-white justify-between  px-4 py-4 shadow-lg !shadow-dark-300/5 lg:flex">
          <div className="flex items-center justify-center gap-4">
            <Link href="/">
              <img
                  alt="Ummah Logo"
                  src={NAV_LOGO_SRC}
                  className="min-w-20 max-h-12 cursor-pointer object-contain"
              />
            </Link>

            <ExploreDropDown
                exploreDropdownOpen={exploreDropdownOpen}
                setExploreDropdownOpen={setExploreDropdownOpen}
                hoveredCategory={hoveredCategory}
                setHoveredCategory={setHoveredCategory}
                exploreCategories={exploreCategories}
                categoriesLoading={categoriesLoading}
                categoriesError={categoriesError}
            />

            {/* show the search bar only on xl+ */}
            <div className="hidden xl:block">
              <NavSearchbar onSearch={resetPage} />
            </div>
          </div>
          <div className="flex items-center justify-center">
            {/*{navLinks.map((link) => (*/}
            {/*    <Fragment key={link.href}>*/}
            {/*      {link.disabled ? (*/}
            {/*          <ComingSoonToolTip>*/}
            {/*            <Button*/}
            {/*                variant="unstyled"*/}
            {/*                disabled*/}
            {/*                className={cn(link.hideOnLg && "xl:hidden 2xl:flex")}*/}
            {/*            >*/}
            {/*              {link.label}*/}
            {/*            </Button>*/}
            {/*          </ComingSoonToolTip>*/}
            {/*      ) : (*/}
            {/*          <Link*/}
            {/*              key={link.href}*/}
            {/*              href={link.href}*/}
            {/*              className={cn(link.hideOnLg && "xl:hidden 2xl:flex")}*/}
            {/*          >*/}
            {/*            <Button variant="unstyled">{link.label}</Button>*/}
            {/*          </Link>*/}
            {/*      )}*/}
            {/*    </Fragment>*/}
            {/*))}*/}

            <div className="flex items-center justify-center gap-4">
              <Link href="/user/login">
                <Button variant="secondary" disabled={isLoading}>
                  Login
                </Button>
              </Link>

              <Link href="/user/signup">
                <Button
                    variant="primary"
                    rightIcon={<ArrowRightIcon className="size-4" />}
                    disabled={isLoading}
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

const NavbarSkeleton= ({
                              isLoading,
                              resetPage,
                              exploreDropdownOpen,
                              setExploreDropdownOpen,
                              hoveredCategory,
                              setHoveredCategory,
                              exploreCategories,
                              categoriesLoading,
                              categoriesError,
                          }: NotLoggedInNavbarProps) => {
    return (
        <div className="sticky top-0 z-50 w-full">
            <nav className="hidden h-[80px] w-full items-center justify-between bg-white px-4 py-4 shadow-lg !shadow-dark-300/5 lg:flex">
                <div className="flex items-center justify-center gap-4">
                    <Link href="/">
                        <img
                            alt="Ummah Logo"
                            src={NAV_LOGO_SRC}
                            className="min-w-20 max-h-12 cursor-pointer object-contain"
                        />
                    </Link>

                    <ExploreDropDown
                        exploreDropdownOpen={exploreDropdownOpen}
                        setExploreDropdownOpen={setExploreDropdownOpen}
                        hoveredCategory={hoveredCategory}
                        setHoveredCategory={setHoveredCategory}
                        exploreCategories={exploreCategories}
                        categoriesLoading={categoriesLoading}
                        categoriesError={categoriesError}
                    />

                    <div className="hidden xl:block">
                        <NavSearchbar onSearch={resetPage} />
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {/* right side: keep width similar whether guest or authed */}
                    <div className="h-10 w-10 rounded-full bg-slate-200 animate-pulse" />
                    <div className="h-10 w-28 rounded-lg bg-slate-100 animate-pulse" />

                </div>
            </nav>
        </div>
    );
}
