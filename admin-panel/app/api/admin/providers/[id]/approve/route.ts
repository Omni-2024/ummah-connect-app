import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { action } = await request.json() // "approve" or "reject"

    if (typeof window === "undefined") {
      return NextResponse.json({ message: "Server-side operation not supported" }, { status: 400 })
    }

    // Update provider status
    const providers = JSON.parse(localStorage.getItem("providers") || "[]")
    const providerIndex = providers.findIndex((p: any) => p.id === id)

    if (providerIndex === -1) {
      return NextResponse.json({ message: "Provider not found" }, { status: 404 })
    }

    providers[providerIndex].status = action === "approve" ? "approved" : "rejected"
    providers[providerIndex].isApproved = action === "approve"
    providers[providerIndex].updatedAt = new Date().toISOString()

    localStorage.setItem("providers", JSON.stringify(providers))

    // Update credentials status
    const credentials = JSON.parse(localStorage.getItem("providerCredentials") || "[]")
    const credentialIndex = credentials.findIndex((c: any) => c.providerId === id)

    if (credentialIndex !== -1) {
      credentials[credentialIndex].status = action === "approve" ? "approved" : "rejected"
      localStorage.setItem("providerCredentials", JSON.stringify(credentials))
    }

    // Mock email notification
    console.log(`[v0] Email sent to ${providers[providerIndex].email}: Your application has been ${action}d`)

    return NextResponse.json({
      message: `Provider ${action}d successfully`,
      provider: providers[providerIndex],
    })
  } catch (error) {
    console.error("Error updating provider:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
