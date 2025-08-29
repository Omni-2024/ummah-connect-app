import { type NextRequest, NextResponse } from "next/server"

const providers: any[] = []
const providerCredentials: any[] = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, phone, category, description } = body

    // Validate required fields
    if (!name || !email || !password || !category) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Check if email already exists
    const emailExists = providers.some((p: any) => p.email === email)

    if (emailExists) {
      return NextResponse.json({ message: "Email already registered" }, { status: 409 })
    }

    const newProvider = {
      id: `provider_${Date.now()}`,
      email,
      name,
      phone: phone || "",
      category,
      description: description || "",
      status: "pending", // pending, approved, rejected
      isApproved: false,
      rating: 0,
      totalReviews: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Store password separately (in a real app, this would be hashed)
    const credentials = {
      email,
      password,
      providerId: newProvider.id,
      status: "pending", // Add status to credentials
    }

    providers.push(newProvider)
    providerCredentials.push(credentials)

    console.log("[v0] New provider registered:", { email, name, status: "pending" })

    return NextResponse.json({
      message:
        "Registration successful! Your application is pending admin approval. You will receive an email notification once approved.",
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export { providers, providerCredentials }
