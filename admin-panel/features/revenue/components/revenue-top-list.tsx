"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/base/card"

interface Item {
  name: string | null
  orders: number
  revenue: number
}

interface TopListProps {
  title: string
  items: Item[]
}

export default function TopList({ title, items }: TopListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No data available</p>
        ) : (
          <ul className="space-y-2">
            {items.map((item, idx) => (
              <li key={idx} className="flex justify-between text-sm">
                <span>{item.name ?? "Unknown"}</span>
                <span className="text-muted-foreground">
                  {item.orders} orders • ${item.revenue.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
