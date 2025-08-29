export interface Service {
  id: string
  providerId: string
  title: string
  description: string
  category: string
  price: number
  duration?: string
  images?: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ServiceCategory {
  id: string
  name: string
  description?: string
  isActive: boolean
}
