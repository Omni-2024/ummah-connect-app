"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/base/card"
import Button from "@/components/base/button"
import HttpRequest from "@/lib/http"
import { getAllGeneralProvidersFn } from "@/lib/endpoints/providersFns"
import { getAllServicesFn, Service } from "@/lib/endpoints/serviceFns"
import type { UserData } from "@/types/data"
import { Input } from "@/components/base/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/base/avatar"
import { Badge } from "@/components/base/badge"
import { Calendar } from "lucide-react"
import dayjs from "dayjs"
import ProviderPaymentsSkeleton from "../skeleton/ProviderCardSkeleton" // ✅ new skeleton

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

  // Filters
  const [searchTerm, setSearchTerm] = useState("")
  const [tab, setTab] = useState<"pending" | "completed" | "last7">("pending")
  const [selectedProvider, setSelectedProvider] = useState<string>("all")

  // Pagination
  const [visibleCount, setVisibleCount] = useState(20)

  useEffect(() => {
    async function fetchPayments() {
      try {
        const providersRes = await getAllGeneralProvidersFn({ limit: 100, offset: 0 })
        const providerData = providersRes.data
        setProviders(providerData)

        const servicesRes = await getAllServicesFn({ limit: 100, offset: 0 })
        const services = servicesRes.data

        const mapped: PaymentRecord[] = services.map((s: Service) => {
          const provider: UserData | undefined = providerData.find(p => p.id === s.providerId)

          return {
            id: s.id,
            providerId: s.providerId,
            providerName: provider?.name ?? "Unknown",
            serviceName: s.title,
            amount: s.price,
            createdAt: s.createdAt,
            paidToProvider: false,
          }
        })

        setPayments(mapped)
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
      await HttpRequest({
        method: "patch",
        url: `/api/payment/${payment.id}`,
        data: { paidToProvider: newPaidStatus },
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

  // ✅ Use skeleton loader while fetching
  if (loading) return <ProviderPaymentsSkeleton />

  // Filtering logic
  let filteredPayments = payments.filter(p =>
    p.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.providerName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (selectedProvider !== "all") {
    filteredPayments = filteredPayments.filter(p => p.providerId === selectedProvider)
  }

  if (tab === "pending") {
    filteredPayments = filteredPayments.filter(p => !p.paidToProvider)
  } else if (tab === "completed") {
    filteredPayments = filteredPayments.filter(p => p.paidToProvider)
  } else if (tab === "last7") {
    filteredPayments = filteredPayments.filter(p =>
      dayjs(p.createdAt).isAfter(dayjs().subtract(7, "day"))
    )
  }

  filteredPayments = filteredPayments.slice(0, visibleCount)

  return (
    <div className="space-y-4">
      {/* Search, Tabs, Provider Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <Input
          placeholder="Search payments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />

        {/* Pill-style Tabs */}
        <div className="flex space-x-2 mt-2 sm:mt-0">
          {["pending", "completed", "last7"].map((t) => {
            const label = t === "pending" ? "Pending" : t === "completed" ? "Completed" : "Last 7 Days"
            const isActive = tab === t
            return (
              <button
                key={t}
                className={`px-4 py-2 rounded-md font-medium transition-colors
                  ${isActive ? "bg-teal-700 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                onClick={() => setTab(t as typeof tab)}
              >
                {label}
              </button>
            )
          })}
        </div>

        <Select value={selectedProvider} onValueChange={val => setSelectedProvider(val)}>
          <SelectTrigger className="w-48 mt-2 sm:mt-0">
            <SelectValue placeholder="Filter by provider" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">All Providers</SelectItem>
            {providers.map(p => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Payments Grid */}
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}
      >
        {filteredPayments.map(p => (
          <Card
            key={p.id}
            className="border-primary-100 hover:border-primary/30 bg-primary-50 rounded-xl flex flex-col justify-between h-full"
          >
            {/* Header */}
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

            {/* Body */}
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

              {/* Button */}
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

      {/* Load More */}
      {visibleCount < payments.length && (
        <Button onClick={() => setVisibleCount(prev => prev + 20)} className="mt-4 w-full">
          Load More
        </Button>
      )}
    </div>
  )
}
