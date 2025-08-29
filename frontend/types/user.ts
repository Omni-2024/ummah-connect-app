export interface User {
  id: string
  email: string
  name: string
  phone?: string
  location?: string
  createdAt: string
  updatedAt: string
}

export interface UserAuth {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
}
