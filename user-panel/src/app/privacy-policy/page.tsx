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

const PrivacyPolicyPage = () => {
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
        left={
          <Link href="/">
            <img
              alt="Ummah connect Logo"
              src="/images/logo.svg"
              className="w-20 cursor-pointer object-contain"
            />
          </Link>
        }
        right={
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <ComingSoonToolTip>
                  <IconButton size="lg" onClick={handleNotificationButton}>
                    <Notification className="text-dark-600" />
                  </IconButton>
                </ComingSoonToolTip>

                <ProfileMenuButton onClick={handleShowNavDrawer} />
              </>
            ) : (
              <IconButton size="lg" onClick={handleHamBurgerMenu}>
                <HambergerMenu className="text-dark-600" />
              </IconButton>
            )}
          </div>
        }
      />

      {/* TODO:: Temporary disabled until feature available */}
      <NotificationsModal disabled />
      <NavDrawerMobile />
      <NotLoggedInNavModal />

      <div className="container max-w-[1120px] px-6 py-12 sm:px-10">
        <div className="flex flex-wrap items-center justify-between gap-x-12 gap-y-2">
          <h1 className="font-primary text-[31px] font-bold">Privacy Policy</h1>
          <div>Effective Date: 24th Sep 2025</div>
        </div>

        <ol className="ml-4 mt-4 [&>li]:mt-8 [&>li]:list-outside [&>li]:list-decimal [&>li]:text-xl [&>li]:font-medium [&>li]:text-dark-500 [&>li_li]:mt-2 [&>li_li]:list-outside [&>li_li]:list-disc [&>li_ul>li>span]:text-dark-400 [&>li_ul]:mt-4 [&>li_ul]:text-base [&>li_ul]:font-normal [&>li_ul]:text-dark-500 [&_a]:text-status-blue [&_a]:underline [&_p]:mt-4 [&_p]:text-base [&_p]:font-normal [&_p]:text-dark-400">
          <li>
            <h2>Introduction</h2>
            <p>
              Welcome to Ummah connect! We are committed to protecting your
              personal information and ensuring your privacy. This Privacy
              Policy explains how we collect, use, disclose, and safeguard your
              information when you use our web app, Android app, and Google app
              (collectively referred to as the "Services"). By accessing or
              using our Services, you agree to the terms of this Privacy Policy.
            </p>
          </li>

          <li>
            <h2>Information We Collect</h2>
            <ul>
              <li>
                <b>Personal Information:</b>{" "}
                <span>
                  When you register for an account or use our Services, we may
                  collect personal information such as your name, email address,
                  and any other information you provide.
                </span>
              </li>
              <li>
                <b>Usage Data:</b>{" "}
                <span>
                  We may collect information about your interactions with our
                  Services, including your IP address, browser type, operating
                  system, pages visited, and other usage details.
                </span>
              </li>
              <li>
                <b>Device Information:</b>{" "}
                <span>
                  We may collect information about the device you use to access
                  our Services, including device type, unique device
                  identifiers, and mobile network information.
                </span>
              </li>
              <li>
                <b>Location Data:</b>{" "}
                <span>
                  With your consent, we may collect information about your
                  location when you use our Services.
                </span>
              </li>
            </ul>
          </li>

          <li>
            <h2>How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <div>
              <ul className="!mt-4 ml-8 !text-dark-400">
                <li>Provide, maintain, and improve our Services. </li>
                <li>Personalize your experience and offer tailored content.</li>
                <li>
                  Communicate with you about updates, promotions, and other
                  relevant information.
                </li>
                <li>
                  Monitor and analyze usage and trends to enhance our Services.
                  Ensure the security and integrity of our Services.
                </li>
              </ul>
            </div>
          </li>

          <li>
            <h2>How We Share Your Information</h2>
            <p>
              We do not sell or rent your personal information to third parties.
              However, we may share your information in the following
              circumstances:
            </p>

            <ul className="!mt-4 ml-6">
              <li>
                <b>Service Providers:</b>{" "}
                <span>
                  We may share your information with third-party service
                  providers who perform services on our behalf, such as hosting,
                  analytics, and payment processing.
                </span>
              </li>
              <li>
                <b>Legal Requirements:</b>{" "}
                <span>
                  We may disclose your information if required to do so by law
                  or in response to valid requests by public authorities.
                </span>
              </li>{" "}
              <li>
                <b>Business Transfers:</b>{" "}
                <span>
                  In the event of a merger, acquisition, or sale of all or a
                  portion of our business, your information may be transferred
                  as part of that transaction.
                </span>
              </li>
            </ul>
          </li>

          <li>
            <h2>Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to
              protect your personal information from unauthorized access, use,
              or disclosure. However, no security system is impenetrable, and we
              cannot guarantee the absolute security of your information.
            </p>
          </li>

          <li>
            <h2>Your Choices</h2>
            <ul>
              <li>
                <b>Access and Update:</b>{" "}
                <span>
                  You can access and update your personal information by logging
                  into your account or contacting us at{" "}
                  <Link href="mailto:tech@Ummah connect.io">
                    tech@Ummah connect.io
                  </Link>
                  .
                </span>
              </li>
              <li>
                <b>Opt-Out:</b>{" "}
                <span>
                  You may opt-out of receiving promotional communications from
                  us by following the unsubscribe instructions in those
                  communications or contacting us directly.
                </span>
              </li>
            </ul>
          </li>

          <li>
            <h2>Children's Privacy</h2>
            <p>
              Our Services are not intended for children under the age of 13. We
              do not knowingly collect personal information from children under
              13. If we become aware that we have collected such information, we
              will take steps to delete it.
            </p>
          </li>

          <li>
            <h2>Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by posting the new Privacy Policy on our
              website and updating the effective date. Your continued use of our
              Services after any changes constitutes your acceptance of the
              updated Privacy Policy.
            </p>
          </li>

          <li>
            <h2>Contact Us</h2>
            <p>
              If you have any questions or concerns about this Privacy Policy or
              our practices, please contact us at: Email:{" "}
              <Link href="mailto:tech@Ummah connect.io">tech@Ummah connect.io</Link>
              .
            </p>
          </li>

          <li>
            <h2>Governing Law</h2>
            <p>
              This Privacy Policy is governed by and construed in accordance
              with the laws of United Arab emirates, without regard to its
              conflict of laws principles.
            </p>
          </li>
        </ol>
      </div>
      <Footer />
    </>
  );
};

export default PrivacyPolicyPage;
