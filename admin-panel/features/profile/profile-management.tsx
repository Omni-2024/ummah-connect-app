"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/base/card"
import { ProfileHeader } from "./components/profile-header"
import { PersonalInfo } from "./components/personal-info"
import { SecuritySettings } from "./components/security-settings"

export function ProfileManagement() {
  const [activeTab, setActiveTab] = useState("personal")

  const tabs = [
    { id: "personal", label: "Personal Info", component: PersonalInfo },
    { id: "security", label: "Security", component: SecuritySettings },
  ]
  const userId = "some-user-id";

  const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.component || PersonalInfo

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your account settings and preferences</p>
        </div>
      </div>

      {/* Profile Header Card */}
      <ProfileHeader />

      {/* Navigation Tabs */}
      <Card className="backdrop-blur-sm border-[#337f7c]/50">
        <CardHeader className="pb-4">
          <div className="flex space-x-1 bg-muted/30 p-1 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-secondary-500 text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <ActiveComponent userId={""} />
        </CardContent>
      </Card>
    </div>
  )
}
