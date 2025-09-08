import {
  LayoutDashboard,
  Users,
  Tags,
  DollarSign,
  Briefcase,
  ShoppingCart,
  MessageSquare,
  BarChart3,
  Star,
  User,
} from "lucide-react"

export const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Users", href: "/admin/dashboard/users", icon: Users },
  { name: "Providers", href: "/admin/dashboard/providers", icon: Users },
  { name: "Categories", href: "/admin/dashboard/categories", icon: Tags },
  { name: "Services", href: "/admin/dashboard/services", icon: Briefcase },
  { name: "Orders", href: "/admin/dashboard/orders", icon: ShoppingCart },
  { name: "Messages", href: "/admin/dashboard/messages", icon: MessageSquare },
  { name: "Revenue", href: "/admin/dashboard/revenue", icon: DollarSign },
  { name: "Analytics", href: "/admin/dashboard/analytics", icon: BarChart3 },
  { name: "Reviews", href: "/admin/dashboard/reviews", icon: Star },
  { name: "Profile", href: "/admin/dashboard/profile", icon: User },
]
