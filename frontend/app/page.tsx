import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-background py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              Connect with Trusted Islamic Service Providers
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
              Find reliable Islamic services in your community. From education to event planning, connect with verified
              providers who understand your values.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" asChild>
                <Link href="/user/auth/register">Find Services</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/service-provider/auth/login">Continue as Service Provider</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-card py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose Our Platform?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We understand the unique needs of the Islamic community and provide a trusted platform for connecting
                with service providers who share your values.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <div className="h-6 w-6 rounded bg-primary"></div>
                  </div>
                  <CardTitle>Verified Providers</CardTitle>
                  <CardDescription>
                    All service providers are carefully vetted to ensure they meet our community standards.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                    <div className="h-6 w-6 rounded bg-secondary"></div>
                  </div>
                  <CardTitle>Islamic Values</CardTitle>
                  <CardDescription>
                    Connect with providers who understand and respect Islamic principles and practices.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                    <div className="h-6 w-6 rounded bg-accent"></div>
                  </div>
                  <CardTitle>Community Trust</CardTitle>
                  <CardDescription>
                    Built by the community, for the community. Read reviews and ratings from fellow Muslims.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Services Preview */}
        <section className="bg-background py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Popular Services</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover the most sought-after services in our Islamic community.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">Islamic Education</CardTitle>
                  <CardDescription>Quran tutoring, Arabic lessons, and Islamic studies for all ages.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    Explore
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">Event Planning</CardTitle>
                  <CardDescription>
                    Weddings, Eid celebrations, and other Islamic events planned with care.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    Explore
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">Halal Food</CardTitle>
                  <CardDescription>Certified halal catering, restaurants, and food delivery services.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    Explore
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">Counseling</CardTitle>
                  <CardDescription>Islamic counseling and guidance for personal and family matters.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    Explore
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-primary-foreground mb-4">Ready to Get Started?</h2>
            <p className="text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Join thousands of community members who trust our platform for their service needs.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/user/auth/register">Join as User</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                asChild
              >
                <Link href="/service-provider/auth/register">Become a Provider</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
