"use client"
import Link from "next/link"
import { X, Shield } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import Button from "@/components/base/button"
import { navigation } from "../../../lib/navigation"
import AdminSidebarFooter from "./AdminSidebarFooter"

export default function AdminMobileSidebar({
  sidebarOpen,
  setSidebarOpen,
}: {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}) {
  const pathname = usePathname()

  if (!sidebarOpen) return null

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => setSidebarOpen(false)}
      />
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Link href="/admin-panel/public" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-destructive flex items-center justify-center">
              <Shield className="h-4 w-4 text-destructive-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">
              Admin Panel
            </span>
          </Link>
          <Button variant="primary" size="sm" onClick={() => setSidebarOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <nav className="p-4 space-y-2 flex-1">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-destructive text-destructive-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>
        <AdminSidebarFooter />
      </div>
    </div>
  )
}
