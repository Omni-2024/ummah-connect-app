export interface ServiceProvider {
  id: string
  email: string
  name: string
  phone?: string
  location?: string
  category: string
  description?: string
  isApproved: boolean
  rating?: number
  totalReviews?: number
  createdAt: string
  updatedAt: string
}

export interface ProviderAuth {
  provider: ServiceProvider | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
}

export interface Gig {
  id: string
  providerId: string
  title: string
  description: string
  category: string
  price: number
  duration?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}
