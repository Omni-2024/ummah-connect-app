import { proxy } from "valtio"
import type { User, UserAuth } from "@/types/user"

interface UserStore extends UserAuth {
  setUser: (user: User | null) => void
  setTokens: (accessToken: string | null, refreshToken: string | null) => void
  logout: () => void
}

export const userStore = proxy<UserStore>({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,

  setUser: (user: User | null) => {
    userStore.user = user
    userStore.isAuthenticated = !!user
  },

  setTokens: (accessToken: string | null, refreshToken: string | null) => {
    userStore.accessToken = accessToken
    userStore.refreshToken = refreshToken
  },

  logout: () => {
    userStore.user = null
    userStore.accessToken = null
    userStore.refreshToken = null
    userStore.isAuthenticated = false
  },
})
