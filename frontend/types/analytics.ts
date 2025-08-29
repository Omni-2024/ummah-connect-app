export interface Analytics {
  totalUsers: number
  totalProviders: number
  totalOrders: number
  totalRevenue: number
  monthlyGrowth: {
    users: number
    providers: number
    orders: number
    revenue: number
  }
}
