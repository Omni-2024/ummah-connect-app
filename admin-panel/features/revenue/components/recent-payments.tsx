"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/base/card"
import type { Payment } from "@/lib/endpoints/paymentFns"

interface RecentPaymentsProps {
  payments: Payment[]
}

export default function RecentPayments({ payments }: RecentPaymentsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Payments</CardTitle>
      </CardHeader>
      <CardContent>
        {payments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent payments found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="p-2">Service</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2">Method</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.paymentIntent} className="border-b last:border-0">
                    <td className="p-2">{p.serviceName ?? "N/A"}</td>
                    <td className="p-2">${(p.amount / 100).toFixed(2)}</td>
                    <td className="p-2">{p.paymentMethod}</td>
                    <td className="p-2 capitalize">{p.status}</td>
                    <td className="p-2">{new Date(p.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
