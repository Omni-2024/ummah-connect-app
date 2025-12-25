"use client";

import Button from "@/components/base/Button";
import Footer from "@/features/app/components/Footer";
import Navbar from "@/features/app/components/Navbar";
import NavbarMobile from "@/features/app/components/Navbar.mobile";
import NavDrawerMobile from "@/features/app/components/NavDrawer.mobile";
import NotificationsModal from "@/features/app/components/notifications/NotificationsModal.mobile";
import NotLoggedInNavModal from "@/features/app/components/NotLoggedInNavModal.mobile";
import { useAppState } from "@/features/app/context/useAppState";
import { HambergerMenu, Notification, MessageText1 } from "iconsax-react";
import Link from "next/link";
import { useState } from "react";
import ProfileMenuButton from "@/features/app/components/ProfileMenuButton";
import { NAV_LOGO_SRC } from "@/lib/constants";
import { useAuthState } from "@/features/auth/context/useAuthState";

const SendFeedbackPage = () => {
  const { isAuthenticated } = useAuthState();
  const {
    setShowNavDrawer,
    setShowNotificationsModal,
    setShowNotLoggedInNavModal,
  } = useAppState();

  const [formData, setFormData] = useState({
    type: "general",
    subject: "",
    message: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleShowNavDrawer = () => setShowNavDrawer(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Optional: reset form after submission
    // setFormData({ type: "general", subject: "", message: "", email: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (isSubmitted) {
    return (
      <>
        <Navbar />
        <NavbarMobile
          className="px-4 bg-white border-b border-gray-100 sticky top-0 z-40"
          left={
            <Link href="/" className="flex items-center">
              <img
                alt="Ummah Logo"
                src={NAV_LOGO_SRC}
                className="h-8 w-auto cursor-pointer object-contain"
              />
            </Link>
          }
          right={
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <ProfileMenuButton onClick={handleShowNavDrawer} />
              ) : (
                <>
                  <Link href="/start-selling">
                    <Button variant="unstyled" className="text-sm font-medium h-9">
                      Become a Seller
                    </Button>
                  </Link>
                  <Link href="/user/login">
                    <Button variant="primary" size="sm" className="text-sm font-medium h-9">
                      Login
                    </Button>
                  </Link>
                </>
              )}
            </div>
          }
        />

        <NotificationsModal disabled />
        <NavDrawerMobile />
        <NotLoggedInNavModal />

        <div className="container max-w-[1120px] px-6 py-12 sm:px-10 min-h-screen">
          <div className="max-w-2xl mx-auto text-center py-16">
            <h1 className="font-primary text-3xl font-bold mb-4">
              Thank You for Your Feedback!
            </h1>
            <p className="text-lg text-dark-400 mb-8">
              As-salamu alaykum. We truly appreciate you taking the time to help us improve Ummah Connect. 
              Your input makes our community better for everyone.
            </p>
            <Link href="/">
              <Button variant="primary" size="lg">
                Return to Home
              </Button>
            </Link>
          </div>
        </div>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <NavbarMobile
        className="px-4 bg-white border-b border-gray-100 sticky top-0 z-40"
        left={
          <Link href="/" className="flex items-center">
            <img
              alt="Ummah Logo"
              src={NAV_LOGO_SRC}
              className="h-8 w-auto cursor-pointer object-contain"
            />
          </Link>
        }
        right={
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <ProfileMenuButton onClick={handleShowNavDrawer} />
            ) : (
              <>
                <Link href="/start-selling">
                  <Button variant="unstyled" className="text-sm font-medium h-9">
                    Become a Seller
                  </Button>
                </Link>
                <Link href="/user/login">
                  <Button variant="primary" size="sm" className="text-sm font-medium h-9">
                    Login
                  </Button>
                </Link>
              </>
            )}
          </div>
        }
      />

      <NotificationsModal disabled />
      <NavDrawerMobile />
      <NotLoggedInNavModal />

      <div className="container max-w-[1120px] px-6 py-1 sm:px-10 mb-10">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <MessageText1 size={56} className="text-primary-600 mx-auto mb-4" />
            <h1 className="font-primary text-[31px] font-bold">Send Feedback</h1>
            <p className="mt-4 text-base text-dark-400">
              As-salamu alaykum! We value your thoughts and suggestions. Help us make Ummah Connect better for the entire community.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-dark-500 mb-2">
                Feedback Type
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="general">General Feedback</option>
                <option value="bug">Bug Report</option>
                <option value="feature">Feature Request</option>
                <option value="support">Support Experience</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-dark-500 mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Brief summary of your feedback"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-dark-500 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                placeholder="Please share your detailed feedback, suggestions, or issue description..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-dark-500 mb-2">
                Your Email (optional)
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="So we can follow up if needed"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p className="mt-2 text-sm text-dark-400">
                We won't use this for marketing — only to respond to your feedback.
              </p>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Feedback"}
              </Button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default SendFeedbackPage;