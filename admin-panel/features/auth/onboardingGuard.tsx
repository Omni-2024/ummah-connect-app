"use client";

import { useCurrentUser } from "@/lib/hooks/useUserInfo";
import { useAccountStats } from "@/lib/hooks/useStripe";
import { ADMIN_ROLES } from "@/lib/constants";
import { OnboardingPopup } from "@/features/dashboard/components/onboardPopUp";

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const { data: profile, isLoading: profileLoading } = useCurrentUser();
  const { data: accountStat, isLoading: stripeLoading } = useAccountStats(profile?.id ?? "");

  const isBusinessAdmin = String(profile?.role) === ADMIN_ROLES.BUSINESS_ADMIN;

  // Loading state: show spinner while data is still fetching
  if (isBusinessAdmin && (profileLoading || stripeLoading)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-muted-foreground">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-lg font-medium">Loading your profile...</p>
        <p className="text-sm text-muted-foreground mt-1">Please wait a moment</p>
      </div>
    );
  }

  const isOnboarded = accountStat?.chargesEnabled && accountStat?.payoutsEnabled;

  // Show onboarding popup **only if we know the user is not onboarded**
  if (isBusinessAdmin && !isOnboarded) {
    return (
      <>
        <OnboardingPopup />
        <div className="blur-sm pointer-events-none select-none">
          {children}
        </div>
      </>
    );
  }

  // Normal access
  return <>{children}</>;
}
