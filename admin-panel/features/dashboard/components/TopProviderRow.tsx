"use client"

import { Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useGeneralUser } from "@/lib/hooks/useGeneralUsers"

function fmtNumber(n?: number) {
  if (n == null) return "—"
  return n.toLocaleString()
}
function fmtCurrency(n?: number) {
  if (n == null) return "—"
  return `$${n.toLocaleString()}`
}

export function TopProviderRow({ item, index }: { item: any; index: number }) {
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
              provider?.name ?? provider?.email ?? `Provider ${item.providerId.slice(0, 8)}`
            )}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            {isLoading ? (
              <div className="h-3 w-32 bg-muted animate-pulse rounded" />
            ) : (
              provider?.email ?? `ID: ${item.providerId.slice(0, 12)}...`
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
