import React from "react"

interface Purchase {
  status: string
  amount: number
}

interface PurchaseStatsProps {
  purchases: Purchase[]
}

export const PurchaseStats: React.FC<PurchaseStatsProps> = ({ purchases }) => {
  const totalServices = purchases.length
  const completedServices = purchases.filter((p) => p.status === "succeeded").length
  const totalSpent = (purchases.reduce((sum, p) => sum + p.amount, 0) / 100).toFixed(2)

  if (purchases.length === 0) {
    return null
  }

  return (
    <div className="mt-12 grid grid-cols-3 gap-4">
      <div className="text-center p-4 bg-gray-50 rounded-xl">
        <div className="text-2xl font-bold text-gray-900">{totalServices}</div>
        <div className="text-sm text-gray-600">Total Services</div>
      </div>
      <div className="text-center p-4 bg-gray-50 rounded-xl">
        <div className="text-2xl font-bold text-green-600">{completedServices}</div>
        <div className="text-sm text-gray-600">Completed</div>
      </div>
      <div className="text-center p-4 bg-gray-50 rounded-xl">
        <div className="text-2xl font-bold text-gray-900">${totalSpent}</div>
        <div className="text-sm text-gray-600">Total Spent</div>
      </div>
    </div>
  )
}