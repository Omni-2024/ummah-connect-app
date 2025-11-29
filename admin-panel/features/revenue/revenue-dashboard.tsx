"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/base/card"
import Button from "@/components/base/button"
import { getPayments, type Payment } from "@/lib/endpoints/paymentFns"
import { getAllServicesFn, type Service } from "@/lib/endpoints/serviceFns"
import { getAllGeneralProvidersFn } from "@/lib/endpoints/providersFns"
import { getAllGeneralUsersFn } from "@/lib/endpoints/usersFns"
import { Avatar, AvatarFallback } from "@/components/base/avatar"
import { Badge } from "@/components/base/badge"
import { Calendar } from "lucide-react"
import dayjs from "dayjs"
import ProviderPaymentsSkeleton from "./skeleton/ProviderCardSkeleton"
import { useAuthState } from "@/features/auth/context/useAuthState"
import { ADMIN_ROLES } from "@/lib/constants"
import {UserData} from "@/types/data";

export default function ProviderPaymentsMerged() {
  const { id: userId, role } = useAuthState()

  const [payments, setPayments] = useState<Payment[]>([])
  const [providers, setProviders] = useState<UserData[]>([])
  const [users, setUsers] = useState<UserData[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(20)
  const [selectedProviderId, setSelectedProviderId] = useState<string>("")
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    async function fetchData() {
      if (!role) return
      setLoading(true)
      try {
        const servicesRes = await getAllServicesFn({ limit: 500, offset: 0 })
        const fetchedServices = servicesRes.data ?? []
        setServices(fetchedServices)

        const paymentsRes = await getPayments({ limit: 500, offset: 0 })
        const allPayments = paymentsRes.data ?? []

        if (role === ADMIN_ROLES.BUSINESS_ADMIN && userId) {
          // Business admin: show only their services/payments
          const providerServices = fetchedServices.filter(s => s.providerId === userId)
          const providerServiceIds = providerServices.map(s => s.id)
          const providerPayments = allPayments.filter(p => providerServiceIds.includes(p.serviceId))
          setPayments(providerPayments)
        } else if (role === ADMIN_ROLES.ADMIN) {
          // Admin: show all payments
          setPayments(allPayments)

          const providersRes = await getAllGeneralProvidersFn({ limit: 100, offset: 0 })
          setProviders(providersRes.data ?? [])

          const usersRes = await getAllGeneralUsersFn({ limit: 500, offset: 0 })
          setUsers(usersRes.data ?? [])

          if ((providersRes.data ?? []).length > 0) setSelectedProviderId(providersRes.data[0].id)
        }
      } catch (err) {
        console.error("Failed to load payments", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [role, userId])

  const serviceToProviderMap = services.reduce<Record<string, string>>((acc, service) => {
    acc[service.id] = service.providerId
    return acc
  }, {})

  const filteredPayments =
    role === ADMIN_ROLES.BUSINESS_ADMIN
      ? payments
      : payments.filter(p => serviceToProviderMap[p.serviceId] === selectedProviderId)

  const getReceiveStatusColor = (status: string) => {
    switch (status) {
      case "succeeded":
        return "bg-green-100 text-green-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  if (!role) return <p>Please log in to view payments.</p>

  return (
    <div className="space-y-4">
      {loading ? (
        <ProviderPaymentsSkeleton count={3} />
      ) : (
        <>
          {/* Admin Dropdown Filter */}
          {role === ADMIN_ROLES.ADMIN && (
            <div className="mb-4 w-full flex justify-end relative">
              <div className="w-80 relative">
                

                <button
                  type="button"
                  className="w-full border border-primary-700 rounded-full px-4 py-4 bg-white text-primary-700 text-left focus:outline-none focus:ring-0 focus:ring-primary-300"
                  onClick={() => setDropdownOpen(prev => !prev)}
                >
                  <label className="mr-2 font-semibold text-primary">Filter by Provider:</label>
                  {providers.find(p => p.id === selectedProviderId)?.name || "Select Provider"}
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-1 w-full bg-white rounded-3xl shadow-lg z-10 max-h-60 overflow-auto border border-primary-700">
                    {providers.map(pr => (
                      <div
                        key={pr.id}
                        className="cursor-pointer px-4 py-3 text-primary-700 hover:bg-primary-500 hover:text-white"
                        onClick={() => {
                          setSelectedProviderId(pr.id)
                          setDropdownOpen(false)
                        }}
                      >
                        {pr.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {filteredPayments.length === 0 ? (
            <p className="text-center text-muted-foreground">No payments found.</p>
          ) : (
            <div
              className="grid gap-4"
              style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}
            >
              {filteredPayments.slice(0, visibleCount).map(p => {
                const service = services.find(s => s.id === p.serviceId)
                const provider = providers.find(pr => pr.id === service?.providerId)
                const payer = users.find(u => u.id === p.userId)

                const providerName =
                  role === ADMIN_ROLES.ADMIN ? provider?.name ?? "Unknown Provider" : ""
                const payerName = payer?.name ?? p.userId ?? "Unknown User"

                return (
                  <Card
                    key={p.paymentIntent}
                    className="border-primary-100 hover:border-primary/30 bg-white rounded-xl flex flex-col justify-between"
                  >
                    <CardHeader className="flex flex-row items-start justify-between pb-3 border-b border-primary-100">
                      <div className="flex items-start gap-3 w-full">
                        <Avatar>
                          {payer?.profileImage ? (
                            <img
                              src={payer.profileImage}
                              alt={payerName}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <AvatarFallback>{payerName[0]?.toUpperCase()}</AvatarFallback>
                          )}
                        </Avatar>

                        <div className="flex flex-col flex-1">
                          <CardTitle className="text-md font-bold text-primary leading-snug">
                            {p.serviceName}
                          </CardTitle>

                          <p className="text-sm mt-1 text-primary-700 bg-primary-50 px-2 py-1 rounded-full border w-fit">
                            {payerName}
                          </p>
                        </div>
                      </div>

                      <Badge className={getReceiveStatusColor(p.status)}>
                        {p.status === "succeeded"
                          ? "Succeeded"
                          : p.status === "failed"
                          ? "Failed"
                          : "Pending"}
                      </Badge>
                    </CardHeader>

                    <CardContent className="pt-4 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Paid to Provider</span>
                        <span className="font-semibold text-lg">
                          ${(p.provider_amount ?? p.amount_gross ?? p.amount).toFixed(2)}
                        </span>
                      </div>

                      {role === ADMIN_ROLES.ADMIN && (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Commission Fee</span>
                            <span className="font-semibold text-lg">
                              ${(p.platform_fee_amount ?? 0).toFixed(2)}
                            </span>
                          </div>

                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Gross Amount</span>
                            <span className="font-semibold text-lg">
                              ${(p.amount_gross ?? p.amount).toFixed(2)}
                            </span>
                          </div>
                        </>
                      )}

                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Paid Date</span>
                        <span className="flex items-center gap-1 font-semibold text-sm">
                          <Calendar className="w-4 h-4" />
                          {dayjs(p.updatedAt).format("MMM D, YYYY")}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {!loading && visibleCount < filteredPayments.length && (
            <Button onClick={() => setVisibleCount(v => v + 20)} className="mt-4 w-full">
              Load More
            </Button>
          )}
        </>
      )}
    </div>
  )
}
