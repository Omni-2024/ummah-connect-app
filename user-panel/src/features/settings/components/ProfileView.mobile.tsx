"use client"
import {
  MedalStar,
  Profile,
  Receipt1,
  Setting2,
  SmsTracking,
} from "iconsax-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/base/Avatar";
import SettingsItem, {
  SettingsItemProps,
} from "@/features/settings/components/SettingsItem.mobile";
import { ColorPalatte } from "@/lib/constants";
import useIsDesktop from "@/lib/hooks/useIsDesktop";
import { useCurrentUser } from "@/lib/hooks/useUser";
import {buildAvatarUrl} from "@/features/app/components/Navbar";

export const ProfileView = () => {
  const router = useRouter();
  const isDesktop = useIsDesktop();

  const { data: currentUser, isLoading: isCurrentUserLoading } =
    useCurrentUser();

  const avatarUrl = buildAvatarUrl(currentUser?.profileImage)


  useEffect(() => {
    if (isDesktop) {
      router.push("/settings/account");
    }
  }, [isDesktop]);

  const settingsItems: SettingsItemProps[] = [
    {
      title: "My Subscriptions",
      path: "/my/subscriptions",
      icon: <Profile className="size-6 text-primary-500" variant="Bold" />,
      disabled: true,
    },
    {
      title: "My Purchases",
      path: "/my/purchases",
      icon: <Receipt1 className="size-6 text-primary-500" variant="Bold" />,
    },
    {
      title: "Become a Contributor",
      path: "/become-contributor",
      icon: <SmsTracking className="size-6 text-primary-500" variant="Bold" />,
      disabled: true,
    },
    {
      title: "Settings",
      path: "/settings",
      icon: <Setting2 className="size-6 text-primary-500" variant="Bold" />,
    },
  ];

  return (
    <div>
      <div className="relative select-none px-4 py-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="font-primary text-xl font-semibold text-white">
              My Profile
            </h1>
            {/* <div>
              <Setting2 className="size-6 text-white" />
            </div> */}
          </div>

          <div className="flex items-center gap-4">
            <Avatar className="size-16 bg-white">
              <AvatarImage
                src={
                  currentUser?.profileImage
                    ? avatarUrl ?? undefined
                    : undefined
                }
              />
              <AvatarFallback>{currentUser?.name[0]}</AvatarFallback>
            </Avatar>

            <div className="space-y-1 text-white">
              <div className="line-clamp-1 font-primary text-lg font-medium leading-none">
                {currentUser?.name}
              </div>
              <p className="text-sm font-light">{currentUser?.email}</p>
            </div>
          </div>
        </div>

        <div
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: "url(/images/textures/4.svg)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-l from-primary-600/80 to-primary-700" />
        </div>
      </div>

      <div className="container px-3 py-3">
        <div className="flex flex-col gap-4 py-3">
          {settingsItems?.map((props) => (
            <SettingsItem key={props.title} {...props} />
          ))}
        </div>
      </div>
    </div>
  );
};
