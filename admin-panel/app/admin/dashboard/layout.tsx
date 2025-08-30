"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  Tags,
  DollarSign,
  Briefcase,
  ShoppingCart,
  MessageSquare,
  BarChart3,
  Star,
  User,
  LogOut,
  Menu,
  X,
  Bell,
  Shield,
} from "lucide-react"
import { useSnapshot } from "valtio"
import { authState } from "@/features/auth/context/AuthState"
import { useAuthState } from "@/features/auth/context/useAuthState"
import { log } from "console"

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Providers", href: "/admin/dashboard/providers", icon: Users },
  { name: "Categories", href: "/admin/dashboard/categories", icon: Tags },
  { name: "Services", href: "/admin/dashboard/services", icon: Briefcase },
  { name: "Orders", href: "/admin/dashboard/orders", icon: ShoppingCart },
  { name: "Messages", href: "/admin/dashboard/messages", icon: MessageSquare },
  { name: "Revenue", href: "/admin/dashboard/revenue", icon: DollarSign },
  { name: "Analytics", href: "/admin/dashboard/analytics", icon: BarChart3 },
  { name: "Reviews", href: "/admin/dashboard/reviews", icon: Star },
  { name: "Profile", href: "/admin/dashboard/profile", icon: User },
]

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const {role,isAuthenticated,id,accessToken,refreshToken} = useAuthState();

  const handleLogout = () => {
    router.push("/admin/login")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <Link href="/" className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-destructive flex items-center justify-center">
                  <Shield className="h-4 w-4 text-destructive-foreground" />
                </div>
                <span className="text-lg font-bold text-foreground">Admin Panel</span>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <nav className="p-4 space-y-2">
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
                        : "text-muted-foreground hover:text-foreground hover:bg-accent",
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>
            <div className="absolute bottom-4 left-4 right-4">
              <Button variant="outline" onClick={handleLogout} className="w-full bg-transparent">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <Card className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-border rounded-none">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-destructive flex items-center justify-center">
                <Shield className="h-4 w-4 text-destructive-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">Admin Panel</span>
            </Link>
          </div>
          <nav className="flex flex-1 flex-col px-6">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const Icon = item.icon
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={cn(
                            "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors",
                            pathname === item.href
                              ? "bg-destructive text-destructive-foreground"
                              : "text-muted-foreground hover:text-foreground hover:bg-accent",
                          )}
                        >
                          <Icon className="h-5 w-5 shrink-0" />
                          {item.name}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </li>
              <li className="mt-auto">
                <Button variant="outline" onClick={handleLogout} className="w-full bg-transparent">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </li>
            </ul>
          </nav>
        </Card>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1" />
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <Button variant="ghost" size="sm">
                <Bell className="h-5 w-5" />
              </Button>
              <div className="h-6 w-px bg-border" />
              {isAuthenticated && 
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center">
                  <Shield className="h-4 w-4 text-destructive" />
                </div>
                <span className="text-sm font-medium text-foreground">{role}</span>
              </div>
              }
              
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-8">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
