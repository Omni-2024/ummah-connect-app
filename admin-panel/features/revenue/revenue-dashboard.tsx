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

const PAGE_SIZE = 20;

/* -----------------------------------------
   PAYER AVATAR
------------------------------------------ */
const PayerAvatar = ({ userId }: { userId: string }) => {
  const { data: user } = useGeneralUser(userId);
  const avatarUrl = useAvatarUrl(user?.profileImage ?? null);

  if (!user) return null;

  return (
    <Avatar>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={user.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <AvatarFallback>{user.name[0].toUpperCase()}</AvatarFallback>
      )}
    </Avatar>
  );
};

/* -----------------------------------------
   MAIN COMPONENT
------------------------------------------ */
export default function ProviderPaymentsMerged() {
  const { id: userId, role } = useAuthState();

  const [payments, setPayments] = useState<Payment[]>([]);
  const [providers, setProviders] = useState<any[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  const [selectedProviderId, setSelectedProviderId] = useState("");
  const [defaultProviderSet, setDefaultProviderSet] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPayments, setTotalPayments] = useState(0);

  const [metaLoading, setMetaLoading] = useState(true);
  const [paymentsLoading, setPaymentsLoading] = useState(false);

  /* -----------------------------------------
     LOAD SERVICES + PROVIDERS
  ------------------------------------------ */
  useEffect(() => {
    if (!role) return;

    setMetaLoading(true);

    (async () => {
      try {
        const servicesRes = await getAllServicesFn({ limit: 500, offset: 0 });
        setServices(servicesRes.data ?? []);

        if (role === ADMIN_ROLES.ADMIN) {
          const providersRes = await getAllGeneralProvidersFn({
            limit: 500,
            offset: 0,
          });
          setProviders(providersRes.data ?? []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setMetaLoading(false);
      }
    })();
  }, [role]);

  /* -----------------------------------------
     FETCH PAYMENTS
  ------------------------------------------ */
  useEffect(() => {
    if (!role) return;
    if (!services.length) return;

    setPaymentsLoading(true);

    (async () => {
      try {
        const offset = (page - 1) * PAGE_SIZE;
        const res = await getPayments({ limit: PAGE_SIZE, offset });
        const allPayments = res.data ?? [];

        let allowedServiceIds: string[] = [];

        if (role === ADMIN_ROLES.BUSINESS_ADMIN) {
          allowedServiceIds = services
            .filter(s => s.providerId === userId)
            .map(s => s.id);
        } else if (role === ADMIN_ROLES.ADMIN && selectedProviderId) {
          allowedServiceIds = services
            .filter(s => s.providerId === selectedProviderId)
            .map(s => s.id);
        }

        const filtered = allPayments.filter(p =>
          allowedServiceIds.includes(p.serviceId),
        );

        setPayments(filtered);
        setTotalPayments(res.meta?.total ?? filtered.length);

        /* -----------------------------------------
           AUTO SELECT PROVIDER WITH MOST PAYMENTS
        ------------------------------------------ */
        if (
          role === ADMIN_ROLES.ADMIN &&
          !selectedProviderId &&
          !defaultProviderSet &&
          allPayments.length
        ) {
          const countMap: Record<string, number> = {};

          allPayments.forEach(p => {
            const service = services.find(s => s.id === p.serviceId);
            if (!service?.providerId) return;

            countMap[service.providerId] =
              (countMap[service.providerId] ?? 0) + 1;
          });

          const topProviderId = Object.entries(countMap).sort(
            (a, b) => b[1] - a[1],
          )[0]?.[0];

          if (topProviderId) {
            setSelectedProviderId(topProviderId);
            setPage(1);
          }

          setDefaultProviderSet(true);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setPaymentsLoading(false);
      }
    })();
  }, [
    page,
    selectedProviderId,
    services.length,
    role,
    userId,
    defaultProviderSet,
  ]);

  /* -----------------------------------------
     HELPERS
  ------------------------------------------ */
  const statusColor = (status: string) =>
    status === "succeeded"
      ? "bg-green-100 text-green-800"
      : status === "failed"
      ? "bg-red-100 text-red-800"
      : "bg-yellow-100 text-yellow-800";

  if (!role) return null;

  const isLoading = metaLoading || paymentsLoading;

  /* -----------------------------------------
     UI
  ------------------------------------------ */
  return (
    <div className="space-y-4">
      {isLoading ? (
        <ProviderPaymentsSkeleton count={3} />
      ) : (
        <>
          {/* ADMIN FILTER */}
          {role === ADMIN_ROLES.ADMIN && selectedProviderId && (
            <div className="flex justify-end">
              <div className="relative w-80">
                <button
                  className="w-full border rounded-full px-4 py-3 text-left"
                  onClick={() => setDropdownOpen(v => !v)}
                >
                  <b>Freelancer:</b>{" "}
                  {providers.find(p => p.id === selectedProviderId)?.name}
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
                      <CardTitle className="text-sm pb-4">{p.serviceName}</CardTitle>
                      <PayerName userId={p.userId} />
                    </div>
                  </div>
                  <div className="pt-3">
                  <Badge className={statusColor(p.status)}>{p.status}</Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <Row
                    label={
                      role === ADMIN_ROLES.ADMIN
                        ? "Paid to Freelancer"
                        : "Amount Paid"
                    }
                    value={`$${(p.provider_amount ?? p.amount) / 100}`}
                  />
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

          {!payments.length && (
            <div className="flex justify-center mt-16">
              <div className="p-6 text-center border rounded-2xl">
                <p className="font-semibold">No payments available</p>
              </div>
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

/* -----------------------------------------
   SMALL HELPERS
------------------------------------------ */
const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex justify-between text-sm">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-semibold">{value}</span>
  </div>
);

const PayerName = ({ userId }: { userId: string }) => {
  const { data } = useGeneralUser(userId);
  if (!data) return null;

  return (
    <p className="text-xs bg-primary-50 border rounded-full px-2 py-0.5 w-fit">
      {data.name}
    </p>
  );
};
