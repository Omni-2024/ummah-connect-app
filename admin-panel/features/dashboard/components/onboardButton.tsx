"use client";

import Button from "@/components/base/button";
import { useOnboardingLink } from "@/lib/hooks/useStripe";
import { useCurrentUser } from "@/hooks/useUserInfo";

export function OnboardButton() {
  const { data: user } = useCurrentUser();
  const { data: onboardingData, refetch } = useOnboardingLink(user?.id ?? "");

  const handleOnboard = async () => {
    const result = await refetch();
    const url = result.data?.url;

    if (url) {
      window.open(url, "_blank");
    } else {
      console.error("No onboarding link found.");
    }
  };

  return (
    <Button
      className="w-full bg-primary-700 text-white hover:bg-primary-500"
      onClick={handleOnboard}
    >
      Complete Onboarding
    </Button>
  );
}
