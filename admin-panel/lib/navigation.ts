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
  UserX
} from "lucide-react"

export const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Freelancers", href: "/admin/providers", icon: Users },
  { name: "Blocked Users", href: "/admin/blocked-users", icon: UserX },
  { name: "Categories", href: "/admin/categories", icon: Tags },
  { name: "Services", href: "/admin/services", icon: Briefcase },
  // { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Messages", href: "/admin/messages", icon: MessageSquare },
  { name: "Revenue", href: "/admin/revenue", icon: DollarSign },
  // { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Reviews", href: "/admin/reviews", icon: Star },
  { name: "Profile", href: "/admin/profile", icon: User },
]
