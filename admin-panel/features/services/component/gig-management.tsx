"use client"

import { useState } from "react"
import Button from "@/components/base/button"
import { Input } from "@/components/base/input"
import { Search, Filter, Briefcase } from "lucide-react"
import { GigGrid } from "./gig-grid"
import { CreateGigWizard } from "./create-gig-wizard"

export function GigManagement() {
  const [activeTab, setActiveTab] = useState<"published" | "drafts">("published")
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateWizard, setShowCreateWizard] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-cyan-50 rounded-xl border border-orange-100">
                <Briefcase className="h-7 w-7 text-[#669f9d] to-[#337f7c]" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Gigs</h1>
                <p className="text-gray-600 mt-1">Manage freelancer services and offerings</p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-6">
            {/* Toggle Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant={activeTab === "published" ? "primary" : "secondary"}
                onClick={() => setActiveTab("published")}
                className={
                  activeTab === "published"
                    ? "bg-gradient-to-br from-[#669f9d] to-[#337f7c] text-white px-6 py-2 rounded-full"
                    : "bg-white text-gray-700 border-gray-300 px-6 py-2 rounded-full hover:bg-gray-50"
                }
              >

                Published
              </Button>
              <Button
              variant={activeTab === "drafts" ? "primary" : "secondary"}
              onClick={() => setActiveTab("drafts")}
              className={
                activeTab === "drafts"
                  ? "bg-cyan-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full"
                  : "bg-white text-gray-700 border-gray-300 px-6 py-2 rounded-full hover:bg-gray-50"
              }
>

                Drafts
              </Button>
            </div>

            {/* Search and Filter */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search here..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 bg-white border-gray-300 rounded-lg"
                />
              </div>
              <Button variant="primary" className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
                Search
              </Button>
              <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <GigGrid activeTab={activeTab} searchQuery={searchQuery} onCreateGig={() => setShowCreateWizard(true)} />
      </div>

      {/* Create Gig Wizard */}
      {showCreateWizard && <CreateGigWizard onClose={() => setShowCreateWizard(false)} />}
    </div>
  )
}
