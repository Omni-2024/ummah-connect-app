import { type NextRequest, NextResponse } from "next/server"
import { providers, providerCredentials } from "../register/route"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
    }

    const credential = providerCredentials.find((c: any) => c.email === email && c.password === password)

    if (!credential) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }

    if (credential.status !== "approved") {
      let message = "Your account is pending admin approval. Please wait for approval notification."
      if (credential.status === "rejected") {
        message = "Your account application has been rejected. Please contact support for more information."
      }
      return NextResponse.json({ message }, { status: 403 })
    }

    const provider = providers.find((p: any) => p.id === credential.providerId)

    if (!provider) {
      return NextResponse.json({ message: "Provider not found" }, { status: 404 })
    }

    if (!provider.isApproved || provider.status !== "approved") {
      return NextResponse.json(
        { message: "Your account is not approved yet. Please wait for admin approval." },
        { status: 403 },
      )
    }

    // Generate mock tokens
    const accessToken = `access_${provider.id}_${Date.now()}`
    const refreshToken = `refresh_${provider.id}_${Date.now()}`

    console.log("[v0] Provider login successful:", { email, providerId: provider.id })

    return NextResponse.json({
      provider,
      accessToken,
      refreshToken,
      message: "Login successful",
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
