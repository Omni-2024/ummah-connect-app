"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Card } from "@/components/base/card"
import { navigation } from "../../../lib/navigation"
import AdminSidebarFooter from "./AdminSidebarFooter"
import Image from "next/image";
import {NAV_LOGO_SRC} from "@/lib/constants";

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
      <Card className="flex grow flex-col border-r border-border rounded-none">
        <div className="flex items-center justify-between p-6 ">
          {/*<Link href="/admin-panel/public" className="flex items-center space-x-2">*/}
          {/*  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#669f9d] to-[#337f7c] flex items-center justify-center">*/}
          {/*    <Shield className="h-4 w-4 text-destructive-foreground" />*/}
          {/*  </div>*/}
          {/*  <span className="text-lg font-bold text-foreground">*/}
          {/*    Admin Panel*/}
          {/*  </span>*/}
          {/*</Link>*/}
          <Image width={140} height={40} src={NAV_LOGO_SRC} alt="Ummah-comunity"/>
        </div>
        <nav className="flex flex-1 flex-col px-6 py-0">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors",
                          pathname === item.href
                            ? "bg-primary-500 text-white"
                            : "text-muted-foreground hover:bg-primary-100 hover:text-foreground"
                        )}
                      >
                        <Icon className="h-5 w-5 shrink-0" />
                        {item.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </li>
          </ul>
        </nav>
        <AdminSidebarFooter />
      </Card>
    </div>
  )
}
