import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import Providers from "@/app/providers";

export const metadata: Metadata = {
  title: "Admin - Ummah community",
  description: "Connect with Islamic service providers in your community",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
      <Providers>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </Providers>
      </body>
    </html>
  )
}
