"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Button from "@/components/ui/button"
import { Plus, Edit, Trash2, Eye } from "lucide-react"
import { useServices } from "@/hooks/useServices"

interface GigGridProps {
  activeTab: "published" | "drafts"
  searchQuery: string
  onCreateGig: () => void
}

export function GigGrid({ activeTab, searchQuery, onCreateGig }: GigGridProps) {
  const {
    data: servicesData,
    isLoading,
    error,
  } = useServices({
    status: activeTab === "published" ? "published" : "draft",
    search: searchQuery,
    page: 1,
    limit: 20,
  })

  const services = servicesData?.services || []

  const handleDeleteGig = (gigId: string) => {
    if (confirm("Are you sure you want to delete this gig?")) {
      // TODO: Implement delete service function
      console.log("Delete service:", gigId)
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="bg-white border border-gray-200">
            <CardContent className="p-0">
              <div className="w-full h-48 bg-gray-200 animate-pulse rounded-t-lg" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 animate-pulse rounded" />
                <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4" />
                <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading services. Please try again.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {/* Add New Gig Card */}
      <Card
        className="border-2 border-dashed border-gray-300 hover:border-[#669f9d] cursor-pointer transition-colors bg-white"
        onClick={onCreateGig}
      >
        <CardContent className="flex flex-col items-center justify-center h-80 text-center">
          <div className="w-16 h-16 bg-cyan-50 rounded-full flex items-center justify-center mb-4">
            <Plus className="h-8 w-8 text-[#669f9d] to-[#337f7c]" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Add new gig</h3>
          <p className="text-gray-500 text-sm">Create a new service offering</p>
        </CardContent>
      </Card>

      {/* Service Cards */}
      {services.map((service) => (
        <Card key={service.id} className="bg-white border border-gray-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-0">
            {/* Service Image */}
            <div className="relative">
              <img
                src={`/abstract-geometric-shapes.png?height=192&width=300&query=${encodeURIComponent(service.title)}`}
                alt={service.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="absolute top-3 right-3 flex gap-2">
                <Button size="icon" variant="secondary" className="h-8 w-8 bg-white/90 hover:bg-white">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="secondary" className="h-8 w-8 bg-white/90 hover:bg-white">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8 bg-white/90 hover:bg-white text-red-600"
                  onClick={() => handleDeleteGig(service.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              {/* Provider Avatar */}
              <div className="absolute bottom-3 left-3">
                <img
                  src={`/abstract-geometric-shapes.png?height=40&width=40&query=${encodeURIComponent(service.providerName + " avatar")}`}
                  alt={service.providerName}
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
              </div>
            </div>

            {/* Service Details */}
            <div className="p-4">
              <Badge variant="secondary" className="text-xs mb-2 bg-gray-100 text-gray-700">
                {service.specialtyName}
              </Badge>
              <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{service.title}</h3>
              <p className="text-gray-600 text-sm mb-2">{service.providerName}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Duration: {service.duration || "N/A"}</span>
                <span className="font-medium text-gray-900">
                  {service.price ? `$${service.price}` : "Contact for price"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
