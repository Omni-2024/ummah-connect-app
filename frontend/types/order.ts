export interface Order {
  id: string
  userId: string
  providerId: string
  serviceId: string
  status: "pending" | "accepted" | "in-progress" | "completed" | "cancelled"
  totalAmount: number
  scheduledDate?: string
  notes?: string
  createdAt: string
  updatedAt: string
}
