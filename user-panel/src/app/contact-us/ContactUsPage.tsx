"use client"
import IconButton from "@/components/base/IconButton";
import ComingSoonToolTip from "@/components/widgets/ComingSoonToolTip";
import Footer from "@/features/app/components/Footer";
import Navbar from "@/features/app/components/Navbar";
import NavbarMobile from "@/features/app/components/Navbar.mobile";
import NavDrawerMobile from "@/features/app/components/NavDrawer.mobile";
import NotificationsModal from "@/features/app/components/notifications/NotificationsModal.mobile";
import NotLoggedInNavModal from "@/features/app/components/NotLoggedInNavModal.mobile";
import { useAppState } from "@/features/app/context/useAppState";
import { useAuthState } from "@/features/auth/context/useAuthState";
import { HambergerMenu, Notification } from "iconsax-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import ProfileMenuButton from "@/features/app/components/ProfileMenuButton";
import Button from "@/components/base/Button";
import { NAV_LOGO_SRC } from "@/lib/constants";

const ContactUsPage = () => {
  const { isAuthenticated } = useAuthState();
  const {
    setShowNavDrawer,
    setShowNotificationsModal,
    setShowNotLoggedInNavModal,
  } = useAppState();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);


  useEffect(() => {
    console.log(isAuthenticated);
    return () => {
      setShowNavDrawer(false);
    };
  }, []);

  const handleHamBurgerMenu = () => {
    setShowNotLoggedInNavModal(true);
  };

  const handleNotificationButton = () => {
    setShowNotificationsModal(true);
  };

  const handleShowNavDrawer = () => {
    setShowNavDrawer(true);
  };

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) {
      setSubmitStatus("error");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    // TODO: Replace with actual API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        message: ""
      });
      
      setTimeout(() => setSubmitStatus(null), 5000);
    }, 1000);
  };

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
                  <Button variant="unstyled" className="text-sm font-medium h-9 ">
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

      <div className="container max-w-[1120px] px-6 py-12 sm:px-10">
        <div className="flex flex-wrap items-center justify-between gap-x-12 gap-y-2">
          <h1 className="font-primary text-[31px] font-bold">Contact Us</h1>
        </div>

        <div className="mt-8 space-y-8">
          <div>
            <p className="text-base font-normal text-dark-400">
              As-salamu alaykum! We're here to help and support the Ummah. Whether you have questions about our services, need technical assistance, or want to provide feedback, our team at Ummah Connect is ready to serve you.
            </p>
          </div>

          {/* Contact Form Section */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-dark-500 mb-2">
              Send Us a Message
            </h2>
            <p className="text-base text-dark-400 mb-6">
              Fill out the form below and we'll get back to you as soon as possible.
            </p>

            {submitStatus === "success" && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-medium">
                  ✓ Your message has been sent successfully! We'll get back to you soon, in sha Allah.
                </p>
              </div>
            )}

            {submitStatus === "error" && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 font-medium">
                  ⚠ Please fill in all required fields.
                </p>
              </div>
            )}

            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-dark-500 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter your first name"
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-dark-500 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-dark-500 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-dark-500 mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-vertical"
                  placeholder="How can we help you? Please provide as much detail as possible..."
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-3 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 focus:ring-4 focus:ring-primary-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="text-xl font-semibold text-dark-500">
                General Support
              </h2>
              <div className="mt-4 space-y-3">
                <div>
                  <p className="text-sm font-medium text-dark-500">Email:</p>
                  <Link
                    href="mailto:info@ummahconnect.online"
                    className="text-base text-status-blue underline"
                  >
                    info@ummahconnect.online
                  </Link>
                </div>
                <div>
                  <p className="text-sm font-medium text-dark-500">
                    For general inquiries, account questions, and platform guidance
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-dark-500">
                    Response Time:
                  </p>
                  <p className="text-base text-dark-400">
                    Within 24-48 hours (excluding Fridays and Islamic holidays)
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="text-xl font-semibold text-dark-500">
                Technical Support
              </h2>
              <div className="mt-4 space-y-3">
                <div>
                  <p className="text-sm font-medium text-dark-500">Email:</p>
                  <Link
                    href="mailto:support@ummahconnect.online"
                    className="text-base text-status-blue underline"
                  >
                    support@ummahconnect.online
                  </Link>
                </div>
                <div>
                  <p className="text-sm font-medium text-dark-500">
                    For technical issues, bugs, app problems, or website errors
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
            <h2 className="text-xl font-semibold text-dark-500">
              Office Address
            </h2>
            <p className="mt-4 text-base text-dark-400">
              Ummah Connect
              <br />
              Dubai, United Arab Emirates
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-dark-500">
              Before You Contact Us
            </h2>
            <p className="mt-4 text-base text-dark-400">
              Please check our{" "}
              <Link href="/faq" className="text-status-blue underline">
                FAQ page
              </Link>{" "}
              and{" "}
              <Link href="/help-center" className="text-status-blue underline">
                Help Center
              </Link>{" "}
              for quick answers to common questions. You might find the solution you're looking for immediately, in sha Allah!
            </p>
          </div>

          <div className="rounded-lg bg-primary-50 p-6">
            <h3 className="text-lg font-semibold text-dark-500">
              Your Feedback Matters
            </h3>
            <p className="mt-2 text-base text-dark-400">
              We continuously strive to improve Ummah Connect to better serve the Muslim community. Your suggestions and feedback help us grow. JazakAllahu khayran for taking the time to share your thoughts!
            </p>
          </div>

          <div className="rounded-lg border-2 border-primary-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-dark-500 mb-3">
              🕌 Platform Hours
            </h3>
            <p className="text-base text-dark-400">
              Our support team operates Sunday through Thursday, with reduced hours on Fridays. We observe major Islamic holidays. During Ramadan, our response times may be slightly longer as team members fulfill their religious obligations.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactUsPage;