"use client"

import { useEffect } from "react"

import { useState } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  Users,
  UserCheck,
  UserX,
  DollarSign,
  TrendingUp,
  Briefcase,
  ShoppingCart,
  MessageSquare,
  Star,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react"

// Mock data - in real app, this would come from API/state
const mockStats = {
  totalUsers: 1247,
  totalProviders: 89,
  pendingProviders: 12,
  approvedProviders: 77,
  totalRevenue: 45680,
  monthlyRevenue: 8920,
  totalOrders: 342,
  activeOrders: 23,
  totalServices: 156,
  totalReviews: 428,
  averageRating: 4.6,
  unreadMessages: 7,
}

interface Provider {
  id: string
  name: string
  email: string
  phone: string
  category: string
  description: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
}

const mockPendingProviders = [
  {
    id: "1",
    name: "Ahmad Hassan",
    email: "ahmad@example.com",
    category: "Islamic Education",
    appliedDate: "2024-01-15",
    status: "pending",
  },
  {
    id: "2",
    name: "Fatima Ali",
    email: "fatima@example.com",
    category: "Event Planning",
    appliedDate: "2024-01-14",
    status: "pending",
  },
  {
    id: "3",
    name: "Omar Khan",
    email: "omar@example.com",
    category: "Halal Food",
    appliedDate: "2024-01-13",
    status: "pending",
  },
]

const mockRecentActivity = [
  {
    id: "1",
    type: "provider_application",
    message: "New provider application from Ahmad Hassan",
    time: "2 hours ago",
    status: "pending",
  },
  {
    id: "2",
    type: "order_completed",
    message: "Order #1234 completed successfully",
    time: "4 hours ago",
    status: "success",
  },
  {
    id: "3",
    type: "review_reported",
    message: "Review reported for inappropriate content",
    time: "6 hours ago",
    status: "warning",
  },
  {
    id: "4",
    type: "provider_approved",
    message: "Provider Fatima Ali approved and activated",
    time: "1 day ago",
    status: "success",
  },
]

export default function AdminDashboard() {
  const [pendingProviders, setPendingProviders] = useState<Provider[]>([])
  const [stats, setStats] = useState(mockStats)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProviders()
  }, [])

  const fetchProviders = async () => {
    try {
      const response = await fetch("/api/admin/providers")
      if (response.ok) {
        const data = await response.json()
        const pending = data.providers.filter((p: Provider) => p.status === "pending")
        setPendingProviders(pending.slice(0, 3)) // Show only first 3

        // Update stats with real data
        setStats((prev) => ({
          ...prev,
          pendingProviders: pending.length,
          totalProviders: data.providers.length,
          approvedProviders: data.providers.filter((p: Provider) => p.status === "approved").length,
        }))
      }
    } catch (error) {
      console.error("Error fetching providers:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleProviderAction = async (providerId: string, action: "approve" | "reject") => {
    try {
      const response = await fetch(`/api/admin/providers/${providerId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })

      if (response.ok) {
        fetchProviders() // Refresh the data
        alert(`Provider ${action}d successfully! Email notification sent.`)
      } else {
        alert(`Failed to ${action} provider`)
      }
    } catch (error) {
      console.error(`Error ${action}ing provider:`, error)
      alert(`Error ${action}ing provider`)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">Platform overview and management center</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="destructive" className="flex items-center space-x-1">
            <AlertTriangle className="h-3 w-3" />
            <span>{stats.pendingProviders} Pending Reviews</span>
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Service Providers</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProviders}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-orange-600">{stats.pendingProviders} pending approval</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+${stats.monthlyRevenue}</span> this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeOrders}</div>
            <p className="text-xs text-muted-foreground">{stats.totalOrders} total orders</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Provider Applications */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  <span>Pending Provider Applications</span>
                </CardTitle>
                <CardDescription>Service providers awaiting approval</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/dashboard/providers">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="text-center py-4">Loading...</div>
            ) : pendingProviders.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">No pending applications</div>
            ) : (
              pendingProviders.map((provider) => (
                <div
                  key={provider.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg"
                >
                  <div className="space-y-1">
                    <h4 className="font-medium text-foreground">{provider.name}</h4>
                    <p className="text-sm text-muted-foreground">{provider.email}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>{provider.category}</span>
                      <span>Applied: {new Date(provider.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                      onClick={() => handleProviderAction(provider.id, "approve")}
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                      onClick={() => handleProviderAction(provider.id, "reject")}
                    >
                      <UserX className="h-3 w-3 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest platform activities and events</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/dashboard/analytics">View Analytics</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockRecentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-4 border border-border rounded-lg">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    activity.status === "success"
                      ? "bg-green-100 text-green-600"
                      : activity.status === "warning"
                        ? "bg-orange-100 text-orange-600"
                        : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {activity.status === "success" ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : activity.status === "warning" ? (
                    <AlertTriangle className="h-4 w-4" />
                  ) : (
                    <Clock className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm text-foreground">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Briefcase className="h-5 w-5" />
              <span>Services</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{stats.totalServices}</div>
            <p className="text-sm text-muted-foreground">Active service listings</p>
            <Button variant="outline" size="sm" className="mt-3 bg-transparent" asChild>
              <Link href="/admin/dashboard/services">Manage Services</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="h-5 w-5" />
              <span>Reviews</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{stats.totalReviews}</div>
            <p className="text-sm text-muted-foreground">Average rating: {stats.averageRating}/5</p>
            <Button variant="outline" size="sm" className="mt-3 bg-transparent" asChild>
              <Link href="/admin/dashboard/reviews">Moderate Reviews</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>Messages</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{stats.unreadMessages}</div>
            <p className="text-sm text-muted-foreground">Unread admin messages</p>
            <Button variant="outline" size="sm" className="mt-3 bg-transparent" asChild>
              <Link href="/admin/dashboard/messages">View Messages</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
