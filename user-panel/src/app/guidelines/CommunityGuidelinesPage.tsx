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

const CommunityGuidelinesPage = () => {
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
          <h1 className="font-primary text-[31px] font-bold">
            UmmahConnect Community Guidelines
          </h1>
        </div>

        <div className="mt-8 rounded-lg bg-primary-50 border border-primary-200 p-6">
          <h2 className="text-2xl font-semibold text-dark-500 mb-3">Our Purpose</h2>
          <p className="text-base text-dark-400">
            UmmahConnect exists to connect the Muslim Ummah through beneficial, halal, and ethical services. We aim to create a safe, respectful, and trustworthy environment grounded in Islamic values, professionalism, and mutual respect. All users — buyers, sellers, and visitors — are expected to uphold these principles.
          </p>
        </div>

        <ol className="ml-4 mt-8 space-y-8 [&>li]:list-outside [&>li]:list-decimal">
          <li>
            <h2 className="text-xl font-semibold text-dark-500 mb-3">
              Islamic Conduct & Respect (Adab)
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
          </li>

          <li>
            <h2 className="text-xl font-semibold text-dark-500 mb-3">
              Halal & Ethical Services Only
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
          </li>

          <li>
            <h2 className="text-xl font-semibold text-dark-500 mb-3">
              Honesty & Transparency
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
          </li>

          <li>
            <h2 className="text-xl font-semibold text-dark-500 mb-3">
              Professional Conduct
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
          </li>

          <li>
            <h2 className="text-xl font-semibold text-dark-500 mb-3">
              Privacy & Boundaries
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
          </li>

          <li>
            <h2 className="text-xl font-semibold text-dark-500 mb-3">
              No Hate, Extremism, or Sectarian Abuse
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
          </li>

          <li>
            <h2 className="text-xl font-semibold text-dark-500 mb-3">
              No Scams or Platform Abuse
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
          </li>

          <li>
            <h2 className="text-xl font-semibold text-dark-500 mb-3">
              Content Standards
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
          </li>

          <li>
            <h2 className="text-xl font-semibold text-dark-500 mb-3">
              Reporting & Enforcement
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
          </li>

          <li>
            <h2 className="text-xl font-semibold text-dark-500 mb-3">
              Final Principle
            </h2>
            <div className="rounded-lg bg-gray-50 border border-gray-200 p-4 mb-3">
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
          </li>
        </ol>

        <div className="mt-12 rounded-lg bg-primary-100 border-2 border-primary-300 p-6 text-center">
          <p className="text-lg text-dark-500 font-medium">
            May Allah place barakah in this platform and make it a means of benefit for the Ummah.
          </p>
          <p className="text-base text-dark-400 mt-2">Ameen</p>
        </div>

        <div className="mt-8 rounded-lg bg-white border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-dark-500 mb-3">
            Questions or Concerns?
          </h3>
          <p className="text-base text-dark-400">
            If you have questions about these guidelines or need to report a violation, please contact us at{" "}
            <Link href="mailto:safety@ummahconnect.io" className="text-status-blue underline">
              safety@ummahconnect.io
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