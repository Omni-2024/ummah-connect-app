"use client"

import { useEffect, useState } from "react"
import { getAccessToken, getRefreshToken, getUserType, isAuthenticated } from "@/lib/auth"

export const useToken = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)
  const [userType, setUserType] = useState<"user" | "provider" | "admin" | null>(null)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    const updateTokens = () => {
      setAccessToken(getAccessToken())
      setRefreshToken(getRefreshToken())
      setUserType(getUserType())
      setAuthenticated(isAuthenticated())
    }

    updateTokens()

    // Listen for storage changes (for cross-tab sync)
    const handleStorageChange = () => {
      updateTokens()
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  return {
    accessToken,
    refreshToken,
    userType,
    authenticated,
  }
}
