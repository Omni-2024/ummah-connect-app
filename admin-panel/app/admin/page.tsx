import { OnboardingGuard } from "@/features/auth/onboardingGuard"
import ModernAdminDashboard from "@/features/dashboard/ModernAdminDashboard"

export default function Page() {
  return (
      <OnboardingGuard>
  
        <ModernAdminDashboard />
      
      </OnboardingGuard>
  )
}
