import { useSnapshot } from "valtio"
import { userStore } from "@/store/userStore"
import { providerStore } from "@/store/providerStore"
import { authAPI } from "@/lib/api"
import { setAuthTokens, clearAuthTokens, validateAdminCredentials } from "@/lib/auth"

export const useUserAuth = () => {
  const snap = useSnapshot(userStore)

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.userLogin(email, password)
      const { user, accessToken, refreshToken } = response.data

      userStore.setUser(user)
      userStore.setTokens(accessToken, refreshToken)
      setAuthTokens(accessToken, refreshToken, "user")

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || "Login failed" }
    }
  }

  const register = async (data: {
    name: string
    email: string
    password: string
    phone?: string
  }) => {
    try {
      const response = await authAPI.userRegister(data)
      const { user, accessToken, refreshToken } = response.data

      userStore.setUser(user)
      userStore.setTokens(accessToken, refreshToken)
      setAuthTokens(accessToken, refreshToken, "user")

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || "Registration failed" }
    }
  }

  const logout = () => {
    userStore.logout()
    clearAuthTokens()
  }

  return {
    ...snap,
    login,
    register,
    logout,
  }
}

export const useProviderAuth = () => {
  const snap = useSnapshot(providerStore)

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.providerLogin(email, password)
      const { provider, accessToken, refreshToken } = response.data

      providerStore.setProvider(provider)
      providerStore.setTokens(accessToken, refreshToken)
      setAuthTokens(accessToken, refreshToken, "provider")

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || "Login failed" }
    }
  }

  const register = async (data: {
    name: string
    email: string
    password: string
    phone?: string
    category: string
  }) => {
    try {
      const response = await authAPI.providerRegister(data)
      const { provider, accessToken, refreshToken } = response.data

      providerStore.setProvider(provider)
      providerStore.setTokens(accessToken, refreshToken)
      setAuthTokens(accessToken, refreshToken, "provider")

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || "Registration failed" }
    }
  }

  const logout = () => {
    providerStore.logout()
    clearAuthTokens()
  }

  return {
    ...snap,
    login,
    register,
    logout,
  }
}

export const useAdminAuth = () => {
  const adminLogin = async (username: string, password: string) => {
    try {
      // For now, use hardcoded credentials
      if (validateAdminCredentials(username, password)) {
        // Mock admin user data
        const adminData = {
          id: "admin-1",
          username: "admin1",
          name: "Admin User",
          role: "admin",
        }

        // Mock tokens
        const accessToken = "mock-admin-access-token"
        const refreshToken = "mock-admin-refresh-token"

        setAuthTokens(accessToken, refreshToken, "admin")

        return { success: true, admin: adminData }
      } else {
        return { success: false, error: "Invalid credentials" }
      }
    } catch (error: any) {
      return { success: false, error: "Login failed" }
    }
  }

  const logout = () => {
    clearAuthTokens()
  }

  return {
    login: adminLogin,
    logout,
  }
}
