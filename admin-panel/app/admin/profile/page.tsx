import { OnboardingGuard } from "@/features/auth/onboardingGuard"
import { ProfileManagement } from "@/features/profile/profile-management"

export default function ProfilePage() {
  return (
    <OnboardingGuard>
      <ProfileManagement />
    </OnboardingGuard>
  );
}

