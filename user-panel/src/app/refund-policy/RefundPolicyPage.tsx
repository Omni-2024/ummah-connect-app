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

const RefundPolicyPage = () => {
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
            Refund & Cancellation Policy
          </h1>
        </div>

        <div className="mt-4 rounded-lg bg-primary-50 border border-primary-200 p-4">
          <p className="text-base text-dark-500 font-medium text-center">
            Shariah-Compliant – Escrow Based
          </p>
        </div>

        <ol className="ml-4 mt-8 space-y-8 [&>li]:list-outside [&>li]:list-decimal">
          <li>
            <h2 className="text-xl font-semibold text-dark-500 mb-3">
              Our Approach
            </h2>
            <p className="text-base text-dark-400 mb-3">
              UmmahConnect operates as a service marketplace where payments are held in escrow through Stripe as a trust (Amānah) until services are delivered.
            </p>
            <p className="text-base text-dark-400 mb-3">
              UmmahConnect acts solely as a facilitating agent (Wakīl) between buyers and sellers and does not own the funds until the service is successfully completed.
            </p>
            <p className="text-base text-dark-400">
              This policy is guided by principles of justice (ʿAdl), trust (Amānah), and fair dealing in accordance with Islamic ethics.
            </p>
          </li>

          <li>
            <h2 className="text-xl font-semibold text-dark-500 mb-3">
              How Escrow Works
            </h2>
            <ul className="ml-6 space-y-2 text-base text-dark-400 [&>li]:list-outside [&>li]:list-disc">
              <li>Buyers pay for services at checkout</li>
              <li>Funds are held securely in escrow via Stripe</li>
              <li>
                Funds are released to the seller only after:
                <ul className="ml-6 mt-1 space-y-1 [&>li]:list-outside [&>li]:list-circle">
                  <li>Service delivery, and</li>
                  <li>Buyer confirmation or completion milestone</li>
                </ul>
              </li>
              <li>If a dispute arises, funds remain in escrow until resolved</li>
            </ul>
          </li>

          <li>
            <h2 className="text-xl font-semibold text-dark-500 mb-3">
              When a Full Refund Is Issued
            </h2>
            <p className="text-base text-dark-400 mb-3">
              A full refund to the original payment method will be issued if:
            </p>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-semibold text-dark-500 mb-2">
                  a) Service Is Not Delivered
                </h3>
                <ul className="ml-6 space-y-1 text-base text-dark-400 [&>li]:list-outside [&>li]:list-disc">
                  <li>Seller fails to deliver within the agreed timeframe</li>
                  <li>No mutually agreed extension is in place</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-semibold text-dark-500 mb-2">
                  b) Seller Cancels or Becomes Unresponsive
                </h3>
                <ul className="ml-6 space-y-1 text-base text-dark-400 [&>li]:list-outside [&>li]:list-disc">
                  <li>Seller cancels the order</li>
                  <li>Seller fails to communicate or proceed after reasonable time</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-semibold text-dark-500 mb-2">
                  c) Service Is Fundamentally Not as Described
                </h3>
                <ul className="ml-6 space-y-1 text-base text-dark-400 [&>li]:list-outside [&>li]:list-disc">
                  <li>Delivered work materially differs from the agreed description</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-semibold text-dark-500 mb-2">
                  d) Policy or Shariah Violation
                </h3>
                <ul className="ml-6 space-y-1 text-base text-dark-400 [&>li]:list-outside [&>li]:list-disc">
                  <li>Service is found to violate UmmahConnect's Community Guidelines</li>
                  <li>Service is deemed haram, deceptive, or unethical</li>
                </ul>
              </div>
            </div>
          </li>

          <li>
            <h2 className="text-xl font-semibold text-dark-500 mb-3">
              Partial Refunds
            </h2>
            <p className="text-base text-dark-400 mb-2">
              Partial refunds may be issued when:
            </p>
            <ul className="ml-6 space-y-1 text-base text-dark-400 [&>li]:list-outside [&>li]:list-disc mb-3">
              <li>Work has started but not been completed</li>
              <li>A portion of the service was delivered</li>
              <li>Both parties agree to a fair partial settlement</li>
            </ul>
            <p className="text-base text-dark-400 mb-2">
              UmmahConnect may determine the refund amount based on:
            </p>
            <ul className="ml-6 space-y-1 text-base text-dark-400 [&>li]:list-outside [&>li]:list-disc">
              <li>Work completed</li>
              <li>Time spent</li>
              <li>Evidence provided</li>
            </ul>
          </li>

          <li>
            <h2 className="text-xl font-semibold text-dark-500 mb-3">
              When Refunds Are Not Granted
            </h2>
            <p className="text-base text-dark-400 mb-3">
              Refunds are generally not issued if:
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="text-base font-semibold text-dark-500 mb-2">
                  a) Service Was Delivered as Agreed
                </h3>
                <ul className="ml-6 space-y-1 text-base text-dark-400 [&>li]:list-outside [&>li]:list-disc">
                  <li>Buyer changes their mind after delivery</li>
                  <li>Service meets the original description and scope</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-semibold text-dark-500 mb-2">
                  b) Time-Based Services Have Taken Place
                </h3>
                <ul className="ml-6 space-y-1 text-base text-dark-400 [&>li]:list-outside [&>li]:list-disc">
                  <li>Consultations, calls, coaching, or sessions already completed</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-semibold text-dark-500 mb-2">
                  c) Buyer-Related Issues
                </h3>
                <ul className="ml-6 space-y-1 text-base text-dark-400 [&>li]:list-outside [&>li]:list-disc">
                  <li>Buyer provided incorrect or incomplete information</li>
                  <li>Buyer failed to respond or participate</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-semibold text-dark-500 mb-2">
                  d) Outside-Platform Agreements
                </h3>
                <ul className="ml-6 space-y-1 text-base text-dark-400 [&>li]:list-outside [&>li]:list-disc">
                  <li>Payments or arrangements made outside UmmahConnect</li>
                </ul>
              </div>
            </div>
          </li>

          <li>
            <h2 className="text-xl font-semibold text-dark-500 mb-3">
              Cancellations
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-base font-semibold text-dark-500 mb-2">
                  Before Work Begins
                </h3>
                <ul className="ml-6 space-y-1 text-base text-dark-400 [&>li]:list-outside [&>li]:list-disc">
                  <li>Buyer may cancel within 24 hours of purchase</li>
                  <li>Full refund issued if the seller has not started work</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-semibold text-dark-500 mb-2">
                  After Work Begins
                </h3>
                <ul className="ml-6 space-y-1 text-base text-dark-400 [&>li]:list-outside [&>li]:list-disc">
                  <li>Cancellation eligibility depends on service type and progress</li>
                  <li>Partial refund may apply</li>
                </ul>
              </div>
            </div>
          </li>

          <li>
            <h2 className="text-xl font-semibold text-dark-500 mb-3">
              Dispute Resolution (Ṣulḥ)
            </h2>
            <p className="text-base text-dark-400 mb-3">
              In the event of a dispute:
            </p>
            <ol className="ml-6 space-y-2 text-base text-dark-400 [&>li]:list-outside [&>li]:list-decimal">
              <li>Buyer and seller are encouraged to resolve the issue amicably</li>
              <li>
                If unresolved, UmmahConnect will review:
                <ul className="ml-6 mt-1 space-y-1 [&>li]:list-outside [&>li]:list-circle">
                  <li>Service description</li>
                  <li>Platform messages</li>
                  <li>Delivery evidence</li>
                </ul>
              </li>
              <li>UmmahConnect will issue a fair decision</li>
            </ol>
            <p className="text-base text-dark-400 mt-3">
              All decisions are made with the aim of reconciliation and fairness, and are final.
            </p>
          </li>

          <li>
            <h2 className="text-xl font-semibold text-dark-500 mb-3">
              Platform & Processing Fees
            </h2>
            <ul className="ml-6 space-y-2 text-base text-dark-400 [&>li]:list-outside [&>li]:list-disc">
              <li>Platform fees are earned only upon successful service delivery</li>
              <li>
                If a full refund is issued due to seller fault:
                <ul className="ml-6 mt-1 space-y-1 [&>li]:list-outside [&>li]:list-circle">
                  <li>Platform fees are refunded where possible</li>
                </ul>
              </li>
              <li>Payment processing fees may be non-refundable, depending on Stripe's policies</li>
            </ul>
          </li>

          <li>
            <h2 className="text-xl font-semibold text-dark-500 mb-3">
              Refund Method & Timing
            </h2>
            <ul className="ml-6 space-y-1 text-base text-dark-400 [&>li]:list-outside [&>li]:list-disc">
              <li>Refunds are returned to the original payment method</li>
              <li>Processing times depend on the payment provider</li>
              <li>UmmahConnect does not issue forced platform credits</li>
            </ul>
          </li>

          <li>
            <h2 className="text-xl font-semibold text-dark-500 mb-3">
              Abuse & Misuse
            </h2>
            <p className="text-base text-dark-400 mb-2">
              Abuse of the refund or dispute process may result in:
            </p>
            <ul className="ml-6 space-y-1 text-base text-dark-400 [&>li]:list-outside [&>li]:list-disc">
              <li>Loss of refund privileges</li>
              <li>Account suspension or termination</li>
            </ul>
          </li>

          <li>
            <h2 className="text-xl font-semibold text-dark-500 mb-3">
              Final Ethical Statement
            </h2>
            <div className="rounded-lg bg-gray-50 border border-gray-200 p-4">
              <p className="text-base text-dark-500">
                UmmahConnect is committed to fair trade and ethical conduct. No party shall unjustly consume the wealth of another, and all disputes shall be resolved with justice and integrity.
              </p>
            </div>
          </li>
        </ol>

        <div className="mt-12 rounded-lg bg-white border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-dark-500 mb-3">
            Questions About Refunds?
          </h3>
          <p className="text-base text-dark-400">
            If you need to request a refund or have questions about this policy, please contact our support team at{" "}
            <Link href="mailto:support@ummahconnect.io" className="text-status-blue underline">
              support@ummahconnect.io
            </Link>
            . For disputes, visit our{" "}
            <Link href="/help-center" className="text-status-blue underline">
              Help Center
            </Link>{" "}
            or review our{" "}
            <Link href="/guidelines" className="text-status-blue underline">
              Community Guidelines
            </Link>
            .
          </p>
        </div>

        <div className="mt-6 rounded-lg bg-primary-50 border border-primary-200 p-6">
          <p className="text-base text-dark-500 text-center">
            This policy is designed to protect both buyers and sellers while upholding Islamic principles of fairness, transparency, and trust.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RefundPolicyPage;