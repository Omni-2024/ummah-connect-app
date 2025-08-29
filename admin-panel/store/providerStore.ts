import { proxy } from "valtio"
import type { ServiceProvider, ProviderAuth, Gig } from "@/types/provider"

interface ProviderStore extends ProviderAuth {
  gigs: Gig[]
  revenue: {
    total: number
    thisMonth: number
    lastMonth: number
  }
  setProvider: (provider: ServiceProvider | null) => void
  setTokens: (accessToken: string | null, refreshToken: string | null) => void
  setGigs: (gigs: Gig[]) => void
  addGig: (gig: Gig) => void
  updateGig: (id: string, updates: Partial<Gig>) => void
  removeGig: (id: string) => void
  setRevenue: (revenue: { total: number; thisMonth: number; lastMonth: number }) => void
  logout: () => void
}

export const providerStore = proxy<ProviderStore>({
  provider: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  gigs: [],
  revenue: {
    total: 0,
    thisMonth: 0,
    lastMonth: 0,
  },

  setProvider: (provider: ServiceProvider | null) => {
    providerStore.provider = provider
    providerStore.isAuthenticated = !!provider
  },

  setTokens: (accessToken: string | null, refreshToken: string | null) => {
    providerStore.accessToken = accessToken
    providerStore.refreshToken = refreshToken
  },

  setGigs: (gigs: Gig[]) => {
    providerStore.gigs = gigs
  },

  addGig: (gig: Gig) => {
    providerStore.gigs.push(gig)
  },

  updateGig: (id: string, updates: Partial<Gig>) => {
    const index = providerStore.gigs.findIndex((g) => g.id === id)
    if (index !== -1) {
      Object.assign(providerStore.gigs[index], updates)
    }
  },

  removeGig: (id: string) => {
    const index = providerStore.gigs.findIndex((g) => g.id === id)
    if (index !== -1) {
      providerStore.gigs.splice(index, 1)
    }
  },

  setRevenue: (revenue: { total: number; thisMonth: number; lastMonth: number }) => {
    providerStore.revenue = revenue
  },

  logout: () => {
    providerStore.provider = null
    providerStore.accessToken = null
    providerStore.refreshToken = null
    providerStore.isAuthenticated = false
    providerStore.gigs = []
    providerStore.revenue = { total: 0, thisMonth: 0, lastMonth: 0 }
  },
})
