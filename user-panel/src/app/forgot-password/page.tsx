"use client"
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import CheckInboxCard from "@/features/auth/components/forgot-password/CheckInboxCard";
import EnterEmailCard from "@/features/auth/components/forgot-password/EnterEmail";
import { useForgotPasswordState } from "@/features/auth/context/useForgotPasswordState";

function ForgotPasswordRoute() {
  const { forgotPasswordStep, setForgotPasswordStep } =
      useForgotPasswordState();

  useEffect(() => {
    return () => {
      setForgotPasswordStep("enter-email");
    };
  }, []);

  return (
      <main className="flex flex-col min-h-screen" style={{ backgroundImage: "url(/images/pattern.jpg)" }}>
        <div className="hidden w-full items-center justify-center pt-6 md:flex">
          <img
              alt="logo"
              src="/images/logo.png"
              className="h-28 object-contain"
          />
        </div>

        <div className="container flex flex-1 flex-row items-center justify-center md:py-8">
          <AnimatePresence mode="wait">
            {forgotPasswordStep === "enter-email" && <EnterEmailCard />}
            {forgotPasswordStep === "check-inbox" && <CheckInboxCard />}
          </AnimatePresence>
        </div>
      </main>
  );
}

export default ForgotPasswordRoute;