"use client"
import IconButton from "@/components/base/IconButton";
import ComingSoonToolTip from "@/components/widgets/ComingSoonToolTip";
import Footer from "@/features/app/components/Footer";
import Navbar  from "@/features/app/components/Navbar";
import NavbarMobile from "@/features/app/components/Navbar.mobile";
import NavDrawerMobile from "@/features/app/components/NavDrawer.mobile";
import NotificationsModal from "@/features/app/components/notifications/NotificationsModal.mobile";
import NotLoggedInNavModal from "@/features/app/components/NotLoggedInNavModal.mobile";
import { useAppState } from "@/features/app/context/useAppState";
import { useAuthState } from "@/features/auth/context/useAuthState";
import { HambergerMenu, Notification } from "iconsax-react";
import Link from "next/link";
import {Suspense, useEffect} from "react";
import ProfileMenuButton from "@/features/app/components/ProfileMenuButton";
import { NAV_LOGO_SRC } from "@/lib/constants";
import Button from "@/components/base/Button";

const TermsPageContent = () => {
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

      {/* TODO:: Temporary disabled until feature available */}
      <NotificationsModal disabled />
      <NavDrawerMobile />
      <NotLoggedInNavModal />

      <div className="container max-w-[1120px] px-6 py-12 sm:px-10">
        <div className="flex flex-wrap items-center justify-between gap-x-12 gap-y-2">
          <h1 className="font-primary text-[31px] font-bold">
            Terms & Conditions
          </h1>
          <div>Effective Date: 24th Sep 2025</div>
        </div>

        <ol className="ml-4 mt-4 [&>li]:mt-8 [&>li]:list-outside [&>li]:list-decimal [&>li]:text-xl [&>li]:font-medium [&>li]:text-dark-500 [&>li_li]:mt-2 [&>li_li]:list-outside [&>li_li]:list-disc [&>li_ul>li>span]:text-dark-400 [&>li_ul]:mt-4 [&>li_ul]:text-base [&>li_ul]:font-normal [&>li_ul]:text-dark-500 [&_a]:text-status-blue [&_a]:underline [&_p]:mt-4 [&_p]:text-base [&_p]:font-normal [&_p]:text-dark-400">
          <li>
            <h2>Introduction</h2>
            <p>
              Welcome to Ummah connect! These Terms and Conditions ("Terms")
              govern your use of our web app, Android app, and Google app
              (collectively referred to as the "Services"). By accessing or
              using our Services, you agree to comply with and be bound by these
              Terms. If you do not agree to these Terms, please do not use our
              Services.
            </p>
          </li>

          <li>
            <h2>Information We Collect</h2>
            <ul>
              <li>
                <b>Eligibility:</b>{" "}
                <span>
                  You must be at least 13 years old to use our Services. By
                  using our Services, you represent and warrant that you meet
                  this age requirement.
                </span>
              </li>
              <li>
                <b>Account:</b>{" "}
                <span>
                  To access certain features of our Services, you may need to
                  create an account. You are responsible for maintaining the
                  confidentiality of your account credentials and for all
                  activities that occur under your account.
                </span>
              </li>
              <li>
                <b>Prohibited Activities:</b>{" "}
                <span>
                  You agree not to engage in any of the following prohibited
                  activities:
                </span>
                <ul className="!mt-2 ml-6">
                  <li>
                    <span>Violating any applicable laws or regulations.</span>
                  </li>
                  <li>
                    <span>
                      Using the Services for any unlawful or unauthorized
                      purpose.
                    </span>
                  </li>
                  <li>
                    <span>
                      Interfering with or disrupting the Services or servers.
                    </span>
                  </li>
                  <li>
                    <span>
                      Attempting to gain unauthorized access to any portion of
                      the Services or its systems.
                    </span>
                  </li>
                  <li>
                    <span>
                      Impersonating any person or entity or falsely claiming
                      affiliation with any person or entity.
                    </span>
                  </li>
                </ul>
              </li>
            </ul>
          </li>

          <li>
            <h2>Intellectual Property</h2>
            <ul>
              <li>
                <b>Ownership:</b>{" "}
                <span>
                  All content and materials available through our Services,
                  including but not limited to text, graphics, logos, and
                  software, are the property of Ummah connect or its licensors and
                  are protected by copyright, trademark, and other intellectual
                  property laws.
                </span>
              </li>
              <li>
                <b>License:</b>{" "}
                <span>
                  Subject to these Terms, we grant you a limited, non-exclusive,
                  non-transferable license to access and use our Services for
                  personal, non-commercial purposes. You may not copy, modify,
                  distribute, or create derivative works based on our Services
                  or any content therein without our prior written consent.
                </span>
              </li>
            </ul>
          </li>

          <li>
            <h2>User Content</h2>
            <ul>
              <li>
                <b>Responsibility:</b>{" "}
                <span>
                  You are solely responsible for any content you submit, post,
                  or otherwise make available through our Services ("User
                  Content"). You retain ownership of your User Content, but by
                  submitting it, you grant us a worldwide, royalty-free,
                  non-exclusive license to use, reproduce, modify, and display
                  it in connection with our Services.
                </span>
              </li>
              <li>
                <b>Moderation:</b>{" "}
                <span>
                  We reserve the right to monitor, review, and remove any User
                  Content that we believe violates these Terms or is otherwise
                  inappropriate.
                </span>
              </li>
            </ul>
          </li>

          <li>
            <h2>Third-Party Links</h2>
            <p>
              Our Services may contain links to third-party websites or
              services. We do not endorse or assume any responsibility for the
              content or practices of these third parties. Your use of
              third-party websites or services is at your own risk and subject
              to their terms and conditions.
            </p>
          </li>

          <li>
            <h2>Disclaimers</h2>
            <ul>
              <li>
                <b>No Warranty:</b>{" "}
                <span>
                  Our Services are provided "as is" and "as available" without
                  any warranties of any kind, whether express or implied. We do
                  not warrant that our Services will be error-free, secure, or
                  uninterrupted.
                </span>
              </li>
              <li>
                <b>Limitation of Liability:</b>{" "}
                <span>
                  To the fullest extent permitted by law, Ummah connect and its
                  affiliates shall not be liable for any indirect, incidental,
                  special, consequential, or punitive damages, or any loss of
                  profits or data, arising out of or in connection with your use
                  of our Services.
                </span>
              </li>
            </ul>
          </li>

          <li>
            <h2>Termination</h2>
            <p>
              We reserve the right to suspend or terminate your access to our
              Services at any time, with or without cause, and with or without
              notice, if we believe you have violated these Terms or for any
              other reason.
            </p>
          </li>

          <li>
            <h2>Changes to Terms</h2>
            <p>
              We may update these Terms from time to time. We will notify you of
              any changes by posting the new Terms on our website and updating
              the effective date. Your continued use of our Services after any
              changes constitutes your acceptance of the updated Terms.
            </p>
          </li>

          <li>
            <h2>Governing Law</h2>
            <p>
              These Terms are governed by and construed in accordance with the
              laws of the United Arab Emirates, without regard to its conflict
              of laws principles. Any disputes arising under or in connection
              with these Terms shall be resolved in the courts located in the
              United Arab Emirates.
            </p>
          </li>

          <li>
            <h2>Contact Us</h2>
            <p>
              If you have any questions or concerns about these Terms or our
              Services, please contact us at: <br /> Email:{" "}
              <Link href="mailto:support@ummahconnect.online">support@ummahconnect.online</Link>
              .
            </p>
          </li>
        </ol>
      </div>

      <Footer />
    </>
  );
};

const TermsPageRoute = () => {
  return (
      <Suspense fallback={<div>Loading...</div>}>
        <TermsPageContent />
      </Suspense>
  );
};

export default TermsPageRoute;
