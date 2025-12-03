"use client"

import { OnboardingGuard } from "@/features/auth/onboardingGuard"
// import ProviderPaymentsProviderView from "@/features/revenue/payments/provider-payment"
// import ProviderPayments from "@/features/revenue/payments/provider-payment"
import ProviderPaymentsMerged from "@/features/revenue/revenue-dashboard"
import RevenueDashboard from "@/features/revenue/revenue-dashboard" // 👈 

export default function AdminRevenuePage() {
  return (
    <OnboardingGuard>
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Revenue & Finance</h1>
        <p className="text-muted-foreground mt-2">
          Platform revenue analytics and financial overview
        </p>
      </div>

      {/* Revenue Dashboard */}
      <ProviderPaymentsMerged />
    </div>
    </OnboardingGuard>
  )
}
