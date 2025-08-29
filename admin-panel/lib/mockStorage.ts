export const mockStorage = {
  // Provider storage
  getProviders: (): any[] => {
    if (typeof window === "undefined") return []
    const stored = localStorage.getItem("providers")
    return stored ? JSON.parse(stored) : []
  },

  storeProvider: (provider: any) => {
    if (typeof window === "undefined") return
    const providers = mockStorage.getProviders()
    providers.push(provider)
    localStorage.setItem("providers", JSON.stringify(providers))
  },

  updateProvider: (providerId: string, updates: any) => {
    if (typeof window === "undefined") return
    const providers = mockStorage.getProviders()
    const index = providers.findIndex((p: any) => p.id === providerId)
    if (index !== -1) {
      providers[index] = { ...providers[index], ...updates }
      localStorage.setItem("providers", JSON.stringify(providers))
    }
  },

  // Credentials storage
  getProviderCredentials: (): any[] => {
    if (typeof window === "undefined") return []
    const stored = localStorage.getItem("providerCredentials")
    return stored ? JSON.parse(stored) : []
  },

  storeProviderCredentials: (credentials: any) => {
    if (typeof window === "undefined") return
    const creds = mockStorage.getProviderCredentials()
    creds.push(credentials)
    localStorage.setItem("providerCredentials", JSON.stringify(creds))
  },

  // Check if email exists
  emailExists: (email: string): boolean => {
    const credentials = mockStorage.getProviderCredentials()
    return credentials.some((c: any) => c.email === email)
  },

  // Validate credentials
  validateCredentials: (email: string, password: string): any | null => {
    const credentials = mockStorage.getProviderCredentials()
    return credentials.find((c: any) => c.email === email && c.password === password) || null
  },

  // Get provider by ID
  getProviderById: (providerId: string): any | null => {
    const providers = mockStorage.getProviders()
    return providers.find((p: any) => p.id === providerId) || null
  },
}
