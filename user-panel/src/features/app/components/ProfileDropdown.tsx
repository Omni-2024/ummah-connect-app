import React from "react"
import Image from "next/image"
import { PersonIcon, DashboardIcon, GearIcon, ExitIcon, ChevronDownIcon } from "@radix-ui/react-icons"
import { useRouter } from "next/navigation"

const ProfileDropdown = ({
  profileDropdownOpen,
  setProfileDropdownOpen,
  user,
  avatarUrl,
  avatarBroken,
  setAvatarBroken,
  isFetched,
  isLoading,
  router,
  handleLogout
}: {
  profileDropdownOpen: boolean;
  setProfileDropdownOpen: (open: boolean) => void;
  user: any;
  avatarUrl: string | null;
  avatarBroken: boolean;
  setAvatarBroken: (broken: boolean) => void;
  isFetched: boolean;
  isLoading: boolean;
  router: any;
  handleLogout: () => void;
}) => {
  return (
    <div className="relative">
      <button
        onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
        className="flex items-center space-x-3 p-2  rounded-xl hover:bg-slate-50 transition-all duration-200 group border border-transparent hover:border-slate-200"
      >
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center overflow-hidden ring-2 ring-white shadow-sm">
          {!isFetched || isLoading ? (
            <div className="animate-pulse w-full h-full bg-slate-300 rounded-full" />
          ) : !avatarUrl || avatarBroken ? (
            <PersonIcon className="w-4 h-4 text-white" />
          ) : (
            <Image
              src={avatarUrl}
              alt="Profile"
              width={36}
              height={36}
              className="w-full h-full object-cover"
              onError={() => setAvatarBroken(true)}
              priority
            />
          )}
        </div>
        <div className="hidden sm:block text-left">
          <div className="text-sm font-medium text-slate-900 truncate max-w-32">{user?.name || 'User'}</div>
          <div className="text-xs text-slate-500">View profile</div>
        </div>
        <ChevronDownIcon className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors duration-200" />
      </button>
      {profileDropdownOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setProfileDropdownOpen(false)} />
          <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
            <div className="relative bg-gradient-to-br from-emerald-50 to-teal-50 px-6 py-4 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center overflow-hidden ring-2 ring-white shadow-sm">
                  {!avatarUrl || avatarBroken ? (
                    <PersonIcon className="w-6 h-6 text-white" />
                  ) : (
                    <Image
                      src={avatarUrl}
                      alt="Profile"
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                      onError={() => setAvatarBroken(true)}
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{user?.name || 'User'}</p>
                  <p className="text-xs text-slate-600 truncate">{user?.email}</p>
                  <div className="flex items-center mt-1">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span className="text-xs text-slate-500 ml-1">Online</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="py-2">
              <button
                onClick={() => { router.push("/profile"); setProfileDropdownOpen(false); }}
                className="flex items-center w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition-colors duration-200 group"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-emerald-100 flex items-center justify-center mr-3 transition-colors duration-200">
                  <PersonIcon className="w-4 h-4 text-slate-600 group-hover:text-emerald-600" />
                </div>
                <div>
                  <div className="font-medium">My Profile</div>
                  <div className="text-xs text-slate-500">View and edit profile</div>
                </div>
              </button>
              <button
                onClick={() => { router.push("/dashboard"); setProfileDropdownOpen(false); }}
                className="flex items-center w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition-colors duration-200 group"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-emerald-100 flex items-center justify-center mr-3 transition-colors duration-200">
                  <DashboardIcon className="w-4 h-4 text-slate-600 group-hover:text-emerald-600" />
                </div>
                <div>
                  <div className="font-medium">Dashboard</div>
                  <div className="text-xs text-slate-500">Learning progress</div>
                </div>
              </button>
              <button
                onClick={() => { router.push("/settings"); setProfileDropdownOpen(false); }}
                className="flex items-center w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition-colors duration-200 group"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-emerald-100 flex items-center justify-center mr-3 transition-colors duration-200">
                  <GearIcon className="w-4 h-4 text-slate-600 group-hover:text-emerald-600" />
                </div>
                <div>
                  <div className="font-medium">Settings</div>
                  <div className="text-xs text-slate-500">Account preferences</div>
                </div>
              </button>
            </div>
            <div className="border-t border-slate-100 py-2">
              <button
                onClick={handleLogout}
                className="flex items-center w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 group"
              >
                <div className="w-8 h-8 rounded-lg bg-red-50 group-hover:bg-red-100 flex items-center justify-center mr-3 transition-colors duration-200">
                  <ExitIcon className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <div className="font-medium">Sign Out</div>
                  <div className="text-xs text-red-400">End your session</div>
                </div>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ProfileDropdown