"use client"
import { Menu, Bell, Shield } from "lucide-react"
import Button from "@/components/base/button"
import { useAuthState } from "@/features/auth/context/useAuthState"
import { useEffect, useState } from "react"
import { ChatWidgetWrapper } from "@/components/getStream/chat/ChatWidgetWrapper"
import FloatingChatWidget from "@/components/getStream/chat/ChatWidgetComponent"

export default function AdminTopbar({
  setSidebarOpen,
}: {
  setSidebarOpen: (open: boolean) => void
}) {
  const { role, isAuthenticated } = useAuthState()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => setIsClient(true), [])

  if (!isClient) return null // Don't render on server

  return (
    <div className="sticky border-b border-dark-50 top-0 z-40 flex h-20 shrink-0 items-center gap-x-4 pt-2  sm:gap-x-6 sm:px-6 lg:px-8">
      <Button
        variant="primary"
        size="sm"
        className="lg:hidden bg-transparent text-primary-900"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1" />
        <div className="flex items-center gap-x-4 lg:gap-x-6">
            <ChatWidgetWrapper/>
          <div className="h-6 w-px bg-border" />
          {isAuthenticated && (
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center">
                <Shield className="h-4 w-4 text-destructive" />
              </div>
              <span className="text-sm font-medium text-foreground">{role}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
