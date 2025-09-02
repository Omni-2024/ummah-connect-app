"use client"
import { useAuthState } from "@/features/auth/context/useAuthState";
import FinalizingCard from "@/features/onboarding/components/user/FinalizingCard";
import { useOnboardingState } from "@/features/onboarding/context/useOnboardingState";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// TODO: Temporarily using timeout to simulate a loading state
const FinalizingOnboardingRoute = () => {
  const router = useRouter();
  const { resetOnboardingState } = useOnboardingState();
  const { setIsFirstLogin } = useAuthState();
  //
  useEffect(() => {
    resetOnboardingState();
    setIsFirstLogin(false);
    //
    const timer = setTimeout(() => {
      router.push("/");
    }, 3000);

    return () => clearTimeout(timer); // Cleanup the timer if the component unmounts
  }, [router, resetOnboardingState]);
  //
  return (
    <main
      style={{ backgroundImage: "url(/images/textures/1.svg)" }}
      className="h-screen overflow-y-scroll scrollbar-thin"
    >
      <div className="flex w-full items-center justify-center pt-6">
        <img
          alt="logo"
          src="/images/logo.png"
          className="object-contain"
          height={72}
          width={128}
        />
      </div>

      <div className="container flex min-h-[calc(100vh-10rem)] flex-row items-center justify-center py-8 lg:min-h-[calc(100vh-5rem)]">
        <FinalizingCard />
      </div>
    </main>
  );
};

export default FinalizingOnboardingRoute;
