import { NextResponse } from "next/server"

// Get all providers for admin
export async function GET() {
  try {
    if (typeof window === "undefined") {
      // Server-side: return empty array, will be populated client-side
      return NextResponse.json({ providers: [] })
    }

    const providers = JSON.parse(localStorage.getItem("providers") || "[]")
    return NextResponse.json({ providers })
  } catch (error) {
    console.error("Error fetching providers:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
