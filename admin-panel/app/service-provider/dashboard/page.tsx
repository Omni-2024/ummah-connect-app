"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/base/card"
import { Button } from "@/components/base/button"
import { Badge } from "@/components/base/badge"
import Link from "next/link"
import { Plus, TrendingUp, Users, Star, DollarSign, Eye, MessageSquare, Briefcase, User } from "lucide-react"

// Mock data - in real app, this would come from API/state
const mockStats = {
  totalGigs: 5,
  activeGigs: 3,
  totalEarnings: 2450,
  thisMonthEarnings: 680,
  totalViews: 1240,
  totalMessages: 18,
  averageRating: 4.8,
  totalReviews: 23,
}

const mockRecentGigs = [
  {
    id: "1",
    title: "Quran Tutoring for Children",
    category: "Islamic Education",
    status: "active",
    price: 50,
    views: 45,
    messages: 3,
  },
  {
    id: "2",
    title: "Wedding Event Planning",
    category: "Event Planning",
    status: "active",
    price: 800,
    views: 23,
    messages: 1,
  },
  {
    id: "3",
    title: "Halal Catering Services",
    category: "Halal Food",
    status: "paused",
    price: 300,
    views: 12,
    messages: 0,
  },
]

const mockRecentMessages = [
  {
    id: "1",
    from: "Ahmad Hassan",
    message: "Hi, I'm interested in your Quran tutoring service...",
    time: "2 hours ago",
    unread: true,
  },
  {
    id: "2",
    from: "Fatima Ali",
    message: "Can you provide catering for 50 people?",
    time: "5 hours ago",
    unread: true,
  },
  {
    id: "3",
    from: "Omar Khan",
    message: "Thank you for the excellent service!",
    time: "1 day ago",
    unread: false,
  },
]

export default function ServiceProviderDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome back! Here's an overview of your services.</p>
        </div>
        <Button asChild>
          <Link href="/service-provider/dashboard/gigs/create">
            <Plus className="h-4 w-4 mr-2" />
            Create New Gig
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Gigs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalGigs}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">{mockStats.activeGigs} active</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${mockStats.totalEarnings}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+${mockStats.thisMonthEarnings}</span> this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalViews}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.averageRating}</div>
            <p className="text-xs text-muted-foreground">{mockStats.totalReviews} reviews</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Gigs */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Gigs</CardTitle>
                <CardDescription>Your latest service offerings</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/service-provider/dashboard/gigs">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockRecentGigs.map((gig) => (
              <div key={gig.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="space-y-1">
                  <h4 className="font-medium text-foreground">{gig.title}</h4>
                  <p className="text-sm text-muted-foreground">{gig.category}</p>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span className="flex items-center">
                      <Eye className="h-3 w-3 mr-1" />
                      {gig.views} views
                    </span>
                    <span className="flex items-center">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      {gig.messages} messages
                    </span>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <div className="font-semibold text-foreground">${gig.price}</div>
                  <Badge variant={gig.status === "active" ? "default" : "secondary"}>
                    {gig.status === "active" ? "Active" : "Paused"}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Messages */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Messages</CardTitle>
                <CardDescription>Latest inquiries from clients</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/service-provider/dashboard/messages">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockRecentMessages.map((message) => (
              <div key={message.id} className="flex items-start space-x-3 p-4 border border-border rounded-lg">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-foreground">{message.from}</h4>
                    <span className="text-xs text-muted-foreground">{message.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{message.message}</p>
                  {message.unread && (
                    <Badge variant="secondary" className="text-xs">
                      New
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to manage your services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent" asChild>
              <Link href="/service-provider/dashboard/gigs/create">
                <Plus className="h-6 w-6" />
                <span>Create New Gig</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent" asChild>
              <Link href="/service-provider/dashboard/profile">
                <User className="h-6 w-6" />
                <span>Update Profile</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent" asChild>
              <Link href="/service-provider/dashboard/revenue">
                <TrendingUp className="h-6 w-6" />
                <span>View Analytics</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
