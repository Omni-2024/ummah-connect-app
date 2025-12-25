import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">IC</span>
              </div>
              <span className="text-xl font-bold text-foreground">Islamic Community</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Connecting the Islamic community with trusted service providers for all your needs.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/services/education"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Islamic Education
                </Link>
              </li>
              <li>
                <Link href="/services/events" className="text-muted-foreground hover:text-foreground transition-colors">
                  Event Planning
                </Link>
              </li>
              <li>
                <Link
                  href="/services/counseling"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Counseling
                </Link>
              </li>
              <li>
                <Link
                  href="/services/halal-food"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Halal Food
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Community</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/community/guidelines"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Community Guidelines
                </Link>
              </li>
              <li>
                <Link
                  href="/community/support"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Support Center
                </Link>
              </li>
              <li>
                <Link
                  href="/community/events"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Local Events
                </Link>
              </li>
              <li>
                <Link
                  href="/community/resources"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Connect</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/help-center" className="text-muted-foreground hover:text-foreground transition-colors">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">© 2024 Islamic Community Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
