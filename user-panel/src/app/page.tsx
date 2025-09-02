"use client"

import React, {useEffect, useState} from "react"

import { useAuthState } from "@/features/auth/context/useAuthState"
import { useRouter } from "next/navigation"
import { ArrowRightIcon, PersonIcon, TargetIcon, StarIcon } from "@radix-ui/react-icons"
import Image from "next/image";
import {NAV_LOGO_SRC} from "@/lib/constants";
import {useCurrentUser} from "@/lib/hooks/useUser";
import envs from "@/lib/env";
import {useAvatarUrl} from "@/lib/hooks/useAvatarUrl";



export default function HomePage() {
  const { isAuthenticated, onboardingCompleted } = useAuthState()

  if (isAuthenticated) {
    return <AuthenticatedHome />
  }

  return <UnauthenticatedHome />
}

function UnauthenticatedHome() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Image src={NAV_LOGO_SRC} alt="ummah-comunity-logo" width={150}  height={50} priority/>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/user/login")}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => router.push("/user/signup")}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-sm"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Connect, Learn, and{" "}
            <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              Grow Together
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Join a vibrant community of learners and professionals. Share knowledge, build connections, and advance your
            career in a supportive environment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push("/user/signup")}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              Join the Community
              <ArrowRightIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => router.push("/user/login")}
              className="border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Ummah Community?</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Discover the features that make our platform the perfect place for your learning and professional growth
              journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<PersonIcon className="w-8 h-8 text-indigo-500" />}
              title="Rich Learning Resources"
              description="Access curated content, tutorials, and educational materials tailored to your interests and career goals."
            />
            <FeatureCard
              icon={<PersonIcon className="w-8 h-8 text-purple-500" />}
              title="Vibrant Community"
              description="Connect with like-minded individuals, mentors, and industry experts from around the world."
            />
            <FeatureCard
              icon={<TargetIcon className="w-8 h-8 text-green-500" />}
              title="Personalized Experience"
              description="Get recommendations and content tailored to your professional background and learning objectives."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-500 to-purple-600">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Start Your Journey?</h2>
          <p className="text-indigo-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who are already growing their careers and expanding their knowledge with
            Ummah Community.
          </p>
          <button
            onClick={() => router.push("/user/signup")}
            className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 inline-flex items-center gap-2"
          >
            Get Started Today
            <ArrowRightIcon className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600"></div>
              <span className="text-xl font-bold">Ummah Community</span>
            </div>
            <div className="text-gray-400">© 2025 Ummah Community. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}




function AuthenticatedHome() {
  const { logout, role, onboardingCompleted } = useAuthState()
  const router = useRouter()
  const { data, isFetched, isLoading } = useCurrentUser();
  const [broken, setBroken] = useState(false);

  const avatarUrl = useAvatarUrl(data?.profileImage);

  useEffect(() => {
    console.log("nan",data)
  }, [data]);

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Authenticated Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600"></div>
              <span className="text-xl font-bold text-gray-900">Ummah Community</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                {!isFetched || isLoading ? (
                    <div className="animate-pulse w-full h-full bg-gray-300" />
                ) :  !avatarUrl || broken ? (
                    <PersonIcon className="w-4 h-4 text-gray-600" />
                ) : (
                    <Image
                        src={avatarUrl}
                        alt="Profile"
                        width={32}
                        height={32}
                        className="w-full h-full object-cover rounded-full"
                        onError={() => setBroken(true)}
                        priority
                    />
                )}
              </div>
              <button onClick={handleLogout} className="text-gray-600 hover:text-gray-900 transition-colors">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
            {onboardingCompleted ? (
              <>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome back to your Dashboard! 🎉</h1>
                <p className="text-gray-600 text-lg">
                  Great to see you again! Your personalized experience is ready. Continue exploring, learning, and
                  connecting with fellow members.
                </p>
              </>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Ummah Community! 🎉</h1>
                <p className="text-gray-600 text-lg mb-4">
                  You've successfully joined our community! To get the most personalized experience, complete your
                  profile setup.
                </p>
                <button
                  onClick={() => router.push("/onboarding")}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  Complete Your Profile
                  <ArrowRightIcon className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {onboardingCompleted ? (
              <>
                <DashboardCard
                  icon={<PersonIcon className="w-6 h-6 text-indigo-500" />}
                  title="My Learning"
                  description="Continue your personalized learning journey"
                  action="Start Learning"
                />
                <DashboardCard
                  icon={<PersonIcon className="w-6 h-6 text-purple-500" />}
                  title="Community"
                  description="Connect with members in your field"
                  action="Explore Community"
                />
                <DashboardCard
                  icon={<StarIcon className="w-6 h-6 text-yellow-500" />}
                  title="Achievements"
                  description="Track your progress and milestones"
                  action="View Achievements"
                />
                <DashboardCard
                  icon={<TargetIcon className="w-6 h-6 text-green-500" />}
                  title="My Goals"
                  description="Work towards your professional objectives"
                  action="View Goals"
                />
              </>
            ) : (
              <>
                <DashboardCard
                  icon={<PersonIcon className="w-6 h-6 text-indigo-500" />}
                  title="Complete Profile"
                  description="Tell us about your background and interests"
                  action="Get Started"
                  onClick={() => router.push("/onboarding")}
                />
                <DashboardCard
                  icon={<PersonIcon className="w-6 h-6 text-purple-500" />}
                  title="Explore Community"
                  description="Discover what our community has to offer"
                  action="Browse"
                />
                <DashboardCard
                  icon={<StarIcon className="w-6 h-6 text-yellow-500" />}
                  title="Getting Started"
                  description="Learn how to make the most of your membership"
                  action="Learn More"
                />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  )
}

function DashboardCard({
  icon,
  title,
  description,
  action,
  onClick,
}: {
  icon: React.ReactNode
  title: string
  description: string
  action: string
  onClick?: () => void
}) {
  return (
    <div
      className={`bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      <button className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center gap-1">
        {action}
        <ArrowRightIcon className="w-4 h-4" />
      </button>
    </div>
  )
}
