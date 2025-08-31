// app/contact-support/page.tsx
"use client";

import {
  ArrowLeftIcon,
  EnvelopeClosedIcon,
  ChatBubbleIcon,
  MobileIcon,
} from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

export default function ContactSupportPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-3 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 rounded bg-gradient-to-br from-indigo-500 to-purple-600"></div>
              <span className="text-lg font-bold">Ummah Community</span>
            </div>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mb-4">
                <ChatBubbleIcon className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Contact Support
              </h1>
              <p className="text-gray-600">
                We're here to help! Choose how you'd like to reach us.
              </p>
            </div>

            <div className="grid gap-6">
              {/* Email Support */}
              <div className="border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                    <EnvelopeClosedIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email Support</h3>
                    <p className="text-sm text-gray-600">Get help via email</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Send us an email and we'll get back to you within 24 hours.
                </p>
                <a
                  href="mailto:support@ummahcommunity.com"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  support@ummahcommunity.com
                  <ArrowLeftIcon className="w-4 h-4 rotate-180" />
                </a>
              </div>

              {/* Phone Support */}
              <div className="border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                    <MobileIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Phone Support</h3>
                    <p className="text-sm text-gray-600">Speak with our team</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Call us during business hours (9 AM - 6 PM EST).
                </p>
                <a
                  href="tel:+1-800-UMMAH-01"
                  className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium text-sm"
                >
                  +1 (800) UMMAH-01
                  <ArrowLeftIcon className="w-4 h-4 rotate-180" />
                </a>
              </div>
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={() => router.push("/")}
                className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
              >
                Return to homepage
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
