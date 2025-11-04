"use client";

import { Home, Profile, SearchNormal1, User, ShoppingCart, LogoutCurve } from "iconsax-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronRightIcon, Cross2Icon } from "@radix-ui/react-icons";

import { cn } from "@/lib/className";
import { useAuthState } from "@/features/auth/context/useAuthState";

type BottomBarProps = {
  user: any;
  avatarUrl: string | null;
  avatarBroken: boolean;
  setAvatarBroken: (broken: boolean) => void;
  handleLogout: () => void;
};

const BottomBar = ({ 
  user,
  avatarUrl,
  avatarBroken,
  setAvatarBroken,
  handleLogout
}: BottomBarProps) => {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const { isAuthenticated } = useAuthState();
  
  const [showProfileModal, setShowProfileModal] = useState(false);

  const getTabActiveStatus = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  const handleProfileClick = () => {
    if (!isAuthenticated) {
      router.push("/user/login");
    } else {
      setShowProfileModal(true);
    }
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    setShowProfileModal(false);
  };

  const handleLogoutClick = () => {
    handleLogout();
    setShowProfileModal(false);
  };

  const isExploreActive = getTabActiveStatus("/explore");
  const isProfileActive = getTabActiveStatus("/my-profile") || getTabActiveStatus("/my-purchases");

  return (
    <>
      <nav className="fixed bottom-0 z-50 flex h-16 w-full items-center justify-around border-t border-slate-200 bg-white shadow-lg lg:hidden">
        {/* Home */}
        <Link
          href="/"
          className="flex flex-1 select-none flex-col items-center justify-center gap-1.5 py-2"
        >
          <Home
            size={24}
            color={getTabActiveStatus("/") ? "#10b981" : "#64748b"}
            variant={getTabActiveStatus("/") ? "Bold" : "Outline"}
            className="transition-all duration-200"
          />
          <span
            className={cn("text-center text-xs font-medium transition-colors duration-200", {
              "text-emerald-600": getTabActiveStatus("/"),
              "text-slate-500": !getTabActiveStatus("/"),
            })}
          >
            Home
          </span>
        </Link>

        {/* Explore */}
        <Link
          href="/explore"
          className="flex flex-1 select-none flex-col items-center justify-center gap-1.5 py-2"
        >
          <SearchNormal1
            size={24}
            color={isExploreActive ? "#10b981" : "#64748b"}
            variant={isExploreActive ? "Bold" : "Outline"}
            className="transition-all duration-200"
          />
          <span
            className={cn("text-center text-xs font-medium transition-colors duration-200", {
              "text-emerald-600": isExploreActive,
              "text-slate-500": !isExploreActive,
            })}
          >
            Explore
          </span>
        </Link>

        {/* Profile */}
        <button
          type="button"
          onClick={handleProfileClick}
          className="flex flex-1 select-none flex-col items-center justify-center gap-1.5 py-2"
        >
          {isAuthenticated && user ? (
            <>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center overflow-hidden ring-2 ring-white shadow-sm">
                {!avatarUrl || avatarBroken ? (
                  <User size={16} color="#ffffff" variant="Bold" />
                ) : (
                  <Image
                    src={avatarUrl}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                    onError={() => setAvatarBroken(true)}
                  />
                )}
              </div>
              <span
                className={cn("text-center text-xs font-medium transition-colors duration-200 truncate max-w-[70px]", {
                  "text-emerald-600": isProfileActive,
                  "text-slate-500": !isProfileActive,
                })}
              >
                My Profile
              </span>
            </>
          ) : (
            <>
              <Profile
                size={24}
                color={isProfileActive ? "#10b981" : "#64748b"}
                variant={isProfileActive ? "Bold" : "Outline"}
                className="transition-all duration-200"
              />
              <span
                className={cn("text-center text-xs font-medium transition-colors duration-200", {
                  "text-emerald-600": isProfileActive,
                  "text-slate-500": !isProfileActive,
                })}
              >
                Profile
              </span>
            </>
          )}
        </button>
      </nav>

      {/* Profile Modal - Matching PC ProfileDropdown */}
      {showProfileModal && (
        <div className="lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] animate-in fade-in duration-200"
            onClick={() => setShowProfileModal(false)}
          />
          <div className="fixed inset-x-0 bottom-0 z-[70] bg-white rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[70vh] flex flex-col">
            {/* Profile Header - Matching PC dropdown gradient style */}
            <div className="relative bg-gradient-to-br from-emerald-50 to-teal-50 px-6 pt-6 pb-8 rounded-t-3xl border-b border-slate-100">
              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                className="absolute top-5 right-5 w-9 h-9 bg-white hover:bg-slate-100 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm"
              >
                <Cross2Icon className="w-4 h-4 text-slate-600" />
              </button>
              
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center overflow-hidden ring-2 ring-white shadow-sm">
                  {!avatarUrl || avatarBroken ? (
                    <User size={28} color="#ffffff" variant="Bold" />
                  ) : (
                    <Image
                      src={avatarUrl}
                      alt="Profile"
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                      onError={() => setAvatarBroken(true)}
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-semibold text-slate-900 truncate">{user?.name || 'User'}</p>
                  <p className="text-sm text-slate-600 truncate mt-0.5">{user?.email}</p>
                  <div className="flex items-center mt-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span className="text-xs text-slate-500 ml-1.5">Online</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Items - Only My Profile and My Purchases (matching PC navbar) */}
            <div className="flex-1 overflow-y-auto pb-24 py-3">
              <button
                type="button"
                onClick={() => handleNavigation("/my-profile")}
                className="flex items-center w-full text-left px-6 py-4 hover:bg-slate-50 hover:text-emerald-600 transition-colors duration-200 group"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-100 group-hover:bg-emerald-100 flex items-center justify-center mr-4 transition-colors duration-200">
                  <User size={20} color="currentColor" className="text-slate-600 group-hover:text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900 group-hover:text-emerald-600">My Profile</p>
                  <p className="text-xs text-slate-500 mt-0.5">View and edit profile</p>
                </div>
                <ChevronRightIcon className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors duration-200" />
              </button>

              <button
                type="button"
                onClick={() => handleNavigation("/my-purchases")}
                className="flex items-center w-full text-left px-6 py-4 hover:bg-slate-50 hover:text-emerald-600 transition-colors duration-200 group"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-100 group-hover:bg-emerald-100 flex items-center justify-center mr-4 transition-colors duration-200">
                  <ShoppingCart size={20} color="currentColor" className="text-slate-600 group-hover:text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900 group-hover:text-emerald-600">My Purchases</p>
                  <p className="text-xs text-slate-500 mt-0.5">Learning progress</p>
                </div>
                <ChevronRightIcon className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors duration-200" />
              </button>

              {/* Logout Button - Matching PC dropdown style */}
              <div className="border-t border-slate-100 mt-2 pt-2">
                <button
                  type="button"
                  onClick={handleLogoutClick}
                  className="flex items-center w-full text-left px-6 py-4 text-red-600 hover:bg-red-50 transition-colors duration-200 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-red-50 group-hover:bg-red-100 flex items-center justify-center mr-4 transition-colors duration-200">
                    <LogoutCurve size={20} color="#dc2626" variant="Bold" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Sign Out</p>
                    <p className="text-xs text-red-400 mt-0.5">End your session</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BottomBar;