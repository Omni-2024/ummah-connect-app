import { proxy } from "valtio"
import type { Order } from "@/types/order"

interface OrderStore {
  orders: Order[]
  setOrders: (orders: Order[]) => void
  addOrder: (order: Order) => void
  updateOrder: (id: string, updates: Partial<Order>) => void
  removeOrder: (id: string) => void
}

export const orderStore = proxy<OrderStore>({
  orders: [],

  setOrders: (orders: Order[]) => {
    orderStore.orders = orders
  },

  addOrder: (order: Order) => {
    orderStore.orders.push(order)
  },

  updateOrder: (id: string, updates: Partial<Order>) => {
    const index = orderStore.orders.findIndex((o) => o.id === id)
    if (index !== -1) {
      Object.assign(orderStore.orders[index], updates)
    }
  },

  removeOrder: (id: string) => {
    const index = orderStore.orders.findIndex((o) => o.id === id)
    if (index !== -1) {
      orderStore.orders.splice(index, 1)
    }
  },
})
