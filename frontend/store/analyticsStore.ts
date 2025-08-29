import { proxy } from "valtio"
import type { Analytics } from "@/types/analytics"

interface AnalyticsStore {
  data: Analytics | null
  setAnalytics: (data: Analytics) => void
  updateMetric: (key: keyof Analytics, value: any) => void
}

export const analyticsStore = proxy<AnalyticsStore>({
  data: null,

  setAnalytics: (data: Analytics) => {
    analyticsStore.data = data
  },

  updateMetric: (key: keyof Analytics, value: any) => {
    if (analyticsStore.data) {
      ;(analyticsStore.data as any)[key] = value
    }
  },
})
