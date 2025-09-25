"use client"

import {useState} from "react"
import Link from "next/link"
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  ChevronDown,
  DollarSign,
  Download,
  Eye,
  Filter,
  RefreshCw,
  Settings,
  ShoppingCart,
  UserCheck,
  Users,
} from "lucide-react"

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/base/card"
import {Button} from "@/components/ui/button"
import {Badge} from "@/components/base/badge"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Input} from "@/components/base/input"
import {Label} from "@/components/base/label"
import {GetStatsParams, ScopeType} from "@/lib/endpoints/paymentFns";
import {useGeneralUser} from "@/lib/hooks/useGeneralUsers";
import {useStats} from "@/hooks/usePayments";


/* ------------------------------ Utils ------------------------------ */

function fmtNumber(n?: number) {
  if (n == null) return "—"
  return n.toLocaleString()
}

function fmtCurrency(n?: number) {
  if (n == null) return "—"
  return `$${n.toLocaleString()}`
}

function GrowthIndicator({ value, className = "" }: { value?: number; className?: string }) {
  if (value == null) return <span className="text-muted-foreground">—</span>

  const isPositive = value > 0
  const isNeutral = value === 0

  return (
      <div className={`flex items-center gap-1 ${className}`}>
        {!isNeutral &&
            (isPositive ? (
                <ArrowUpRight className="h-3 w-3 text-emerald-500" />
            ) : (
                <ArrowDownRight className="h-3 w-3 text-red-500" />
            ))}
        <span
            className={`text-xs font-medium ${
                isNeutral ? "text-muted-foreground" : isPositive ? "text-emerald-500" : "text-red-500"
            }`}
        >
        {isNeutral ? "0%" : `${isPositive ? "+" : ""}${value.toFixed(1)}%`}
      </span>
      </div>
  )
}

/* ---------------------------- Filters UI --------------------------- */

function FiltersPanel({
                        value,
                        onChange,
                        onRefresh,
                      }: {
  value: GetStatsParams
  onChange: (v: GetStatsParams) => void
  onRefresh: () => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [monthPopoverOpen, setMonthPopoverOpen] = useState(false)
  const [rangePopoverOpen, setRangePopoverOpen] = useState(false)

  const handleScopeChange = (scope: ScopeType) => {
    const newParams: GetStatsParams = { ...value, scope }
    if (scope !== "month") {
      delete newParams.month
      delete newParams.year
    }
    if (scope !== "range") {
      delete newParams.start
      delete newParams.end
    }
    onChange(newParams)
  }

  const handleClearFilters = () => {
    onChange({
      scope: ScopeType.LAST_30D,
      groupBy:"day",
      topLimit: 5,
    } as GetStatsParams)
  }

  const handleMonthChange = (month: number, year: number) => {
    onChange({ ...value, month, year })
    setMonthPopoverOpen(false)
  }

  const handleStartDateChange = (start: string) => {
    onChange({ ...value, start })
  }

  const handleEndDateChange = (end: string) => {
    onChange({ ...value, end })
  }

  const generateMonthOptions = () => {
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth()
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]

    const options = []

    for (let i = 0; i <= currentMonth; i++) {
      options.push({ month: i + 1, year: currentYear, label: `${months[i]} ${currentYear}` })
    }

    for (let i = 0; i < 12; i++) {
      options.push({ month: i + 1, year: currentYear - 1, label: `${months[i]} ${currentYear - 1}` })
    }

    return options
  }

  const getSelectedMonthLabel = () => {
    if (value.month && value.year) {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      return `${months[value.month - 1]} ${value.year}`
    }
    return "Select Month"
  }

  const getSelectedRangeLabel = () => {
    if (value.start && value.end) {
      const startDate = new Date(value.start).toLocaleDateString()
      const endDate = new Date(value.end).toLocaleDateString()
      return `${startDate} - ${endDate}`
    } else if (value.start) {
      return `From ${new Date(value.start).toLocaleDateString()}`
    } else if (value.end) {
      return `Until ${new Date(value.end).toLocaleDateString()}`
    }
    return "Select Range"
  }

  return (
      <div className="flex items-center gap-3 flex-wrap">
        <Button variant="outline" size="sm" onClick={() => setIsOpen(!isOpen)} className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>

        <div className="flex items-center gap-2">
          <Button
              variant={value.scope === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => handleScopeChange(ScopeType.ALL)}
              className="gap-2"
          >
            <Calendar className="h-4 w-4" />
            All
          </Button>
          <Button
              variant={value.scope === "last_week" ? "default" : "outline"}
              size="sm"
              onClick={() => handleScopeChange(ScopeType.LAST_WEEK)}
              className="gap-2"
          >
            <Calendar className="h-4 w-4" />
            Last 7 days
          </Button>
          <Button
              variant={value.scope === "last_30d" ? "default" : "outline"}
              size="sm"
              onClick={() => handleScopeChange(ScopeType.LAST_30D)}
              className="gap-2"
          >
            <Calendar className="h-4 w-4" />
            Last 30 days
          </Button>

          <Popover open={monthPopoverOpen} onOpenChange={setMonthPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                  variant={value.scope === "month" ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    if (value.scope !== "month") {
                      handleScopeChange(ScopeType.MONTH)
                    }
                    setMonthPopoverOpen(true)
                  }}
                  className="gap-2"
              >
                <Calendar className="h-4 w-4" />
                {value.scope === "month" ? getSelectedMonthLabel() : "Month"}
                <ChevronDown className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-4">
              <div className="space-y-3">
                <Label className="text-sm font-medium">Select Month</Label>
                <Select
                    value={value.month && value.year ? `${value.month}-${value.year}` : ""}
                    onValueChange={(val) => {
                      const [month, year] = val.split("-").map(Number)
                      handleMonthChange(month, year)
                    }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a month" />
                  </SelectTrigger>
                  <SelectContent>
                    {generateMonthOptions().map((option) => (
                        <SelectItem key={`${option.month}-${option.year}`} value={`${option.month}-${option.year}`}>
                          {option.label}
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </PopoverContent>
          </Popover>

          <Popover open={rangePopoverOpen} onOpenChange={setRangePopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                  variant={value.scope === "range" ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    if (value.scope !== "range") {
                      handleScopeChange(ScopeType.RANGE)
                    }
                    setRangePopoverOpen(true)
                  }}
                  className="gap-2"
              >
                <Calendar className="h-4 w-4" />
                {value.scope === "range" ? getSelectedRangeLabel() : "Range"}
                <ChevronDown className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4">
              <div className="space-y-4">
                <Label className="text-sm font-medium">Select Date Range</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="start-date" className="text-xs text-muted-foreground">
                      From
                    </Label>
                    <Input
                        id="start-date"
                        type="date"
                        value={value.start ? value.start.split("T")[0] : ""}
                        onChange={(e) => {
                          const isoDate = e.target.value ? new Date(e.target.value).toISOString() : ""
                          handleStartDateChange(isoDate)
                        }}
                        className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-date" className="text-xs text-muted-foreground">
                      To
                    </Label>
                    <Input
                        id="end-date"
                        type="date"
                        value={value.end ? value.end.split("T")[0] : ""}
                        onChange={(e) => {
                          const isoDate = e.target.value ? new Date(e.target.value).toISOString() : ""
                          handleEndDateChange(isoDate)
                        }}
                        className="text-sm"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        onChange({ ...value, start: undefined, end: undefined })
                      }}
                  >
                    Clear
                  </Button>
                  <Button size="sm" onClick={() => setRangePopoverOpen(false)} disabled={!value.start && !value.end}>
                    Apply
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <Button variant="outline" size="sm" className="gap-2 bg-transparent" onClick={handleClearFilters}>
          <RefreshCw className="h-4 w-4" />
          Clear Filters
        </Button>

        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Download className="h-4 w-4" />
          Export
        </Button>

        <Button variant="outline" size="sm" className="gap-2 bg-transparent" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>
  )
}

/* ---------------------- Provider Row Component --------------------- */

function TopProviderRow({ item, index }: { item: any; index: number }) {
  const { data: provider, isLoading } = useGeneralUser(item.providerId)

  return (
      <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:border-border transition-colors group">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
            {index + 1}
          </div>
          <div className="flex-1">
            <div className="font-medium text-sm">
              {isLoading ? (
                  <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              ) : (
                  (provider?.name ?? provider?.email ?? `Provider ${item.providerId.slice(0, 8)}`)
              )}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {isLoading ? (
                  <div className="h-3 w-32 bg-muted animate-pulse rounded" />
              ) : (
                  (provider?.email ?? `ID: ${item.providerId.slice(0, 12)}...`)
              )}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium">{fmtNumber(item.orders)} orders</div>
          <div className="text-xs text-muted-foreground">{fmtCurrency(item.revenue)}</div>
        </div>
        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
          <Eye className="h-4 w-4" />
        </Button>
      </div>
  )
}

/* ---------------------------- Main Dashboard ---------------------------- */

export default function ModernAdminDashboard() {
  const [params, setParams] = useState<GetStatsParams>({
    scope: ScopeType.LAST_30D,
    groupBy: "day",
    topLimit: 5,
  } as GetStatsParams)

  const { data: stats, isLoading: statsLoading, isError, error, refetch } = useStats(params)

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
              <h1 className="text-3xl font-bold tracking-tight text-balance">Analytics Dashboard</h1>
              <p className="text-muted-foreground mt-2">Monitor your business performance and key metrics</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="gap-2 px-3 py-1">
                <Activity
                    className={`h-3 w-3 ${statsLoading ? "text-yellow-500" : isError ? "text-red-500" : "text-emerald-500"}`}
                />
                {statsLoading ? "Loading..." : isError ? "Error" : "Live Data"}
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
                    <CardTitle className="text-destructive">Unable to load data</CardTitle>
                  </div>
                  <CardDescription>
                    {(error instanceof Error ? error.message : error ? String(error) : "There was an error loading the analytics data.")}{" "}
                    Please try refreshing or adjusting your filters.
                  </CardDescription>
                </CardHeader>
              </Card>
          )}

          {/* KPI Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpiCards.map((kpi, index) => {
              const Icon = kpi.icon
              return (
                  <Card
                      key={kpi.title}
                      className="relative overflow-hidden animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
                      <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                        <Icon className={`h-4 w-4 ${kpi.color}`} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {statsLoading ? <div className="h-8 w-20 bg-muted animate-pulse rounded" /> : kpi.format(kpi.value)}
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        {statsLoading ? (
                            <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                        ) : (
                            <GrowthIndicator value={kpi.growth} />
                        )}
                        <span className="text-xs text-muted-foreground">vs last period</span>
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
                    <CardDescription>Best performing services by revenue</CardDescription>
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
                          <div key={i} className="flex items-center justify-between p-3">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 bg-muted animate-pulse rounded-full" />
                              <div className="space-y-1">
                                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                                <div className="h-3 w-16 bg-muted animate-pulse rounded" />
                              </div>
                            </div>
                            <div className="text-right space-y-1">
                              <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                              <div className="h-3 w-12 bg-muted animate-pulse rounded" />
                            </div>
                          </div>
                      ))}
                    </div>
                ) : stats?.data?.topServices?.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No services data available</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                      {stats?.data?.topServices?.map((service: any, index: number) => (
                          <div
                              key={service.serviceId}
                              className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:border-border transition-colors group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                                {index + 1}
                              </div>
                              <div>
                                <div className="font-medium text-sm">{service.serviceName ?? "Untitled Service"}</div>
                                <div className="text-xs text-muted-foreground">ID: {service.serviceId}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium">{fmtNumber(service.orders)} orders</div>
                              <div className="text-xs text-muted-foreground">{fmtCurrency(service.revenue)}</div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                      ))}
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
                    <CardDescription>Highest performing service providers</CardDescription>
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
                          <div key={i} className="flex items-center justify-between p-3">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 bg-muted animate-pulse rounded-full" />
                              <div className="space-y-1">
                                <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                                <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                              </div>
                            </div>
                            <div className="text-right space-y-1">
                              <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                              <div className="h-3 w-12 bg-muted animate-pulse rounded" />
                            </div>
                          </div>
                      ))}
                    </div>
                ) : stats?.data?.topProviders?.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No providers data available</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                      {stats?.data?.topProviders?.map((provider: any, index: number) => (
                          <TopProviderRow key={provider.providerId} item={provider} index={index} />
                      ))}
                    </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  )
}
