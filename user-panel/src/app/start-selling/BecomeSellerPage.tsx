"use client"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/features/app/components/Navbar"
import NavbarMobile, { NavbarTitle } from "@/features/app/components/Navbar.mobile"
import Bottombar from "@/features/app/components/Bottombar"
import { Card } from "@/components/base/Card"
import Button from "@/components/base/Button"
import Badge from "@/components/base/Badge"
import {
  LightningBoltIcon,
  GlobeIcon,
  LockClosedIcon,
  ClockIcon,
  CheckCircledIcon,
  StarIcon,
  PersonIcon,
  RocketIcon,
  HeartIcon,
  ChatBubbleIcon,
  LockClosedIcon as ShieldIcon,
  ArrowRightIcon,
  PlayIcon,
} from "@radix-ui/react-icons"
import Footer from "@/features/app/components/Footer"
import { useCurrentUser } from "@/lib/hooks/useUser"
import { useAuthState } from "@/features/auth/context/useAuthState"
import envs from "@/lib/env"

// Helper function to build avatar URL (same as in ExplorePage)
export const buildAvatarUrl = (img?: string | null): string | null => {
  if (!img) return null
  if (/^https?:\/\//i.test(img)) return img
  const base = envs.imageBaseUrl
  return `${base}/${img}`
}

export default function BecomeSellerPage() {
  const router = useRouter()
  const { data: user } = useCurrentUser()
  const { logout } = useAuthState()
  const [activeStep, setActiveStep] = useState(0)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [avatarBroken, setAvatarBroken] = useState(false)

  const avatarUrl = buildAvatarUrl(user?.profileImage)

  const handleLogout = () => {
    logout()
    router.push("/user/login")
  }

  const handleGetStarted = () => {
    router.push("/user/signup")
  }

  // Success metrics to build trust
  const metrics = [
    { number: "10K+", label: "Active Sellers", icon: <PersonIcon /> },
    { number: "50K+", label: "Projects Completed", icon: <CheckCircledIcon /> },
    { number: "4.9", label: "Average Rating", icon: <StarIcon /> },
    { number: "90+", label: "Countries Served", icon: <GlobeIcon /> },
  ]

  // Enhanced benefits with more compelling copy
  const benefits = [
    {
      icon: <LightningBoltIcon className="size-8 text-emerald-500" />,
      title: "Earn $500-5000/month",
      description: "Top sellers earn substantial halal income serving the global Muslim community",
      highlight: "Avg. $1,200/month",
    },
    {
      icon: <GlobeIcon className="size-8 text-blue-500" />,
      title: "Access 500,000+ Muslims",
      description: "Reach clients across 90+ countries in the world's largest Muslim marketplace",
      highlight: "24/7 Global Market",
    },
    {
      icon: <ShieldIcon className="size-8 text-purple-500" />,
      title: "100% Shariah Compliant",
      description: "Every transaction follows Islamic principles with scholar-verified guidelines",
      highlight: "Islamic Finance",
    },
    {
      icon: <RocketIcon className="size-8 text-orange-500" />,
      title: "Launch in 24 Hours",
      description: "Quick approval process gets you selling faster than any other platform",
      highlight: "Fast Track",
    },
  ]

  // Interactive steps with progress
  const steps = [
    {
      number: 1,
      title: "Create Your Profile",
      description: "Showcase your skills with portfolio examples and competitive pricing",
      time: "10 minutes",
      icon: <PersonIcon />,
    },
    {
      number: 2,
      title: "Get Verified",
      description: "Our team reviews your application within 24 hours for quality assurance",
      time: "1 day",
      icon: <ShieldIcon />,
    },
    {
      number: 3,
      title: "Start Earning",
      description: "Launch your first gig and start receiving orders from global clients",
      time: "Immediate",
      icon: <RocketIcon />,
    },
  ]

  // Enhanced FAQ with more specific questions
  const faqs = [
    {
      question: "How much can I realistically earn as a seller?",
      answer: "Top performers earn $2,000-5,000/month. New sellers typically start at $300-800/month depending on their expertise and dedication. Islamic education tutors and tech professionals see the highest demand.",
    },
    {
      question: "What makes this platform different from Fiverr or Upwork?",
      answer: "We're the only platform specifically designed for Muslims, ensuring all services align with Islamic values. Plus, you'll face less competition and connect with clients who share your faith and values.",
    },
    {
      question: "Do I need previous online selling experience?",
      answer: "Not at all! We provide comprehensive training, templates, and 24/7 support to help you succeed. Many of our top sellers started with zero online experience.",
    },
    {
      question: "How do you ensure payments are halal?",
      answer: "All transactions are vetted by our Islamic finance team. We avoid interest-based services, gambling-related work, and other haram activities. Payments are processed through Shariah-compliant methods.",
    },
    {
      question: "What categories have the highest demand?",
      answer: "Islamic education, Arabic language tutoring, halal business consulting, and Islamic content creation are our top-performing categories with consistent high demand.",
    },
    {
      question: "Can I sell if I'm not a native English speaker?",
      answer: "Absolutely! We serve a global Muslim community and many clients prefer sellers who speak their native language. Arabic, Urdu, Turkish, and other languages are in high demand.",
    },
  ]

  const expertiseCategories = [
    { name: "Islamic Education", demand: "High", icon: "📚" },
    { name: "Arabic Language", demand: "Very High", icon: "🔤" },
    { name: "Halal Business", demand: "High", icon: "💼" },
    { name: "Graphic Design", demand: "Medium", icon: "🎨" },
    { name: "Web Development", demand: "High", icon: "💻" },
    { name: "Digital Marketing", demand: "Medium", icon: "📱" },
    { name: "Writing & Translation", demand: "High", icon: "✍️" },
    { name: "Video Production", demand: "Medium", icon: "🎥" },
  ]

  const testimonials = [
    {
      name: "Ahmed Hassan",
      role: "Arabic Teacher",
      earnings: "$3,200/month",
      quote: "I've been teaching Arabic online for 2 years and this platform has tripled my income while connecting me with serious learners.",
      avatar: "👨‍🏫",
      rating: 5,
    },
    {
      name: "Fatima Al-Zahra",
      role: "Islamic Finance Consultant",
      earnings: "$4,800/month",
      quote: "The quality of clients here is exceptional. They understand the value of Shariah-compliant advice and pay accordingly.",
      avatar: "👩‍💼",
      rating: 5,
    },
    {
      name: "Omar Khan",
      role: "Web Developer",
      earnings: "$2,900/month",
      quote: "Building halal businesses' websites gives me purpose beyond just earning. The community support is incredible.",
      avatar: "👨‍💻",
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen w-full bg-white pb-16 lg:pb-0">
      <Navbar />
      <NavbarMobile
        className="px-4"
        left={<NavbarTitle title="Become a Seller" size="md" />}
      />

      {/* Hero Section - Balanced */}
      <div className="bg-emerald-600 py-12">
        <div className="container px-4 lg:px-20">
          <div className="max-w-3xl mx-auto text-center text-white">
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 mb-6">
              <CheckCircledIcon className="size-4" />
              <span className="text-sm">Join 10,000+ successful sellers</span>
            </div>
            
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">
              Start Your Seller Journey
            </h1>
            
            <p className="text-lg text-emerald-100 mb-8 leading-relaxed">
              Turn your expertise into income by serving the global Muslim community. 
              Earn $500-3000/month with flexible, Shariah-compliant work.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button 
                size="lg" 
                className="bg-white text-emerald-600 hover:bg-gray-100 font-semibold px-6"
                onClick={handleGetStarted}
              >
                <RocketIcon className="mr-2" />
                Get Started Now
              </Button>

            </div>

            {/* Simple trust indicators */}
            <div className="flex justify-center items-center gap-6 text-sm text-emerald-200">
              <div className="flex items-center gap-2">
                <StarIcon className="size-4" />
                <span>4.9 Rating</span>
              </div>
              <div className="w-1 h-1 bg-emerald-200 rounded-full"></div>
              <div className="flex items-center gap-2">
                <GlobeIcon className="size-4" />
                <span>90+ Countries</span>
              </div>
              <div className="w-1 h-1 bg-emerald-200 rounded-full"></div>
              <div className="flex items-center gap-2">
                <LockClosedIcon className="size-4" />
                <span>100% Halal</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 lg:px-20">
        {/* Benefits Section - Simplified */}
        <div className="py-12">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
              Why Sell With Us?
            </h2>
            <p className="text-gray-600">
              Built specifically for Muslim professionals
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <Card key={index} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 p-3 bg-gray-50 rounded-lg">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                    <p className="text-sm text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Steps Section - Simplified */}
        <div className="py-12 bg-gray-50 rounded-xl my-12">
          <div className="px-6">
            <div className="max-w-2xl mx-auto text-center mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                Get Started in 3 Steps
              </h2>
              <p className="text-gray-600">
                Simple process to launch your seller profile
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {steps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                    {step.number}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                  <Badge  className="text-xs">
                    {step.time}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials Section - Simplified */}
        <div className="py-12">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
              What Our Sellers Say
            </h2>
            <p className="text-gray-600">
              Real success stories from our community
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-2xl">{testimonial.avatar}</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-xs text-gray-600">{testimonial.role}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-emerald-600">{testimonial.earnings}</div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 italic">"{testimonial.quote}"</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Categories Section - Simplified */}
        <div className="py-12 bg-blue-50 rounded-xl my-12">
          <div className="px-6">
            <div className="max-w-2xl mx-auto text-center mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                Popular Categories
              </h2>
              <p className="text-gray-600">
                Choose your area of expertise
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {expertiseCategories.map((category, index) => (
                <Card key={index} className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <h3 className="font-medium text-gray-900 text-sm mb-1">{category.name}</h3>
                  <Badge className={`text-xs ${
                    category.demand === 'Very High' ? 'bg-red-100 text-red-700' :
                    category.demand === 'High' ? 'bg-orange-100 text-orange-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {category.demand}
                  </Badge>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Section - Simplified */}
        <div className="py-12">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600">
              Common questions about becoming a seller
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, index) => (
              <Card 
                key={index} 
                className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
              >
                <div className="flex justify-between items-start gap-4">
                  <h3 className="font-medium text-gray-900">{faq.question}</h3>
                  <ArrowRightIcon 
                    className={`size-4 text-gray-400 flex-shrink-0 transition-transform ${
                      expandedFaq === index ? 'rotate-90' : ''
                    }`}
                  />
                </div>
                {expandedFaq === index && (
                  <p className="text-sm text-gray-600 mt-3 pr-6">{faq.answer}</p>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Final CTA - More Compelling */}
        <div className="py-16">
          <Card className="p-12 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-center">
            <HeartIcon className="size-16 mx-auto mb-6 text-emerald-200" />
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Ready to Transform Your Skills into Income?
            </h2>
            <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of Muslims who've already started their journey to financial independence 
              while serving the Ummah
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="px-8 py-4 bg-white text-emerald-600 hover:bg-gray-100 font-semibold"
                onClick={handleGetStarted}
              >
                <RocketIcon className="mr-2" />
                Start Your Seller Journey
              </Button>
              <Button 
                variant="primary"
                size="lg" 
                className="px-6 py-4 border-white/30 text-white hover:bg-white/10"
              >
                <ChatBubbleIcon className="mr-2" />
                Talk to Our Team
              </Button>
            </div>
            <p className="text-sm text-emerald-200 mt-6">
              💚 Free to join • 24-hour approval • No hidden fees
            </p>
          </Card>
        </div>
      </div>

      <Bottombar
        user={user}
        avatarUrl={avatarUrl}
        avatarBroken={avatarBroken}
        setAvatarBroken={setAvatarBroken}
        handleLogout={handleLogout}
      />
      <Footer />
    </div>
  )
}