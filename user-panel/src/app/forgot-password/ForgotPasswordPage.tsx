// app/forgot-password/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  EnvelopeClosedIcon,
} from "@radix-ui/react-icons";
import { forgotPasswordFn } from "@/lib/endpoints/authenticationFns";
import { Toast } from "@/components/base/Toast";
import { getErrorMessage } from "@/lib/helpers/errors";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { mutate: forgotPassword, isPending } = useMutation({
    mutationFn: forgotPasswordFn,
    onSuccess: () => setIsSubmitted(true),
    onError: (err:any) => {
      const message = getErrorMessage(
        err,
        "Failed to send reset email. Please try again."
      );
      Toast.error(message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    forgotPassword(email);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-4">
            <button
              onClick={() => router.push("/user/login")}
              className="flex items-center space-x-3 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span>Back to Login</span>
            </button>
          </div>
        </header>

        <main className="container mx-auto px-6 py-16">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mb-6">
                <EnvelopeClosedIcon className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Check your email
              </h1>
              <p className="text-gray-600 mb-8">
                We've sent password reset instructions to{" "}
                <strong>{email}</strong>
              </p>
              <button
                onClick={() => router.push("/user/login")}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200"
              >
                Back to Login
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <button
            onClick={() => router.push("/user/login")}
            className="flex items-center space-x-3 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Back to Login</span>
          </button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Reset your password
              </h1>
              <p className="text-gray-600">
                Enter your email address and we'll send you a link to reset your
                password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <EnvelopeClosedIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending || !email.trim()}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    Send Reset Link
                    <ArrowRightIcon className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
