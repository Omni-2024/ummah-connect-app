"use client"
import React, { useRef, useState, useMemo, useCallback, useEffect } from "react"
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
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@radix-ui/react-icons"
import Footer from "@/features/app/components/Footer"
import { useCurrentUser } from "@/lib/hooks/useUser"
import { useAuthState } from "@/features/auth/context/useAuthState"
import { useCategories } from "@/lib/hooks/useCategories"
import envs from "@/lib/env"
import { IconButton } from "@radix-ui/themes"
import { ContactFormSection } from "@/features/becomeaseller/ContactFormModal"

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
  const formRef = useRef<HTMLDivElement>(null!);

  // Fetch real categories from API
  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories()

  // Use real categories from API, sorted by order
  const expertiseCategories = useMemo(() => {
    if (!categories || categoriesError) return []
    
    return categories
      .sort((a, b) => a.order - b.order)
      .map(category => ({
        id: category.id,
        name: category.name,
        icon: getCategoryIcon(category.name),
      }))
  }, [categories, categoriesError])

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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
      title: "Serve & Earn Halal",
      description: "Empower your skills while earning in a lawful, dignified, and ethical way.",
    },
    {
      icon: <GlobeIcon className="size-8 text-blue-500" />,
      title: "One Ummah, One Platform",
      description: "Connecting Muslims worldwide through a unified, purpose-driven marketplace.",
    },
    {
      icon: <ShieldIcon className="size-8 text-purple-500" />,
      title: "Safe, Secure & Private",
      description: "Your data, transactions, and conversations are protected with strong safeguards.",
    },
    {
      icon: <RocketIcon className="size-8 text-orange-500" />,
      title: "Verified Muslim Professionals",
      description: "Carefully vetted practitioners who meet our ethical, professional, and community standards.",
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
      answer: "Not at all! We provide 24/7 support to help you succeed. Many of our top sellers started with zero online experience.",
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

    const handleBack = () => {
    router.back()
  }
  
  return (
    <div className="min-h-screen w-full bg-white pb-16 lg:pb-0">
      <Navbar />
      <NavbarMobile
        className="px-4 bg-white border-b border-gray-100 sticky top-0 z-40"
        left={
          <div className="flex items-center gap-3">
            <IconButton onClick={handleBack} className="hover:bg-gray-100 transition-colors">
              <ArrowLeftIcon className="size-5" />
            </IconButton>
            <NavbarTitle title="Become a Seller" size="md" />
          </div>
        }
        />

      {/* Hero Section - Balanced */}
      <div className="bg-emerald-600 py-12">
        <div className="container px-4 lg:px-20">
          <div className="max-w-3xl mx-auto text-center text-white">
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 mb-6">
              <CheckCircledIcon className="size-4" />
              <span className="text-sm">Join now</span>
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
                onClick={scrollToForm}
              >
                <RocketIcon className="mr-2" />
                Get Started Now
              </Button>

            </div>

            {/* Simple trust indicators */}
            <div className="flex justify-center items-center gap-6 text-sm text-emerald-200">
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
        <div className="py-12 bg-gray-50 rounded-xl">
          <div className="px-6">
            <div className="max-w-2xl mx-auto text-center mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                Get Started in 3 Steps
              </h2>
              <p className="text-gray-600">
                Simple process to launch your seller profile
              </p>
            </div>

            {/* Mobile: Horizontal scroll, Desktop: Grid */}
            <div className="md:grid md:grid-cols-3 md:gap-6 md:max-w-3xl md:mx-auto">
              <div 
                className="
                  flex md:contents 
                  gap-4 md:gap-6 
                  overflow-x-auto pb-6 md:pb-0 
                  snap-x snap-mandatory 
                  scrollbar-hide 
                  px-4 md:px-0 
                  -mx-4 md:mx-0
                "
              >
                {steps.map((step, index) => (
              <div 
                key={index} 
                className={`
                  flex-shrink-0 
                  w-[86vw]           // ← increased from previous suggestions – feels more "one at a time"
                  max-w-[340px]      // safety cap for very wide phones
                  md:w-auto 
                  text-center 
                  snap-center
                  bg-white           // ← add card-like background (optional but looks cleaner)
                  rounded-xl
                  shadow-sm
                  px-5 py-6          // ← generous inner padding
                  border border-gray-100
                `}
              >
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-5">
                  {step.number}
                </div>
                <h3 className="font-semibold text-gray-900 text-lg mb-3">{step.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4 px-1">
                  {step.description}
                </p>
                <Badge 
                  variant="outline" 
                  className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1"
                >
                  {step.time}
                </Badge>
              </div>
            ))}
              </div>
            </div>

            {/* Mobile scroll indicator */}
            <div className="flex justify-center mt-4 gap-1.5 md:hidden">
              {steps.map((_, index) => (
                <div key={index} className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Categories Section - Grid Layout (3 per row on mobile) */}
        <div className="py-8 bg-blue-50 rounded-xl my-8">
          <div className="px-4 lg:px-6">

            {/* Header */}
            <div className="max-w-2xl mx-auto text-center mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                Popular Categories
              </h2>
              <p className="text-gray-600">
                Choose your area of expertise
              </p>
            </div>

            {categoriesLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
                <span className="ml-3 text-slate-600">Loading categories...</span>
              </div>
            ) : categoriesError ? (
              <div className="text-center py-12 text-red-600">
                Error loading categories. Please try again later.
              </div>
            ) : expertiseCategories.length === 0 ? (
              <div className="text-center py-12 text-slate-600">
                No categories available at the moment.
              </div>
            ) : (
              <div className="max-w-6xl mx-auto">

                {/* 
                  Mobile & Tablet: GRID (left → right)
                  Desktop only: CENTER if < 6
                */}
                <div
                  className={`
                    grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5
                    gap-3 sm:gap-4
                    ${expertiseCategories.length < 6 ? "lg:flex lg:justify-center lg:flex-wrap" : "lg:grid lg:grid-cols-6"}
                  `}
                >
                  {expertiseCategories.map((category) => (
                    <Card
                      key={category.id}
                      className={`
                        p-3 sm:p-4 md:p-5 text-center
                        hover:shadow-lg transition-all cursor-pointer group
                        ${expertiseCategories.length < 6 ? "lg:w-[150px]" : ""}
                      `}
                      onClick={() =>
                        router.push(`/explore?profession=${category.id}`)
                      }
                    >
                      <div className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                        {category.icon}
                      </div>
                      <h3 className="font-medium text-gray-900 text-xs sm:text-sm leading-tight line-clamp-2">
                        {category.name}
                      </h3>
                    </Card>
                  ))}
                </div>

              </div>
            )}
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
        
        <ContactFormSection formRef={formRef} />

        {/* Final CTA - More Compelling */}
        <div className="py-8">
          <Card className="p-12 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-center">
            <HeartIcon className="size-16 mx-auto mb-6 text-emerald-200" />
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Ready to Transform Your Skills into Income?
            </h2>
            <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join Muslims who’ve already started their journey to financial independence while serving the Ummah
            </p>
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

// Helper function to assign icons to categories
function getCategoryIcon(categoryName: string): string {
  const icons = ["📚", "✍️", "🌟", "📋"];
  
  // Use a stronger mix + multiply by prime to spread values more
  let hash = 0;
  for (let i = 0; i < categoryName.length; i++) {
    hash = (categoryName.charCodeAt(i) + (hash * 31)) | 0; // 31 is common good prime
  }
  
  // Optional boost: flip sign and add length to further diversify
  hash = Math.abs(hash + categoryName.length * 17);
  
  return icons[hash % icons.length];
}