"use client"

import { useEffect, useState } from "react"
import { 
  getStatsFn, 
  type GetStatsData, 
  type Payment, 
  ScopeType
} from "@/lib/endpoints/paymentFns"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/base/card"
import RevenueChart from "./components/revenue-chart"
import TopList from "./components/revenue-top-list"
import RecentPayments from "./components/recent-payments"
import ProviderPayments from "./payments/provider-payment"
import AdminDashboardSkeleton from "./skeleton/skeleton" // ✅ skeleton loader

export default function RevenueDashboard() {
  const [stats, setStats] = useState<GetStatsData | null>(null)
  const [recentPayments, setRecentPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const statsRes = await getStatsFn({ scope: ScopeType.LAST_30D })
        setStats(statsRes.data)

        // Replace with real API call later
        const dummyPayments: Payment[] = []
        setRecentPayments(dummyPayments)
      } catch (error) {
        console.error("Failed to fetch dashboard data", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // ✅ Show skeleton while loading (no text message)
  if (loading || !stats) return <AdminDashboardSkeleton />

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            ${stats.totals.revenue.toFixed(2)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Payments</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {stats.totals.paymentsCount}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {stats.totals.registeredUsers}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Providers</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {stats.totals.registeredProviders}
          </CardContent>
        </Card>
      </div>

      {/* Provider Payments */}
      <ProviderPayments />

      {/* Revenue Chart */}
      <RevenueChart series={stats.series} />

      {/* Top Lists */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <TopList
          title="Top Services"
          items={stats.topServices.map((s) => ({
            name: s.serviceId, // replace with serviceName if available
            orders: s.orders,
            revenue: s.revenue,
          }))}
        />
        <TopList
          title="Top Providers"
          items={stats.topProviders.map((p) => ({
            name: p.providerName,
            orders: p.orders,
            revenue: p.revenue,
          }))}
        />
      </div>

      {/* Recent Payments */}
      <RecentPayments payments={recentPayments} />
    </div>
  )
}
