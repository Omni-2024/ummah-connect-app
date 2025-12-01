"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/base/card";
import { getPayments, type Payment } from "@/lib/endpoints/paymentFns";
import { getAllServicesFn, type Service } from "@/lib/endpoints/serviceFns";
import { getAllGeneralProvidersFn } from "@/lib/endpoints/providersFns";
import { getAllGeneralUsersFn } from "@/lib/endpoints/usersFns";
import { Avatar, AvatarFallback } from "@/components/base/avatar";
import { Badge } from "@/components/base/badge";
import { Calendar } from "lucide-react";
import dayjs from "dayjs";
import ProviderPaymentsSkeleton from "./skeleton/ProviderCardSkeleton";
import { useAuthState } from "@/features/auth/context/useAuthState";
import { ADMIN_ROLES } from "@/lib/constants";
import { UserData } from "@/types/data";
import AdvancedPagination from "@/components/widget/advancedPagination";
import { useAvatarUrl } from "@/hooks/userAvatarUrl";

export default function ProviderPaymentsMerged() {
  const { id: userId, role } = useAuthState();
  const PAGE_SIZE = 20;

  const [payments, setPayments] = useState<Payment[]>([]);
  const [providers, setProviders] = useState<UserData[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProviderId, setSelectedProviderId] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPayments, setTotalPayments] = useState(0);

  // Helper component for Avatar
  const AvatarWithHook = ({ user }: { user?: UserData }) => {
    const name = user?.name ?? "Unknown";
    const avatarUrl = useAvatarUrl(user?.profileImage ?? null);

    return (
      <Avatar>
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className="object-cover w-full h-full" />
        ) : (
          <AvatarFallback>{name[0].toUpperCase()}</AvatarFallback>
        )}
      </Avatar>
    );
  };

useEffect(() => {
  async function fetchData() {
    if (!role) return;
    try {
      const servicesRes = await getAllServicesFn({ limit: 500, offset: 0 });
      const servicesList = servicesRes.data ?? [];
      setServices(servicesList);

      if (role === ADMIN_ROLES.ADMIN) {
        const providersRes = await getAllGeneralProvidersFn({ limit: 500, offset: 0 });
        const providersList = providersRes.data ?? [];
        setProviders(providersList);

        const usersRes = await getAllGeneralUsersFn({ limit: 500, offset: 0 });
        setUsers(usersRes.data ?? []);

        // 👉 Fetch payments only once (for provider chooser)
        const paymentsRes = await getPayments({ limit: 500, offset: 0 });
        const allPayments = paymentsRes.data ?? [];

        // Map provider -> services owned
        const providersWithPayments = providersList.filter((p) => {
          // Get provider services
          const providerServiceIds = servicesList
            .filter((s) => s.providerId === p.id)
            .map((s) => s.id);

          if (providerServiceIds.length === 0) return false;

          // Check payments
          return allPayments.some((pay) => providerServiceIds.includes(pay.serviceId));
        });

        // Default: first provider who has payments
        if (providersWithPayments.length > 0) {
          setSelectedProviderId(providersWithPayments[0].id);
        }
      }
        setLoading(true);

    } catch (err) {
      console.error("Failed to load initial data", err);
    } finally {
      setLoading(false);
    }
  }

  fetchData();
}, [role, userId]);


  useEffect(() => {
    async function fetchPayments() {
      if (!role) return;
      setLoading(true);

      try {
        const allServices = services.filter(s =>
          role === ADMIN_ROLES.BUSINESS_ADMIN ? s.providerId === userId : true
        );

        let serviceIds = allServices.map(s => s.id);

        if (role === ADMIN_ROLES.ADMIN && selectedProviderId) {
          serviceIds = allServices.filter(s => s.providerId === selectedProviderId).map(s => s.id);
        }

        const offset = (page - 1) * PAGE_SIZE;
        const paymentsRes = await getPayments({ limit: PAGE_SIZE, offset });
        const allPayments = paymentsRes.data ?? [];
        const filteredPayments = allPayments.filter(p => serviceIds.includes(p.serviceId));

        setPayments(filteredPayments);
        setTotalPayments(paymentsRes.meta?.total ?? filteredPayments.length);
      } catch (err) {
        console.error("Failed to load payments", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPayments();
  }, [page, selectedProviderId, services, role, userId]);

  const getReceiveStatusColor = (status: string) => {
    switch (status) {
      case "succeeded":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  if (!role) return <p>Please log in to view payments.</p>;

  return (
    <div className="space-y-4">
      {loading ? (
        <ProviderPaymentsSkeleton count={3} />
      ) : (
        <>
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
                          setSelectedProviderId(pr.id);
                          setPage(1);
                          setDropdownOpen(false);
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

          {payments.length === 0 ? (
            <div className="flex justify-center mt-16">
              <div className="p-6 w-full max-w-md text-center hover:shadow-sm transition-all duration-200 border border-border/50 hover:border-primary/30 bg-gradient-to-r from-slate-50 to-white rounded-2xl">
                <p className="text-primary text-lg font-semibold">No payments available</p>
                <p className="text-primary-600 text-sm mt-1">There are no payments to display at this time.</p>
              </div>
            </div>
          ) : (
            <div
              className="grid gap-4"
              style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}
            >
              {payments.map(p => {
                const service = services.find(s => s.id === p.serviceId);
                const provider = providers.find(pr => pr.id === service?.providerId);
                const payer = users.find(u => u.id === p.userId);

                const providerName =
                  role === ADMIN_ROLES.ADMIN ? provider?.name ?? "Unknown Provider" : "";
                const payerName = payer?.name ?? p.userId ?? "Unknown User";

                return (
                  <Card
                    key={p.paymentIntent}
                    className="border-primary-100 hover:border-primary/30 bg-white rounded-xl flex flex-col justify-between"
                  >
                    <CardHeader className="flex flex-row items-start justify-between pb-3 border-b border-primary-100">
                      <div className="flex items-start gap-3 w-full">
                        <AvatarWithHook user={payer} />

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
                          ${Number((p.provider_amount ?? p.amount_gross ?? p.amount).toFixed(2)) /100}
                        </span>
                      </div>

                      {role === ADMIN_ROLES.ADMIN && (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Commission Fee</span>
                            <span className="font-semibold text-lg">
                              ${Number((p.platform_fee_amount ?? 0).toFixed(2))/100}
                            </span>
                          </div>

                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Gross Amount</span>
                            <span className="font-semibold text-lg">
                              ${Number((p.amount_gross ?? p.amount).toFixed(2))/100}
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
                );
              })}
            </div>
          )}

          {totalPayments > PAGE_SIZE && (
            <AdvancedPagination
              currentPage={page}
              totalPages={Math.ceil(totalPayments / PAGE_SIZE)}
              onChange={setPage}
            />
          )}
        </>
      )}
    </div>
  );
}
