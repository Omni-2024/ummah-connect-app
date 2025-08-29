import { proxy } from "valtio"
import type { Service, ServiceCategory } from "@/types/service"

interface ServiceStore {
  services: Service[]
  categories: ServiceCategory[]
  selectedCategory: string | null
  setServices: (services: Service[]) => void
  setCategories: (categories: ServiceCategory[]) => void
  setSelectedCategory: (category: string | null) => void
  addService: (service: Service) => void
  updateService: (id: string, updates: Partial<Service>) => void
  removeService: (id: string) => void
}

export const serviceStore = proxy<ServiceStore>({
  services: [],
  categories: [],
  selectedCategory: null,

  setServices: (services: Service[]) => {
    serviceStore.services = services
  },

  setCategories: (categories: ServiceCategory[]) => {
    serviceStore.categories = categories
  },

  setSelectedCategory: (category: string | null) => {
    serviceStore.selectedCategory = category
  },

  addService: (service: Service) => {
    serviceStore.services.push(service)
  },

  updateService: (id: string, updates: Partial<Service>) => {
    const index = serviceStore.services.findIndex((s) => s.id === id)
    if (index !== -1) {
      Object.assign(serviceStore.services[index], updates)
    }
  },

  removeService: (id: string) => {
    const index = serviceStore.services.findIndex((s) => s.id === id)
    if (index !== -1) {
      serviceStore.services.splice(index, 1)
    }
  },
})
