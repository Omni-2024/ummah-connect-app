"use client"
import { AnimatePresence } from "framer-motion";
import Stepper, { StepComponentWrapper } from "@/components/widgets/Stepper";
import CardWrapper from "@/features/auth/components/CardWrapper";
import DesignationStep from "@/features/onboarding/components/user/DesignationStep";
import InterestStep from "@/features/onboarding/components/user/InterestStep";
import SetupAccountStep from "@/features/onboarding/components/user/SetupAccountStep";
import { useOnboardingState } from "@/features/onboarding/context/useOnboardingState";
import { UserOnboardingStep } from "@/features/onboarding/context/OnboardingState";
import withAuth from "@/components/withAuth";
import { UserRole } from "@/lib/constants";
import { useAuthState } from "@/features/auth/context/useAuthState";
import { useRouter } from "next/navigation";

interface StepItem {
  stepId: UserOnboardingStep;
  title: string;
}

const OnboardingRoute = () => {
  const router = useRouter();

  const { userOnboardingStep } = useOnboardingState();
  const { isFirstLogin } = useAuthState();

  if (!isFirstLogin) {
    router.push("/");
  }

  return (
      <main style={{ backgroundImage: "url(/images/textures/1.svg)" }}>
        <div className="hidden w-full items-center justify-center pt-6 lg:flex">
          <img
              alt="logo"
              src="/images/logo.png"
              className="object-contain"
              height={72}
              width={128}
          />
        </div>

        <div className=" flex flex-row items-center justify-center lg:min-h-[calc(100vh-5rem)] lg:py-8">
          <CardWrapper className="flex h-full min-h-screen flex-col items-center overflow-y-auto p-0 lg:h-auto lg:min-h-[auto] lg:max-w-screen-lg lg:justify-center">
            <div className="w-full">
              <div className="pt-2 lg:pt-8">
                <Stepper
                    currentStepId={userOnboardingStep}
                    steps={
                      [
                        {
                          stepId: "profession",
                          title: "Profession",
                        },
                        {
                          stepId: "interests",
                          title: "Interests"
                        },
                        {
                          stepId: "setupAccount",
                          title: "Set Up Account",
                        },
                      ] as StepItem[]
                    }
                />
              </div>

              <div className="px-4 py-2 lg:pb-3 lg:pt-6">
                <AnimatePresence mode="wait">
                  {userOnboardingStep === "profession" && (
                      <StepComponentWrapper key="designation">
                        <DesignationStep />
                      </StepComponentWrapper>
                  )}
                  {userOnboardingStep === "interests" && (
                      <StepComponentWrapper key="interests">
                        <InterestStep />
                      </StepComponentWrapper>
                  )}
                  {userOnboardingStep === "setupAccount" && (
                      <StepComponentWrapper key="setupAccount">
                        <SetupAccountStep />
                      </StepComponentWrapper>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </CardWrapper>
        </div>
      </main>
  );
};

export default withAuth(OnboardingRoute, [UserRole.USER]);
