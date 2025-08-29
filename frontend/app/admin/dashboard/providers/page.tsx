"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Clock, Mail, Phone, User } from "lucide-react"

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

export default function AdminProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProviders()
  }, [])

  const fetchProviders = async () => {
    try {
      const response = await fetch("/api/admin/providers")
      if (response.ok) {
        const data = await response.json()
        setProviders(data.providers)
      } else {
        console.error("Failed to fetch providers")
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
        fetchProviders() // Refresh the list
        alert(`Provider ${action}d successfully! Email notification sent.`)
      } else {
        alert(`Failed to ${action} provider`)
      }
    } catch (error) {
      console.error(`Error ${action}ing provider:`, error)
      alert(`Error ${action}ing provider`)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const pendingCount = providers.filter((p) => p.status === "pending").length
  const approvedCount = providers.filter((p) => p.status === "approved").length
  const rejectedCount = providers.filter((p) => p.status === "rejected").length

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Service Providers</h1>
        <p className="text-muted-foreground mt-2">Manage and approve service provider applications</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Approved Providers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rejected Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{rejectedCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Provider Applications */}
      <div className="space-y-4">
        {providers.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No provider applications yet.</p>
            </CardContent>
          </Card>
        ) : (
          providers.map((provider) => (
            <Card key={provider.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      {provider.name}
                    </CardTitle>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {provider.email}
                      </div>
                      {provider.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {provider.phone}
                        </div>
                      )}
                    </div>
                  </div>
                  {getStatusBadge(provider.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium">Category:</span> {provider.category}
                  </div>
                  {provider.description && (
                    <div>
                      <span className="font-medium">Description:</span> {provider.description}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Applied:</span> {new Date(provider.createdAt).toLocaleDateString()}
                  </div>

                  {provider.status === "pending" && (
                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => handleProviderAction(provider.id, "approve")}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button onClick={() => handleProviderAction(provider.id, "reject")} variant="destructive">
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
