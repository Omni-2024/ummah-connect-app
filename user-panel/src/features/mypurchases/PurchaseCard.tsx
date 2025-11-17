import React from "react"
import { CalendarIcon } from "@radix-ui/react-icons"
import { Card } from "@/components/base/Card"
import Button from "@/components/base/Button"
import Badge from "@/components/base/Badge"
import { ReviewSection } from "./ReviewSection"

interface Purchase {
  paymentIntent: string
  status: string
  amount: number
  serviceName: string
  serviceId: string
  createdAt: string
  last4?: string
  paymentMethod?: string
  receiptUrl?: string
}

interface PurchaseCardProps {
  purchase: Purchase
  onViewService: (serviceName: string) => void
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function getStatusBadge(status: string) {
  switch (status) {
    case "succeeded":
      return <Badge className="bg-green-100 text-green-800 text-xs">Completed</Badge>
    case "pending":
      return <Badge className="bg-yellow-100 text-yellow-800 text-xs">Pending</Badge>
    case "failed":
      return <Badge className="bg-red-100 text-red-800 text-xs">Failed</Badge>
    default:
      return null
  }
}

export const PurchaseCard: React.FC<PurchaseCardProps> = ({ purchase, onViewService }) => {
  return (
    <Card className="bg-white border-2 border-gray-200 rounded-2xl shadow-lg hover:shadow-xl hover:border-primary-300 transition-all duration-300 overflow-hidden group">
      {/* Status Badge */}
      <div className="relative px-6 pt-5 pb-2">
        <div className="flex items-center justify-between">
          {getStatusBadge(purchase.status)}
          <div className="text-xl font-bold text-gray-900">
            ${(purchase.amount / 100).toFixed(2)}
          </div>
        </div>
      </div>

      {/* Service Info */}
      <div className="px-6 pb-6">
        <div className="mb-4">
          <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {purchase.serviceName}
          </h3>
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <CalendarIcon className="size-4" />
            <span>{formatDate(purchase.createdAt)}</span>
          </div>
        </div>

        {/* Payment Method Info */}
        {purchase.last4 && (
          <div className="mb-4 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-xs font-medium text-gray-700">
              {purchase.paymentMethod} •••• {purchase.last4}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={() => onViewService(purchase.serviceName)}
            variant="primary"
            className="flex-1"
            size="sm"
          >
            View Service
          </Button>
          {purchase.receiptUrl && (
            <Button
              onClick={() => window.open(purchase.receiptUrl, '_blank')}
              variant="primary"
              size="sm"
            >
              Receipt
            </Button>
          )}
        </div>

        {/* Review Section */}
        <ReviewSection 
          serviceId={purchase.serviceId}
          status={purchase.status}
        />
      </div>
    </Card>
  )
}