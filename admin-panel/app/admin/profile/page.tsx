"use client"
import withAuth from "@/components/withAuth";
import { OnboardingGuard } from "@/features/auth/onboardingGuard"
import { ProfileManagement } from "@/features/profile/profile-management"
import { ADMIN_ROLES } from "@/lib/constants";

export default function ProfilePage() {
  return (
    <OnboardingGuard>
      <ProfileManagement />
    </OnboardingGuard>
  );
}

const Page = withAuth(ProfilePage, [
    ADMIN_ROLES.ADMIN,
    ADMIN_ROLES.OPERATIONAL_ADMIN,
    ADMIN_ROLES.BUSINESS_ADMIN,
    ADMIN_ROLES.ROOT,
]);

