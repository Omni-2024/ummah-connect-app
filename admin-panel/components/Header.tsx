"use client"

import Link from "next/link"
import { Button } from "@/components/base/button"

export default function Header() {
  return (
    <header className="border-b border-border bg-background">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">IC</span>
            </div>
            <span className="text-xl font-bold text-foreground">Islamic Community</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/services" className="text-muted-foreground hover:text-foreground transition-colors">
              Services
            </Link>
            <Link href="/providers" className="text-muted-foreground hover:text-foreground transition-colors">
              Providers
            </Link>
            <Link href="/community" className="text-muted-foreground hover:text-foreground transition-colors">
              Community
            </Link>
            <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
            <Button variant="ghost" asChild>
              <Link href="/user/auth/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/user/auth/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
