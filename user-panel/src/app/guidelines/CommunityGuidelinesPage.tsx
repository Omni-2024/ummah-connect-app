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

const CommunityGuidelinesPage = () => {
  const { isAuthenticated } = useAuthState();
  const {
    setShowNavDrawer,
    setShowNotificationsModal,
    setShowNotLoggedInNavModal,
  } = useAppState();

  const [activeTab, setActiveTab] = useState("community");

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

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
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
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-x-12 gap-y-2">
          <h1 className="font-primary text-[31px] font-bold">
            UmmahConnect Guidelines
          </h1>
        </div>

        {/* Tab Navigation */}
        <div className="mt-8 border-b border-gray-200">
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab("community")}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "community"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              Community Guidelines
            </button>
            <button
              onClick={() => setActiveTab("service-delivery")}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "service-delivery"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              Service Delivery Guidelines
            </button>
          </div>
        </div>

        {/* Community Guidelines Content */}
        {activeTab === "community" && (
          <div className="mt-8">
            {/* Quick Navigation */}
            <div className="mb-8 rounded-lg bg-gray-50 border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-dark-500 mb-4">Quick Navigation</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <button
                  onClick={() => scrollToSection("islamic-conduct")}
                  className="text-left text-sm text-primary-600 hover:text-primary-700 hover:underline"
                >
                  1. Islamic Conduct & Respect
                </button>
                <button
                  onClick={() => scrollToSection("halal-services")}
                  className="text-left text-sm text-primary-600 hover:text-primary-700 hover:underline"
                >
                  2. Halal & Ethical Services
                </button>
                <button
                  onClick={() => scrollToSection("honesty")}
                  className="text-left text-sm text-primary-600 hover:text-primary-700 hover:underline"
                >
                  3. Honesty & Transparency
                </button>
                <button
                  onClick={() => scrollToSection("professional")}
                  className="text-left text-sm text-primary-600 hover:text-primary-700 hover:underline"
                >
                  4. Professional Conduct
                </button>
                <button
                  onClick={() => scrollToSection("privacy")}
                  className="text-left text-sm text-primary-600 hover:text-primary-700 hover:underline"
                >
                  5. Privacy & Boundaries
                </button>
                <button
                  onClick={() => scrollToSection("no-hate")}
                  className="text-left text-sm text-primary-600 hover:text-primary-700 hover:underline"
                >
                  6. No Hate or Extremism
                </button>
                <button
                  onClick={() => scrollToSection("no-scams")}
                  className="text-left text-sm text-primary-600 hover:text-primary-700 hover:underline"
                >
                  7. No Scams or Abuse
                </button>
                <button
                  onClick={() => scrollToSection("content-standards")}
                  className="text-left text-sm text-primary-600 hover:text-primary-700 hover:underline"
                >
                  8. Content Standards
                </button>
                <button
                  onClick={() => scrollToSection("reporting")}
                  className="text-left text-sm text-primary-600 hover:text-primary-700 hover:underline"
                >
                  9. Reporting & Enforcement
                </button>
              </div>
            </div>

            {/* Purpose */}
            <div className="rounded-lg bg-primary-50 border border-primary-200 p-6">
              <h2 className="text-2xl font-semibold text-dark-500 mb-3">Our Purpose</h2>
              <p className="text-base text-dark-400">
                UmmahConnect exists to connect the Muslim Ummah through beneficial, halal, and ethical services. We aim to create a safe, respectful, and trustworthy environment grounded in Islamic values, professionalism, and mutual respect. All users — buyers, sellers, and visitors — are expected to uphold these principles.
              </p>
            </div>

            <div className="mt-8 space-y-8">
              {/* Section 1 */}
              <div id="islamic-conduct" className="scroll-mt-24 rounded-lg border border-gray-200 p-6 hover:border-primary-200 transition-colors">
                <h2 className="text-xl font-semibold text-dark-500 mb-3">
                  1. Islamic Conduct & Respect (Adab)
                </h2>
                <p className="text-base text-dark-400 mb-3">
                  All interactions on UmmahConnect must reflect good character (akhlaq).
                </p>
                <p className="text-base text-dark-400 mb-2">You must:</p>
                <ul className="ml-6 space-y-1 text-base text-dark-400 [&>li]:list-outside [&>li]:list-disc">
                  <li>Speak respectfully and kindly to others</li>
                  <li>Avoid insults, mockery, sarcasm, or abusive language</li>
                  <li>Avoid backbiting (ghībah), slander, or spreading rumors</li>
                  <li>Respect differences of opinion within Islamic boundaries</li>
                </ul>
                <p className="text-base text-dark-400 mt-3">
                  Harassment, intimidation, or degrading speech will not be tolerated.
                </p>
              </div>

              {/* Section 2 */}
              <div id="halal-services" className="scroll-mt-24 rounded-lg border border-gray-200 p-6 hover:border-primary-200 transition-colors">
                <h2 className="text-xl font-semibold text-dark-500 mb-3">
                  2. Halal & Ethical Services Only
                </h2>
                <p className="text-base text-dark-400 mb-3">
                  All services offered on UmmahConnect must be halal and ethical.
                </p>
                <p className="text-base text-dark-400 mb-2">The following are strictly prohibited:</p>
                <ul className="ml-6 space-y-1 text-base text-dark-400 [&>li]:list-outside [&>li]:list-disc">
                  <li>Haram services (e.g. magic, fortune-telling, black magic, astrology)</li>
                  <li>Deceptive or fraudulent services</li>
                  <li>Promotion of riba, gambling, pornography, drugs, or illegal activities</li>
                  <li>Impersonation of scholars, professionals, or organizations</li>
                </ul>
                <p className="text-base text-dark-400 mt-3">
                  If a service contradicts Islamic principles, it may be removed without notice.
                </p>
              </div>

              {/* Section 3 */}
              <div id="honesty" className="scroll-mt-24 rounded-lg border border-gray-200 p-6 hover:border-primary-200 transition-colors">
                <h2 className="text-xl font-semibold text-dark-500 mb-3">
                  3. Honesty & Transparency
                </h2>
                <p className="text-base text-dark-400 mb-3">
                  Trust is the foundation of UmmahConnect.
                </p>
                <p className="text-base text-dark-400 mb-2">Users must:</p>
                <ul className="ml-6 space-y-1 text-base text-dark-400 [&>li]:list-outside [&>li]:list-disc">
                  <li>Accurately describe their services and qualifications</li>
                  <li>Deliver services as promised</li>
                  <li>Communicate clearly and honestly</li>
                  <li>Avoid misleading claims or guarantees</li>
                </ul>
                <p className="text-base text-dark-400 mt-3">
                  False claims, exaggeration, or misrepresentation may lead to account suspension.
                </p>
              </div>

              {/* Section 4 */}
              <div id="professional" className="scroll-mt-24 rounded-lg border border-gray-200 p-6 hover:border-primary-200 transition-colors">
                <h2 className="text-xl font-semibold text-dark-500 mb-3">
                  4. Professional Conduct
                </h2>
                <p className="text-base text-dark-400 mb-3">
                  All users are expected to act professionally.
                </p>
                <p className="text-base text-dark-400 mb-2">This includes:</p>
                <ul className="ml-6 space-y-1 text-base text-dark-400 [&>li]:list-outside [&>li]:list-disc">
                  <li>Respecting agreed timelines</li>
                  <li>Clear and polite communication</li>
                  <li>Fair dispute handling</li>
                  <li>No pressure, manipulation, or guilt-based selling</li>
                </ul>
                <p className="text-base text-dark-400 mt-3">
                  Disagreements should be handled calmly and respectfully.
                </p>
              </div>

              {/* Section 5 */}
              <div id="privacy" className="scroll-mt-24 rounded-lg border border-gray-200 p-6 hover:border-primary-200 transition-colors">
                <h2 className="text-xl font-semibold text-dark-500 mb-3">
                  5. Privacy & Boundaries
                </h2>
                <p className="text-base text-dark-400 mb-3">
                  Users must respect personal and private boundaries.
                </p>
                <p className="text-base text-dark-400 mb-2">You must not:</p>
                <ul className="ml-6 space-y-1 text-base text-dark-400 [&>li]:list-outside [&>li]:list-disc">
                  <li>Share private conversations without consent</li>
                  <li>Request unnecessary personal information</li>
                  <li>Harass users outside the platform</li>
                  <li>Attempt to bypass UmmahConnect's systems for personal gain</li>
                </ul>
              </div>

              {/* Section 6 */}
              <div id="no-hate" className="scroll-mt-24 rounded-lg border border-gray-200 p-6 hover:border-primary-200 transition-colors">
                <h2 className="text-xl font-semibold text-dark-500 mb-3">
                  6. No Hate, Extremism, or Sectarian Abuse
                </h2>
                <p className="text-base text-dark-400 mb-3">
                  UmmahConnect is for the entire Muslim Ummah.
                </p>
                <p className="text-base text-dark-400 mb-2">We do not allow:</p>
                <ul className="ml-6 space-y-1 text-base text-dark-400 [&>li]:list-outside [&>li]:list-disc">
                  <li>Hate speech of any kind</li>
                  <li>Sectarian attacks or inflammatory religious arguments</li>
                  <li>Political extremism or incitement to violence</li>
                  <li>Racism, nationalism, or tribalism</li>
                </ul>
                <p className="text-base text-dark-400 mt-3">
                  Differences should be discussed with wisdom (ḥikmah) and respect.
                </p>
              </div>

              {/* Section 7 */}
              <div id="no-scams" className="scroll-mt-24 rounded-lg border border-gray-200 p-6 hover:border-primary-200 transition-colors">
                <h2 className="text-xl font-semibold text-dark-500 mb-3">
                  7. No Scams or Platform Abuse
                </h2>
                <p className="text-base text-dark-400 mb-2">The following are prohibited:</p>
                <ul className="ml-6 space-y-1 text-base text-dark-400 [&>li]:list-outside [&>li]:list-disc">
                  <li>Scamming or attempting to defraud users</li>
                  <li>Fake reviews or ratings</li>
                  <li>Manipulating the system</li>
                  <li>Circumventing fees or payments</li>
                  <li>Creating multiple accounts to deceive others</li>
                </ul>
                <p className="text-base text-dark-400 mt-3">
                  Such actions may result in permanent removal.
                </p>
              </div>

              {/* Section 8 */}
              <div id="content-standards" className="scroll-mt-24 rounded-lg border border-gray-200 p-6 hover:border-primary-200 transition-colors">
                <h2 className="text-xl font-semibold text-dark-500 mb-3">
                  8. Content Standards
                </h2>
                <p className="text-base text-dark-400 mb-2">
                  All content (profiles, services, messages, media) must:
                </p>
                <ul className="ml-6 space-y-1 text-base text-dark-400 [&>li]:list-outside [&>li]:list-disc">
                  <li>Be appropriate and modest</li>
                  <li>Avoid explicit, vulgar, or offensive material</li>
                  <li>Avoid misleading religious claims</li>
                  <li>Be relevant to the service offered</li>
                </ul>
                <p className="text-base text-dark-400 mt-3">
                  UmmahConnect reserves the right to remove content that violates these standards.
                </p>
              </div>

              {/* Section 9 */}
              <div id="reporting" className="scroll-mt-24 rounded-lg border border-gray-200 p-6 hover:border-primary-200 transition-colors">
                <h2 className="text-xl font-semibold text-dark-500 mb-3">
                  9. Reporting & Enforcement
                </h2>
                <p className="text-base text-dark-400 mb-2">Users are encouraged to report:</p>
                <ul className="ml-6 space-y-1 text-base text-dark-400 [&>li]:list-outside [&>li]:list-disc">
                  <li>Misconduct</li>
                  <li>Haram services</li>
                  <li>Abuse or scams</li>
                  <li>Violations of these guidelines</li>
                </ul>
                <p className="text-base text-dark-400 mt-3 mb-2">We may take action including:</p>
                <ul className="ml-6 space-y-1 text-base text-dark-400 [&>li]:list-outside [&>li]:list-disc">
                  <li>Content removal</li>
                  <li>Warnings</li>
                  <li>Temporary suspension</li>
                  <li>Permanent account termination</li>
                </ul>
                <p className="text-base text-dark-400 mt-3">
                  Decisions are made to protect the Ummah and platform integrity.
                </p>
              </div>

              {/* Final Principle */}
              <div className="rounded-lg border-2 border-primary-300 bg-primary-50 p-6">
                <h2 className="text-xl font-semibold text-dark-500 mb-3">
                  Final Principle
                </h2>
                <div className="rounded-lg bg-white border border-gray-200 p-4 mb-3">
                  <p className="text-lg text-dark-500 font-medium text-center italic">
                    "The believer is one from whom people's lives and wealth are safe."
                  </p>
                </div>
                <p className="text-base text-dark-400 mb-2">
                  By using UmmahConnect, you agree to uphold:
                </p>
                <ul className="ml-6 space-y-1 text-base text-dark-400 [&>li]:list-outside [&>li]:list-disc">
                  <li>Trust (Amānah)</li>
                  <li>Sincerity (Ikhlāṣ)</li>
                  <li>Justice (ʿAdl)</li>
                  <li>Excellence (Iḥsān)</li>
                </ul>
              </div>
            </div>

            <div className="mt-12 rounded-lg bg-primary-100 border-2 border-primary-300 p-6 text-center">
              <p className="text-lg text-dark-500 font-medium">
                May Allah place barakah in this platform and make it a means of benefit for the Ummah.
              </p>
              <p className="text-base text-dark-400 mt-2">Ameen</p>
            </div>
          </div>
        )}

        {/* Service Delivery Guidelines Content */}
        {activeTab === "service-delivery" && (
          <div className="mt-8">
            {/* Quick Navigation */}
            <div className="mb-8 rounded-lg bg-gray-50 border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-dark-500 mb-4">Quick Navigation</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <button
                  onClick={() => scrollToSection("approved-methods")}
                  className="text-left text-sm text-primary-600 hover:text-primary-700 hover:underline"
                >
                  1. Approved Delivery Methods
                </button>
                <button
                  onClick={() => scrollToSection("not-allowed")}
                  className="text-left text-sm text-primary-600 hover:text-primary-700 hover:underline"
                >
                  2. What Is Not Allowed
                </button>
                <button
                  onClick={() => scrollToSection("proof-delivery")}
                  className="text-left text-sm text-primary-600 hover:text-primary-700 hover:underline"
                >
                  3. Proof of Delivery
                </button>
                <button
                  onClick={() => scrollToSection("live-sessions")}
                  className="text-left text-sm text-primary-600 hover:text-primary-700 hover:underline"
                >
                  4. Live Sessions & Lessons
                </button>
                <button
                  onClick={() => scrollToSection("digital-products")}
                  className="text-left text-sm text-primary-600 hover:text-primary-700 hover:underline"
                >
                  5. Digital Products
                </button>
                <button
                  onClick={() => scrollToSection("off-platform")}
                  className="text-left text-sm text-primary-600 hover:text-primary-700 hover:underline"
                >
                  6. Off-Platform Disclaimer
                </button>
                <button
                  onClick={() => scrollToSection("ethical-conduct")}
                  className="text-left text-sm text-primary-600 hover:text-primary-700 hover:underline"
                >
                  7. Ethical Conduct
                </button>
                <button
                  onClick={() => scrollToSection("enforcement")}
                  className="text-left text-sm text-primary-600 hover:text-primary-700 hover:underline"
                >
                  8. Platform Enforcement
                </button>
                <button
                  onClick={() => scrollToSection("payment-guidelines")}
                  className="text-left text-sm text-primary-600 hover:text-primary-700 hover:underline"
                >
                  Payment Guidelines
                </button>
              </div>
            </div>

            {/* Introduction */}
            <div className="rounded-lg bg-primary-50 border border-primary-200 p-6 mb-8">
              <h2 className="text-2xl font-semibold text-dark-500 mb-3">For Freelancers & Clients</h2>
              <p className="text-base text-dark-400">
                These guidelines ensure safety, transparency, and protection for all users on UmmahConnect.
              </p>
            </div>

            <div className="space-y-8">
              {/* Section 1 */}
              <div id="approved-methods" className="scroll-mt-24 rounded-lg border border-gray-200 p-6 hover:border-primary-200 transition-colors">
                <h2 className="text-xl font-semibold text-dark-500 mb-4">
                  1. Approved Methods of Service Delivery
                </h2>
                <p className="text-base text-dark-400 mb-4">
                  To ensure safety, transparency, and protection for all users, services on UmmahConnect must be delivered using approved methods only.
                </p>

                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-dark-500 mb-2">
                      🔹 Live Services (Teaching, Consulting, Coaching)
                    </h3>
                    <ul className="ml-6 space-y-1 text-base text-dark-400 [&>li]:list-outside [&>li]:list-disc">
                      <li>Zoom</li>
                      <li>Microsoft Teams</li>
                      <li>Other approved video conferencing platforms (where agreed)</li>
                    </ul>
                    <p className="text-sm text-dark-400 mt-3">
                      All sessions should be scheduled through UmmahConnect and delivered as agreed in the service description.
                    </p>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-dark-500 mb-2">
                      🔹 Digital Services (Design, Writing, Media, IT, etc.)
                    </h3>
                    <p className="text-base text-dark-400 mb-2">Delivery through:</p>
                    <ul className="ml-6 space-y-1 text-base text-dark-400 [&>li]:list-outside [&>li]:list-disc">
                      <li>UmmahConnect's built-in chat system, or</li>
                      <li>Verified and trusted email addresses agreed within the platform</li>
                    </ul>
                    <p className="text-base text-dark-400 mt-3 mb-2">Examples:</p>
                    <ul className="ml-6 space-y-1 text-base text-dark-400 [&>li]:list-outside [&>li]:list-disc">
                      <li>Graphic design files</li>
                      <li>Documents & PDFs</li>
                      <li>Videos</li>
                      <li>Code or website files</li>
                      <li>Written work</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Section 2 */}
              <div id="not-allowed" className="scroll-mt-24 rounded-lg border border-gray-200 p-6 hover:border-primary-200 transition-colors">
                <h2 className="text-xl font-semibold text-dark-500 mb-3">
                  2. What Is Not Allowed
                </h2>
                <p className="text-base text-dark-400 mb-3">
                  To protect all users and maintain platform integrity:
                </p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-base text-dark-500 font-medium mb-2">Services must NOT be delivered through:</p>
                  <ul className="ml-6 space-y-1 text-base text-dark-400 [&>li]:list-outside [&>li]:list-disc">
                    <li>Personal messaging apps (WhatsApp, Telegram, Instagram, etc.)</li>
                    <li>Unverified or private file-sharing links</li>
                    <li>External means used to bypass UmmahConnect</li>
                    <li>In-person meetings arranged outside the platform</li>
                  </ul>
                </div>
                <p className="text-base text-dark-400 mt-4 font-medium">
                  Any delivery outside approved channels is done at the user's own risk and is not protected by UmmahConnect.
                </p>
              </div>

              {/* Section 3 */}
              <div id="proof-delivery" className="scroll-mt-24 rounded-lg border border-gray-200 p-6 hover:border-primary-200 transition-colors">
                <h2 className="text-xl font-semibold text-dark-500 mb-3">
                  3. Proof of Delivery
                </h2>
                <p className="text-base text-dark-400 mb-2">Freelancers are responsible for:</p>
                <ul className="ml-6 space-y-1 text-base text-dark-400 [&>li]:list-outside [&>li]:list-disc">
                  <li>Clearly delivering the agreed service</li>
                  <li>Providing files, links, or session confirmation</li>
                  <li>Keeping communication within the platform where possible</li>
                </ul>
                <p className="text-base text-dark-400 mt-3 mb-2">This ensures:</p>
                <ul className="ml-6 space-y-1 text-base text-dark-400 [&>li]:list-outside [&>li]:list-disc">
                  <li>Payment protection</li>
                  <li>Fair dispute resolution</li>
                  <li>Transparent record keeping</li>
                </ul>
              </div>

              {/* Section 4 */}
              <div id="live-sessions" className="scroll-mt-24 rounded-lg border border-gray-200 p-6 hover:border-primary-200 transition-colors">
                <h2 className="text-xl font-semibold text-dark-500 mb-3">
                  4. Live Sessions & Lessons
                </h2>
                <p className="text-base text-dark-400 mb-2">
                  For live services (e.g. Arabic lessons, tutoring, counselling):
                </p>
                <ul className="ml-6 space-y-1 text-base text-dark-400 [&>li]:list-outside [&>li]:list-disc">
                  <li>Sessions should be conducted via Zoom or Microsoft Teams</li>
                  <li>Start and end times should be respected</li>
                  <li>Recording is only allowed with mutual consent</li>
                  <li>Missed sessions without valid reason may be considered delivered</li>
                </ul>
              </div>

              {/* Section 5 */}
              <div id="digital-products" className="scroll-mt-24 rounded-lg border border-gray-200 p-6 hover:border-primary-200 transition-colors">
                <h2 className="text-xl font-semibold text-dark-500 mb-3">
                  5. Digital Products & Creative Work
                </h2>
                <p className="text-base text-dark-400 mb-2">For services such as:</p>
                <ul className="ml-6 space-y-1 text-base text-dark-400 [&>li]:list-outside [&>li]:list-disc mb-3">
                  <li>Graphic design</li>
                  <li>Video editing</li>
                  <li>Writing & publishing</li>
                  <li>Website or software work</li>
                </ul>
                <p className="text-base text-dark-400 mb-2">Delivery must:</p>
                <ul className="ml-6 space-y-1 text-base text-dark-400 [&>li]:list-outside [&>li]:list-disc">
                  <li>Match the agreed service description</li>
                  <li>Be submitted in usable format</li>
                  <li>Be delivered through approved channels only</li>
                </ul>
                <p className="text-base text-dark-400 mt-3">
                  Revisions (if included) must follow the service terms.
                </p>
              </div>

              {/* Section 6 */}
              <div id="off-platform" className="scroll-mt-24 rounded-lg border border-gray-200 p-6 hover:border-primary-200 transition-colors">
                <h2 className="text-xl font-semibold text-dark-500 mb-3">
                  6. Off-Platform Delivery Disclaimer
                </h2>
                <p className="text-base text-dark-400 mb-2">If a buyer or freelancer chooses to:</p>
                <ul className="ml-6 space-y-1 text-base text-dark-400 [&>li]:list-outside [&>li]:list-disc mb-3">
                  <li>Communicate outside the platform</li>
                  <li>Deliver work outside approved channels</li>
                  <li>Arrange services privately</li>
                </ul>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-base text-dark-500 font-medium mb-2">Then:</p>
                  <ul className="ml-6 space-y-1 text-base text-dark-400 [&>li]:list-outside [&>li]:list-disc">
                    <li>UmmahConnect is not responsible for the outcome</li>
                    <li>Dispute protection may not apply</li>
                    <li>Refund eligibility may be lost</li>
                  </ul>
                </div>
              </div>

              {/* Section 7 */}
              <div id="ethical-conduct" className="scroll-mt-24 rounded-lg border border-gray-200 p-6 hover:border-primary-200 transition-colors">
                <h2 className="text-xl font-semibold text-dark-500 mb-3">
                  7. Ethical & Islamic Conduct
                </h2>
                <p className="text-base text-dark-400 mb-2">All services must be delivered with:</p>
                <ul className="ml-6 space-y-1 text-base text-dark-400 [&>li]:list-outside [&>li]:list-disc">
                  <li>Honesty and professionalism</li>
                  <li>Respect and modesty</li>
                  <li>Fulfilment of agreements (Amānah)</li>
                </ul>
                <p className="text-base text-dark-400 mt-3 font-medium">
                  Deliberate misrepresentation or avoidance of delivery is a violation of Islamic ethics and platform rules.
                </p>
              </div>

              {/* Section 8 */}
              <div id="enforcement" className="scroll-mt-24 rounded-lg border border-gray-200 p-6 hover:border-primary-200 transition-colors">
                <h2 className="text-xl font-semibold text-dark-500 mb-3">
                  8. Platform Enforcement
                </h2>
                <p className="text-base text-dark-400 mb-2">
                  Failure to follow delivery guidelines may result in:
                </p>
                <ul className="ml-6 space-y-1 text-base text-dark-400 [&>li]:list-outside [&>li]:list-disc">
                  <li>Order cancellation</li>
                  <li>Loss of payment protection</li>
                  <li>Account warnings or suspension</li>
                  <li>Permanent removal in serious cases</li>
                </ul>
              </div>

              {/* Payment Guidelines Section */}
              <div id="payment-guidelines" className="scroll-mt-24 rounded-lg border-2 border-primary-300 bg-primary-50 p-6">
                <h2 className="text-2xl font-semibold text-dark-500 mb-4">
                  Freelancer Payment & Payout Guidelines
                </h2>

                <div className="space-y-4">
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <h3 className="text-lg font-semibold text-dark-500 mb-2">Payout Timing</h3>
                    <p className="text-base text-dark-400 mb-2">
                      Payment to freelancers will be issued within <strong>7 days</strong> of successful completion of the service ("gig").
                    </p>
                    <p className="text-base text-dark-400 mb-1">A service is considered completed once:</p>
                    <ul className="ml-6 space-y-1 text-base text-dark-400 [&>li]:list-outside [&>li]:list-disc">
                      <li>The freelancer has delivered the agreed work, and</li>
                      <li>The buyer has marked the order as complete, or the platform's automatic completion period has passed</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <h3 className="text-lg font-semibold text-dark-500 mb-2">Clearance Period</h3>
                    <p className="text-base text-dark-400 mb-1">The 7-day period serves as a standard clearance window to:</p>
                    <ul className="ml-6 space-y-1 text-base text-dark-400 [&>li]:list-outside [&>li]:list-disc">
                      <li>Confirm delivery</li>
                      <li>Resolve any immediate disputes</li>
                      <li>Ensure compliance with platform and payment-provider requirements</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <h3 className="text-lg font-semibold text-dark-500 mb-2">How Payment Is Released</h3>
                    <ul className="ml-6 space-y-1 text-base text-dark-400 [&>li]:list-outside [&>li]:list-disc">
                      <li>Funds are held securely in escrow via Stripe until completion</li>
                      <li>Once cleared, the freelancer's payout (after applicable platform fees) will be released to their registered payout account</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <h3 className="text-lg font-semibold text-dark-500 mb-2">Disputes and Delays</h3>
                    <ul className="ml-6 space-y-1 text-base text-dark-400 [&>li]:list-outside [&>li]:list-disc">
                      <li>If a dispute is raised before or during the 7-day window, payout may be temporarily paused until the matter is resolved</li>
                      <li>Delays may also occur in rare cases due to payment-provider checks or technical issues, but freelancers will be notified if this happens</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <h3 className="text-lg font-semibold text-dark-500 mb-2">Fees Applied to Payouts</h3>
                    <p className="text-base text-dark-400 mb-1">Upon successful completion:</p>
                    <ul className="ml-6 space-y-1 text-base text-dark-400 [&>li]:list-outside [&>li]:list-disc">
                      <li>UmmahConnect retains a <strong>20% platform commission</strong></li>
                      <li>A <strong>5% service/processing charge</strong> is applied to cover Stripe and operational costs</li>
                      <li>The remaining balance is paid to the freelancer</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contact Section */}
        <div className="mt-8 rounded-lg bg-white border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-dark-500 mb-3">
            Questions or Concerns?
          </h3>
          <p className="text-base text-dark-400">
            If you have questions about these guidelines or need to report a violation, please contact us at{" "}
            <Link href="mailto:support@ummahcommunity.com" className="text-status-blue underline">
              support@ummahcommunity.com
            </Link>
            . For general support, visit our{" "}
            <Link href="/help-center" className="text-status-blue underline">
              Help Center
            </Link>{" "}
            or{" "}
            <Link href="/contact-us" className="text-status-blue underline">
              Contact Us
            </Link>
            .
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CommunityGuidelinesPage;