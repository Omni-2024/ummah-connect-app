"use client"

import {useEffect, useState} from "react"
import Link from "next/link"
import {
  Activity,
  AlertTriangle,
  DollarSign,
  ShoppingCart,
  Users,
  UserCheck,
  Settings,
  ArrowUpRight,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/base/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/base/badge"

import { FiltersPanel } from "./components/FiltersPanel"
import { GrowthIndicator } from "./components/GrowthIndicator"
import { TopProviderRow } from "./components/TopProviderRow"
import {
  KpiCardSkeleton,
  ServiceRowSkeleton,
  ProviderRowSkeleton,
} from "./skeleton/components/DashboardSkeletons"

import { GetStatsParams, ScopeType } from "@/lib/endpoints/paymentFns"
import { useStats } from "@/hooks/usePayments"
import { Skeleton } from "./skeleton/skeleton"
import {useCurrentUser} from "@/lib/hooks/useUserInfo";
import {USER_ROLES} from "@/lib/constants";

/* utils */
function fmtNumber(n?: number) {
  if (n == null) return "—"
  return n.toLocaleString()
}
function fmtCurrency(n?: number) {
  if (n == null) return "—"
  return `$${n.toLocaleString()}`
}

export default function ModernAdminDashboard() {
  const {data,isError:userDataError}=useCurrentUser()
  const [params, setParams] = useState<GetStatsParams>({
    scope: ScopeType.LAST_30D,
    groupBy: "day",
    topLimit: 5,
    providerId : null
} as GetStatsParams)

    useEffect(() => {
        if (data) {
            console.log("Updating params after user loaded", data.role, data.id);

            setParams(prev => ({
                ...prev,
                providerId:
                    data.role === String (USER_ROLES.BUSINESS_ADMIN) ? data.id : null,
            }));
        }
    }, [data]);

  const {
    data: stats,
    isLoading: statsLoading,
    isError,
    error,
    refetch,
  } = useStats(params)

  const kpiCards = [
    {
      title: "Total Revenue",
      value: stats?.data?.totals?.revenue,
      format: fmtCurrency,
      growth: stats?.data?.growth?.revenuePct,
      icon: DollarSign,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      title: "Orders",
      value: stats?.data?.totals?.paymentsCount,
      format: fmtNumber,
      growth: stats?.data?.growth?.paymentsPct,
      icon: ShoppingCart,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Active Users",
      value: stats?.data?.totals?.registeredUsers,
      format: fmtNumber,
      growth: stats?.data?.growth?.usersPct,
      icon: Users,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Providers",
      value: stats?.data?.totals?.registeredProviders,
      format: fmtNumber,
      growth: stats?.data?.growth?.providersPct,
      icon: UserCheck,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="space-y-8 p-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-balance">
              Analytics Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Monitor your business performance and key metrics
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="gap-2 px-3 py-1">
              <Activity
                className={`h-3 w-3 ${
                  statsLoading
                    ? "text-yellow-500"
                    : isError
                    ? "text-red-500"
                    : "text-emerald-500"
                }`}
              />
              {statsLoading
                ? "Loading..."
                : isError
                ? "Error"
                : "Live Data"}
            </Badge>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Filters */}
        <FiltersPanel value={params} onChange={setParams} onRefresh={refetch} />

        {/* Error State */}
        {isError && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <CardTitle className="text-destructive">
                  Unable to load data
                </CardTitle>
              </div>
              <CardDescription>
                {error instanceof Error
                  ? error.message
                  : error
                  ? String(error)
                  : "There was an error loading the analytics data."}{" "}
                Please try refreshing or adjusting your filters.
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <KpiCardSkeleton key={i} />
              ))
            : kpiCards.map((kpi, index) => {
                const Icon = kpi.icon
                return (
                  <Card
                    key={kpi.title}
                    className="relative overflow-hidden animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {kpi.title}
                      </CardTitle>
                      <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                        <Icon className={`h-4 w-4 ${kpi.color}`} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {statsLoading ? (
                          <Skeleton className="h-8 w-20" />
                        ) : (
                          kpi.format(kpi.value)
                        )}
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        {statsLoading ? (
                          <Skeleton className="h-4 w-16" />
                        ) : (
                          <GrowthIndicator value={kpi.growth} />
                        )}
                        <span className="text-xs text-muted-foreground">
                          vs last period
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Services */}
          <Card className="animate-fade-in" style={{ animationDelay: "400ms" }}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Top Services
                    <Badge variant="secondary" className="text-xs">
                      {params.topLimit ?? 5}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Best performing services by revenue
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/admin/services" className="gap-2">
                    View All
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {statsLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <ServiceRowSkeleton key={i} />
                  ))}
                </div>
              ) : stats?.data?.topServices?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No services data available</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {stats?.data?.topServices?.map(
                    (service: any, index: number) => (
                      <div
                        key={service.serviceId}
                        className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:border-border transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium text-sm">
                              {service.serviceName ?? "Untitled Service"}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              ID: {service.serviceId}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {fmtNumber(service.orders)} orders
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {fmtCurrency(service.revenue)}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                        >
                          <ArrowUpRight className="h-4 w-4" />
                        </Button>
                      </div>
                    )
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Providers */}
          <Card className="animate-fade-in" style={{ animationDelay: "500ms" }}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Top Providers
                    <Badge variant="secondary" className="text-xs">
                      {params.topLimit ?? 5}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Highest performing service providers
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/admin/providers" className="gap-2">
                    View All
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {statsLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <ProviderRowSkeleton key={i} />
                  ))}
                </div>
              ) : stats?.data?.topProviders?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No providers data available</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {stats?.data?.topProviders?.map(
                    (provider: any, index: number) => (
                      <TopProviderRow
                        key={provider.providerId}
                        item={provider}
                        index={index}
                      />
                    )
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
