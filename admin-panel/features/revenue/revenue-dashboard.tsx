// "use client"

// import { useEffect, useState } from "react"
// import { 
//   getStatsFn, 
//   type GetStatsData, 
//   type Payment, 
//   ScopeType
// } from "@/lib/endpoints/paymentFns"
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/base/card"
// import RevenueChart from "./components/revenue-chart"
// import TopList from "./components/revenue-top-list"
// import RecentPayments from "./components/recent-payments"
// import ProviderPayments from "./payments/provider-payment"
// import AdminDashboardSkeleton from "./skeleton/skeleton" // ✅ skeleton loader

// export default function RevenueDashboard() {
//   const [stats, setStats] = useState<GetStatsData | null>(null)
//   const [recentPayments, setRecentPayments] = useState<Payment[]>([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const statsRes = await getStatsFn({ scope: ScopeType.LAST_30D })
//         setStats(statsRes.data)

//         // Replace with real API call later
//         const dummyPayments: Payment[] = []
//         setRecentPayments(dummyPayments)
//       } catch (error) {
//         console.error("Failed to fetch dashboard data", error)
//       } finally {
//         setLoading(false)
//       }
//     }
//     fetchData()
//   }, [])

//   // ✅ Show skeleton while loading (no text message)
//   if (loading || !stats) return <AdminDashboardSkeleton />

//   return (
//     <div className="space-y-6">
//       {/* KPI Cards */}
//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
//         <Card>
//           <CardHeader>
//             <CardTitle>Total Revenue</CardTitle>
//           </CardHeader>
//           <CardContent className="text-2xl font-bold">
//             ${stats.totals.revenue.toFixed(2)}
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader>
//             <CardTitle>Total Payments</CardTitle>
//           </CardHeader>
//           <CardContent className="text-2xl font-bold">
//             {stats.totals.paymentsCount}
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader>
//             <CardTitle>Users</CardTitle>
//           </CardHeader>
//           <CardContent className="text-2xl font-bold">
//             {stats.totals.registeredUsers}
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader>
//             <CardTitle>Providers</CardTitle>
//           </CardHeader>
//           <CardContent className="text-2xl font-bold">
//             {stats.totals.registeredProviders}
//           </CardContent>
//         </Card>
//       </div>

//       {/* Provider Payments */}
//       <ProviderPayments />

//       {/* Revenue Chart */}
//       <RevenueChart series={stats.series} />

//       {/* Top Lists */}
//       <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
//         <TopList
//           title="Top Services"
//           items={stats.topServices.map((s) => ({
//             name: s.serviceId, // replace with serviceName if available
//             orders: s.orders,
//             revenue: s.revenue,
//           }))}
//         />
//         <TopList
//           title="Top Providers"
//           items={stats.topProviders.map((p) => ({
//             name: p.providerName,
//             orders: p.orders,
//             revenue: p.revenue,
//           }))}
//         />
//       </div>

//       {/* Recent Payments */}
//       <RecentPayments payments={recentPayments} />
//     </div>
//   )
// }


"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/base/card"
import Button from "@/components/base/button"
import { getAllGeneralProvidersFn } from "@/lib/endpoints/providersFns"
import { getPaymentsByServiceFn, Payment } from "@/lib/endpoints/paymentFns"
import type { UserData } from "@/types/data"
import { Avatar, AvatarFallback } from "@/components/base/avatar"
import { Badge } from "@/components/base/badge"
import { Calendar } from "lucide-react"
import dayjs from "dayjs"
import ProviderPaymentsSkeleton from "@/features/revenue/skeleton/ProviderCardSkeleton"

type PaymentRecord = {
  id: string
  providerId: string
  providerName: string
  serviceName: string
  amount: number
  createdAt: string
  paidToProvider: boolean
}

export default function ProviderPayments() {
  const [payments, setPayments] = useState<PaymentRecord[]>([])
  const [providers, setProviders] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  // Pagination
  const [visibleCount, setVisibleCount] = useState(20)

  useEffect(() => {
    async function fetchPayments() {
      setLoading(true)
      try {
        const providersRes = await getAllGeneralProvidersFn({ limit: 100, offset: 0 })
        const providerData = providersRes.data
        setProviders(providerData)

        const allPayments: PaymentRecord[] = []

        for (const provider of providerData) {
          const paymentsRes = await getPaymentsByServiceFn(provider.id) // assuming serviceId = provider.id
          const paymentData: Payment[] = paymentsRes.data

          const mapped = paymentData.map(p => ({
            id: p.paymentIntent,
            providerId: p.userId,
            providerName: provider.name,
            serviceName: p.serviceName,
            amount: p.amount,
            createdAt: p.createdAt,
            paidToProvider: p.providerTransferStatus === "transferred",
          }))

          allPayments.push(...mapped)
        }

        setPayments(allPayments)
      } catch (err) {
        console.error("Failed to load payments", err)
      } finally {
        setLoading(false)
      }
    }

    fetchPayments()
  }, [])

  const togglePayment = async (payment: PaymentRecord) => {
    setUpdatingId(payment.id)
    try {
      const newPaidStatus = !payment.paidToProvider
      await fetch(`/api/payment/${payment.id}`, {
        method: "PATCH",
        body: JSON.stringify({ paidToProvider: newPaidStatus }),
        headers: { "Content-Type": "application/json" },
      })

      setPayments(prev =>
        prev.map(p => (p.id === payment.id ? { ...p, paidToProvider: newPaidStatus } : p))
      )
    } catch (err) {
      console.error("Failed to update payment", err)
    } finally {
      setUpdatingId(null)
    }
  }

  const visiblePayments = payments.slice(0, visibleCount)

  return (
    <div className="space-y-4">
      {/* Payments Grid */}
      {loading ? (
        <ProviderPaymentsSkeleton count={3} />
      ) : (
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}
        >
          {visiblePayments.map(p => (
            <Card
              key={p.id}
              className="border-primary-100 hover:border-primary/30 bg-white rounded-xl flex flex-col justify-between h-full"
            >
              <CardHeader className="flex flex-row items-start justify-between pb-3 border-b border-primary-100 min-h-[110px]">
                <div className="flex items-start gap-3 w-full">
                  <Avatar>
                    <AvatarFallback>{p.providerName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col justify-between flex-1">
                    <div className="min-h-[48px] max-h-[48px] flex items-start overflow-hidden">
                      <CardTitle
                        className="text-md font-bold text-primary leading-snug line-clamp-2 break-words"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          wordBreak: "break-word",
                        }}
                      >
                        {p.serviceName}
                      </CardTitle>
                    </div>
                    <p className="text-sm text-muted-foreground rounded-full px-2 py-0.5 w-fit text-primary-700 bg-primary-50 border border-primary-700 mt-1">
                      {p.providerName}
                    </p>
                  </div>
                </div>
                <Badge
                  className={`${
                    p.paidToProvider ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"
                  }`}
                >
                  {p.paidToProvider ? "Paid" : "Pending"}
                </Badge>
              </CardHeader>

              <CardContent className="flex flex-col justify-between flex-grow pt-4">
                <div className="space-y-3 flex-grow">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-semibold text-lg">${(p.amount / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Date</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {dayjs(p.createdAt).format("MMM D, YYYY")}
                    </span>
                  </div>
                </div>

                <div className="pt-4 mt-auto">
                  <Button
                    onClick={() => togglePayment(p)}
                    disabled={updatingId === p.id}
                    variant={p.paidToProvider ? "secondary" : "primary"}
                    className="w-full"
                  >
                    {updatingId === p.id
                      ? "Updating..."
                      : p.paidToProvider
                      ? "Mark as Unpaid"
                      : "Mark as Paid"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Load More */}
      {!loading && visibleCount < payments.length && (
        <Button onClick={() => setVisibleCount(prev => prev + 20)} className="mt-4 w-full">
          Load More
        </Button>
      )}
    </div>
  )
}
