import apiClient from "./axios"
import type { User } from "@/types/user"
import type { ServiceProvider } from "@/types/provider"
import { mockStorage } from "./mockStorage"

// Auth endpoints
export const authAPI = {
  // Service Provider Auth
  providerLogin: async (email: string, password: string) => {
    try {
      const credential = mockStorage.validateCredentials(email, password)
      if (!credential) {
        throw new Error("Invalid email or password")
      }

      const provider = mockStorage.getProviderById(credential.providerId)
      if (!provider) {
        throw new Error("Provider not found")
      }

      const accessToken = `access_${provider.id}_${Date.now()}`
      const refreshToken = `refresh_${provider.id}_${Date.now()}`

      return {
        data: {
          provider,
          accessToken,
          refreshToken,
          message: "Login successful",
        },
      }
    } catch (error: any) {
      throw {
        response: {
          data: {
            message: error.message || "Login failed",
          },
        },
      }
    }
  },

  providerRegister: async (data: {
    name: string
    email: string
    password: string
    phone?: string
    category: string
  }) => {
    try {
      const { name, email, password, phone, category } = data

      if (!name || !email || !password || !category) {
        throw new Error("Missing required fields")
      }

      if (mockStorage.emailExists(email)) {
        throw new Error("Email already registered")
      }

      const newProvider = {
        id: `provider_${Date.now()}`,
        email,
        name,
        phone: phone || "",
        category,
        description: "",
        isApproved: false,
        rating: 0,
        totalReviews: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      mockStorage.storeProvider(newProvider)
      mockStorage.storeProviderCredentials({
        email,
        password,
        providerId: newProvider.id,
      })

      const accessToken = `access_${newProvider.id}_${Date.now()}`
      const refreshToken = `refresh_${newProvider.id}_${Date.now()}`

      return {
        data: {
          provider: newProvider,
          accessToken,
          refreshToken,
          message: "Registration successful! Your account is pending admin approval.",
        },
      }
    } catch (error: any) {
      throw {
        response: {
          data: {
            message: error.message || "Registration failed",
          },
        },
      }
    }
  },

  // Admin Auth
  adminLogin: (username: string, password: string) => apiClient.post("/auth/admin/login", { username, password }),

  // User Auth (placeholder)
  userLogin: (email: string, password: string) => apiClient.post("/auth/user/login", { email, password }),

  userRegister: (data: {
    name: string
    email: string
    password: string
    phone?: string
  }) => apiClient.post("/auth/user/register", data),

  // Token refresh
  refreshToken: (refreshToken: string) => apiClient.post("/auth/refresh", { refreshToken }),

  // Logout
  logout: () => apiClient.post("/auth/logout"),
}

// User endpoints
export const userAPI = {
  getProfile: () => apiClient.get("/user/profile"),
  updateProfile: (data: Partial<User>) => apiClient.put("/user/profile", data),
  getServices: () => apiClient.get("/user/services"),
  getOrders: () => apiClient.get("/user/orders"),
}

// Provider endpoints
export const providerAPI = {
  getProfile: () => apiClient.get("/provider/profile"),
  updateProfile: (data: Partial<ServiceProvider>) => apiClient.put("/provider/profile", data),
  getGigs: () => apiClient.get("/provider/gigs"),
  createGig: (data: any) => apiClient.post("/provider/gigs", data),
  updateGig: (id: string, data: any) => apiClient.put(`/provider/gigs/${id}`, data),
  deleteGig: (id: string) => apiClient.delete(`/provider/gigs/${id}`),
  getRevenue: () => apiClient.get("/provider/revenue"),
}

// Admin endpoints
export const adminAPI = {
  getDashboard: () => apiClient.get("/admin/dashboard"),
  getProviders: () => apiClient.get("/admin/providers"),
  approveProvider: (id: string) => apiClient.put(`/admin/providers/${id}/approve`),
  rejectProvider: (id: string) => apiClient.put(`/admin/providers/${id}/reject`),
  getCategories: () => apiClient.get("/admin/categories"),
  createCategory: (data: any) => apiClient.post("/admin/categories", data),
  updateCategory: (id: string, data: any) => apiClient.put(`/admin/categories/${id}`, data),
  deleteCategory: (id: string) => apiClient.delete(`/admin/categories/${id}`),
  getAnalytics: () => apiClient.get("/admin/analytics"),
}
