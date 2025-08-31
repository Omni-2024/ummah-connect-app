"use client"

import { useSnapshot } from "valtio"
import { authState, login, logout, setIsFirstLogin, setOnboardingCompleted } from "./AuthState"

export const useAuthState = () => {
  const snap = useSnapshot(authState)
  return {
    isAuthenticated: snap.isAuthenticated,
    accessToken: snap.accessToken,
    refreshToken: snap.refreshToken,
    role: snap.role,
    id: snap.id,
    isFirstLogin: snap.isFirstLogin,
    onboardingCompleted: snap.onboardingCompleted,
    login: login,
    logout: logout,
    setIsFirstLogin: setIsFirstLogin,
    setOnboardingCompleted: setOnboardingCompleted,
  }
}

// The AuthProvider is no longer needed with Valtio's reactive state management
