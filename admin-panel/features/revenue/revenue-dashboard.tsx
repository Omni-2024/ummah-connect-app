"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/base/card";
import { getPayments, type Payment } from "@/lib/endpoints/paymentFns";
import { getAllServicesFn, type Service } from "@/lib/endpoints/serviceFns";
import { getAllGeneralProvidersFn } from "@/lib/endpoints/providersFns";
import { Avatar, AvatarFallback } from "@/components/base/avatar";
import { Badge } from "@/components/base/badge";
import { Calendar } from "lucide-react";
import dayjs from "dayjs";
import ProviderPaymentsSkeleton from "./skeleton/ProviderCardSkeleton";
import { useAuthState } from "@/features/auth/context/useAuthState";
import { ADMIN_ROLES } from "@/lib/constants";
import AdvancedPagination from "@/components/widget/advancedPagination";
import { useAvatarUrl } from "@/hooks/userAvatarUrl";
import { useGeneralUser } from "@/lib/hooks/useGeneralUsers";

/* -----------------------------------------
   PAYER AVATAR
------------------------------------------ */
const PayerAvatar = ({ userId }: { userId: string }) => {
  const { data: user } = useGeneralUser(userId);
  const avatarUrl = useAvatarUrl(user?.profileImage ?? null);

  return (
    <Avatar>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={user?.name ?? "User"}
          className="object-cover w-full h-full"
        />
      ) : (
        <AvatarFallback>
          {(user?.name ?? "U")[0].toUpperCase()}
        </AvatarFallback>
      )}
    </Avatar>
  );
};

/* -----------------------------------------
   MAIN COMPONENT
------------------------------------------ */
export default function ProviderPaymentsMerged() {
  const { id: userId, role } = useAuthState();
  const PAGE_SIZE = 20;

  const [payments, setPayments] = useState<Payment[]>([]);
  const [providers, setProviders] = useState<any[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedProviderId, setSelectedProviderId] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPayments, setTotalPayments] = useState(0);

  /* -----------------------------------------
     INITIAL DATA
  ------------------------------------------ */
  useEffect(() => {
    async function init() {
      if (!role) return;

      setLoading(true);
      try {
        const servicesRes = await getAllServicesFn({ limit: 500, offset: 0 });
        setServices(servicesRes.data ?? []);

        if (role === ADMIN_ROLES.ADMIN) {
          const providersRes = await getAllGeneralProvidersFn({
            limit: 500,
            offset: 0,
          });
          setProviders(providersRes.data ?? []);

          if (providersRes.data?.length) {
            setSelectedProviderId(providersRes.data[0].id);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [role]);

  /* -----------------------------------------
     FETCH PAYMENTS
  ------------------------------------------ */
  useEffect(() => {
    async function fetchPayments() {
      if (!role) return;

      setLoading(true);
      try {
        const offset = (page - 1) * PAGE_SIZE;
        const res = await getPayments({ limit: PAGE_SIZE, offset });
        const allPayments = res.data ?? [];

        let allowedServiceIds = services.map(s => s.id);

        if (role === ADMIN_ROLES.BUSINESS_ADMIN) {
          allowedServiceIds = services
            .filter(s => s.providerId === userId)
            .map(s => s.id);
        }

        if (role === ADMIN_ROLES.ADMIN && selectedProviderId) {
          allowedServiceIds = services
            .filter(s => s.providerId === selectedProviderId)
            .map(s => s.id);
        }

        const filtered = allPayments.filter(p =>
          allowedServiceIds.includes(p.serviceId),
        );

        setPayments(filtered);
        setTotalPayments(res.meta?.total ?? filtered.length);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    fetchPayments();
  }, [page, selectedProviderId, services, role, userId]);

  /* -----------------------------------------
     HELPERS
  ------------------------------------------ */
  const statusColor = (status: string) => {
    switch (status) {
      case "succeeded":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  if (!role) return null;

  /* -----------------------------------------
     UI
  ------------------------------------------ */
  return (
    <div className="space-y-4">
      {loading ? (
        <ProviderPaymentsSkeleton count={3} />
      ) : (
        <>
          {/* ADMIN FILTER */}
          {role === ADMIN_ROLES.ADMIN && (
            <div className="flex justify-end">
              <div className="relative w-80">
                <button
                  className="w-full border rounded-full px-4 py-3 text-left"
                  onClick={() => setDropdownOpen(v => !v)}
                >
                  <b>Filter Provider:</b>{" "}
                  {providers.find(p => p.id === selectedProviderId)?.name ??
                    "Select"}
                </button>

                {dropdownOpen && (
                  <div className="absolute w-full bg-white shadow rounded-xl mt-1 z-10">
                    {providers.map(p => (
                      <div
                        key={p.id}
                        className="px-4 py-2 cursor-pointer hover:bg-primary-50"
                        onClick={() => {
                          setSelectedProviderId(p.id);
                          setPage(1);
                          setDropdownOpen(false);
                        }}
                      >
                        {p.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PAYMENTS GRID */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {payments.map(p => (
              <Card key={p.paymentIntent} className="rounded-xl">
                <CardHeader className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <PayerAvatar userId={p.userId} />

                    <div>
                      <CardTitle className="text-sm">
                        {p.serviceName}
                      </CardTitle>
                      <PayerName userId={p.userId} />
                    </div>
                  </div>

                  <Badge className={statusColor(p.status)}>
                    {p.status}
                  </Badge>
                </CardHeader>

                <CardContent className="space-y-3">
                  <Row
                    label="Paid to Provider"
                    value={`$${(p.provider_amount ?? p.amount) / 100}`}
                  />

                  {role === ADMIN_ROLES.ADMIN && (
                    <>
                      <Row
                        label="Commission"
                        value={`$${(p.platform_fee_amount ?? 0) / 100}`}
                      />
                      <Row
                        label="Gross"
                        value={`$${(p.amount_gross ?? p.amount) / 100}`}
                      />
                    </>
                  )}

                  <Row
                    label="Paid Date"
                    value={
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {dayjs(p.updatedAt).format("MMM D, YYYY")}
                      </span>
                    }
                  />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* EMPTY STATE (END ONLY) */}
          {!loading && payments.length === 0 && (
            <div className="flex justify-center mt-16">
              <div className="p-6 w-full max-w-md text-center border rounded-2xl bg-gradient-to-r from-slate-50 to-white">
                <p className="text-primary text-lg font-semibold">
                  No payments available
                </p>
                <p className="text-primary-600 text-sm mt-1">
                  There are no payments to display at this time.
                </p>
              </div>
            </div>
          )}

          {/* PAGINATION */}
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

/* -----------------------------------------
   SMALL HELPERS
------------------------------------------ */
const Row = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex justify-between text-sm">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-semibold">{value}</span>
  </div>
);

const PayerName = ({ userId }: { userId: string }) => {
  const { data } = useGeneralUser(userId);
  return (
    <p className="text-xs bg-primary-50 border rounded-full px-2 py-0.5 w-fit">
      {data?.name ?? "Unknown User"}
    </p>
  );
};
