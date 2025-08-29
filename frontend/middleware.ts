import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get tokens from cookies
  const accessToken = request.cookies.get("accessToken")?.value
  const userType = request.cookies.get("userType")?.value

  // Protected routes
  const isServiceProviderRoute =
    pathname.startsWith("/service-provider") && !pathname.startsWith("/service-provider/auth")
  const isAdminRoute = pathname.startsWith("/admin") && !pathname.startsWith("/admin/auth")
  const isUserRoute = pathname.startsWith("/user") && !pathname.startsWith("/user/auth")

  // Redirect unauthenticated users
  if (isServiceProviderRoute && (!accessToken || userType !== "provider")) {
    return NextResponse.redirect(new URL("/service-provider/auth/login", request.url))
  }

  if (isAdminRoute && (!accessToken || userType !== "admin")) {
    return NextResponse.redirect(new URL("/admin/auth/login", request.url))
  }

  if (isUserRoute && (!accessToken || userType !== "user")) {
    return NextResponse.redirect(new URL("/user/auth/login", request.url))
  }

  // Redirect authenticated users away from auth pages
  if (accessToken) {
    if (pathname === "/service-provider/auth/login" || pathname === "/service-provider/auth/register") {
      if (userType === "provider") {
        return NextResponse.redirect(new URL("/service-provider/dashboard", request.url))
      }
    }

    if (pathname === "/admin/auth/login") {
      if (userType === "admin") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url))
      }
    }

    if (pathname === "/user/auth/login" || pathname === "/user/auth/register") {
      if (userType === "user") {
        return NextResponse.redirect(new URL("/user/dashboard", request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/service-provider/:path*", "/admin/:path*", "/user/:path*"],
}
