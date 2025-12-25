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
import { useEffect } from "react";
import ProfileMenuButton from "@/features/app/components/ProfileMenuButton";
import Button from "@/components/base/Button";
import { NAV_LOGO_SRC } from "@/lib/constants";

const HelpCenterPage = () => {
  const { isAuthenticated } = useAuthState();
  const {
    setShowNavDrawer,
    setShowNotificationsModal,
    setShowNotLoggedInNavModal,
  } = useAppState();

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

  const helpCategories = [
    {
      title: "Getting Started",
      icon: "🚀",
      // topics: [
      //   { name: "Creating Your Account", link: "#create-account" },
      //   { name: "Setting Up Your Profile", link: "#setup-profile" },
      //   { name: "Navigating the Platform", link: "#navigation" },
      //   { name: "Understanding Service Categories", link: "#categories" },
      // ],
    },
    {
      title: "Finding Services",
      icon: "🔍",
      // topics: [
      //   { name: "Browsing Islamic Services", link: "#browse-services" },
      //   { name: "Searching for Specific Skills", link: "#search" },
      //   { name: "Understanding Seller Profiles", link: "#seller-profiles" },
      //   { name: "Reading Reviews & Ratings", link: "#reviews" },
      // ],
    },
    {
      title: "Placing Orders",
      icon: "📝",
      // topics: [
      //   { name: "How to Order a Service", link: "#order-service" },
      //   { name: "Messaging Sellers", link: "#message-sellers" },
      //   { name: "Payment Methods & Security", link: "#payments" },
      //   { name: "Custom Orders & Requirements", link: "#custom-orders" },
      // ],
    },
    {
      title: "Becoming a Service Provider",
      icon: "💼",
      // topics: [
      //   { name: "Seller Registration", link: "#seller-registration" },
      //   { name: "Creating Your First Gig", link: "#create-gig" },
      //   { name: "Setting Prices & Packages", link: "#pricing" },
      //   { name: "Islamic Credentials Verification", link: "#credentials" },
      // ],
    },
    {
      title: "Islamic Learning Services",
      icon: "📖",
      // topics: [
      //   { name: "Quran Tutoring & Memorization", link: "#quran-tutoring" },
      //   { name: "Arabic Language Classes", link: "#arabic-classes" },
      //   { name: "Islamic Studies & Fiqh", link: "#islamic-studies" },
      //   { name: "Scheduling Live Sessions", link: "#live-sessions" },
      // ],
    },
    {
      title: "Professional Services",
      icon: "💻",
      // topics: [
      //   { name: "Islamic Finance Consulting", link: "#islamic-finance" },
      //   { name: "Halal Business Advice", link: "#halal-business" },
      //   { name: "Islamic Content & Translation", link: "#content" },
      //   { name: "Halal Design & Development", link: "#design-dev" },
      // ],
    },
    {
      title: "Orders & Delivery",
      icon: "✅",
      // topics: [
      //   { name: "Tracking Your Order", link: "#track-order" },
      //   { name: "Delivery Timeframes", link: "#delivery-time" },
      //   { name: "Requesting Revisions", link: "#revisions" },
      //   { name: "Completing & Reviewing Orders", link: "#complete-order" },
      // ],
    },
    {
      title: "Payments & Earnings",
      icon: "💰",
      // topics: [
      //   { name: "How Payments Work", link: "#payment-process" },
      //   { name: "Seller Fees & Commissions", link: "#seller-fees" },
      //   { name: "Withdrawing Earnings", link: "#withdrawals" },
      //   { name: "Refund Policy", link: "#refunds" },
      // ],
    },
    {
      title: "Account Management",
      icon: "⚙️",
      // topics: [
      //   { name: "Profile Settings", link: "#profile-settings" },
      //   { name: "Notification Preferences", link: "#notifications" },
      //   { name: "Privacy & Security", link: "#privacy" },
      //   { name: "Closing Your Account", link: "#close-account" },
      // ],
    },
    {
      title: "Islamic Guidelines",
      icon: "🕌",
      // topics: [
      //   { name: "Platform Islamic Values", link: "#islamic-values" },
      //   { name: "Halal Service Standards", link: "#halal-standards" },
      //   { name: "Prayer Time Accommodations", link: "#prayer-times" },
      //   { name: "Ramadan & Holiday Policies", link: "#ramadan" },
      // ],
    },
    {
      title: "Trust & Safety",
      icon: "🛡️",
      // topics: [
      //   { name: "Community Guidelines", link: "#community-guidelines" },
      //   { name: "Reporting Issues", link: "#report-issues" },
      //   { name: "Dispute Resolution", link: "#disputes" },
      //   { name: "Fraud Prevention", link: "#fraud-prevention" },
      // ],
    },
    {
      title: "Technical Support",
      icon: "🔧",
      // topics: [
      //   { name: "App & Website Issues", link: "#technical-issues" },
      //   { name: "Browser Compatibility", link: "#browser" },
      //   { name: "Login Problems", link: "#login-problems" },
      //   { name: "Report a Bug", link: "#report-bug" },
      // ],
    },
  ];

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
          <h1 className="font-primary text-[31px] font-bold">Help Center</h1>
        </div>

        <p className="mt-4 text-base text-dark-400">
          As-salamu alaykum! Welcome to the Ummah Connect Help Center. Browse our comprehensive guides to get the most out of your Islamic service marketplace experience.
        </p>


        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {helpCategories.map((category, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-gray-200 bg-white p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{category.icon}</span>
                <h2 className="text-xl font-semibold text-dark-500">
                  {category.title}
                </h2>
              </div>
              {/* <ul className="space-y-2">
                {category.topics.map((topic, topicIdx) => (
                  <li key={topicIdx}>
                    <Link
                      href={topic.link}
                      className="text-base text-dark-400 hover:text-status-blue hover:underline transition-colors"
                    >
                      {topic.name}
                    </Link>
                  </li>
                ))}
              </ul> */}
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg bg-primary-50 p-6">
            <h3 className="text-xl font-semibold text-dark-500 mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/faq"
                  className="text-base text-status-blue hover:underline"
                >
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link
                  href="/contact-us"
                  className="text-base text-status-blue hover:underline"
                >
                  Contact Support
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-base text-status-blue hover:underline"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-base text-status-blue hover:underline"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/community-guidelines"
                  className="text-base text-status-blue hover:underline"
                >
                  Community Guidelines
                </Link>
              </li>
            </ul>
          </div>

          <div className="rounded-lg bg-gray-50 p-6">
            <h3 className="text-xl font-semibold text-dark-500 mb-3">
              Need More Help?
            </h3>
            <p className="text-base text-dark-400 mb-4">
              Can't find what you're looking for? Our support team is ready to assist you.
            </p>
            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium text-dark-500">Email:</p>
                <Link
                  href="mailto:support@ummahconnect.io"
                  className="text-base text-status-blue underline"
                >
                  support@ummahconnect.io
                </Link>
              </div>
              <div>
                <p className="text-sm font-medium text-dark-500">
                  Response Time:
                </p>
                <p className="text-base text-dark-400">Within 24-48 hours</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="text-xl font-semibold text-dark-500 mb-3">
              Popular Topics
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium text-dark-500 mb-2">For Buyers:</h4>
                <ul className="space-y-1 text-dark-400">
                  <li>• How to find qualified Quran tutors</li>
                  <li>• Understanding seller credentials</li>
                  <li>• Scheduling live Islamic lessons</li>
                  <li>• Getting refunds for services</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-dark-500 mb-2">For Sellers:</h4>
                <ul className="space-y-1 text-dark-400">
                  <li>• Creating compelling service listings</li>
                  <li>• Pricing your Islamic services</li>
                  <li>• Getting verified credentials</li>
                  <li>• Managing Ramadan schedule</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="rounded-lg border-2 border-primary-200 bg-primary-50 p-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">📚</span>
              <div>
                <h3 className="text-xl font-semibold text-dark-500 mb-2">
                  Islamic Learning Resources
                </h3>
                <p className="text-base text-dark-400">
                  Ummah Connect is committed to facilitating authentic Islamic knowledge. All Islamic education service providers are vetted for their credentials and adherence to authentic sources. We encourage learners to verify their teacher's qualifications and always seek knowledge with sincerity and adab (Islamic etiquette).
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-gray-50 p-6">
            <h3 className="text-xl font-semibold text-dark-500 mb-3">
              Community Values
            </h3>
            <p className="text-base text-dark-400 mb-3">
              Ummah Connect is built on Islamic principles of trust, honesty, and excellence. We encourage all community members to:
            </p>
            <ul className="space-y-2 text-dark-400">
              <li>• Conduct transactions with integrity and transparency</li>
              <li>• Communicate with respect and Islamic etiquette</li>
              <li>• Deliver services with ihsan (excellence)</li>
              <li>• Resolve disputes with wisdom and fairness</li>
              <li>• Support fellow Muslims in their growth and development</li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HelpCenterPage;