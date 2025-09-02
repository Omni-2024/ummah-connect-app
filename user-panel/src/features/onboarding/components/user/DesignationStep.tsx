import {
  ArrowRight as ArrowRightIcon,
  TickCircle as CheckIcon,
} from "iconsax-react";

import useIsMobile from "@/lib/hooks/useIsMobile";
import Button from "@/components/base/Button";
import Separator from "@/components/base/Separator";
import { useOnboardingState } from "@/features/onboarding/context/useOnboardingState";
import Spinner from "@/components/base/Spinner";
import { useProfessions } from "@/lib/hooks/useProfessions";
import { GetAllProfessionsFnRes } from "@/lib/endpoints/categoryFns";
import { useEffect, useState } from "react";
import { cn } from "@/lib/className";

const DesignationStep = () => {
  const isMobile = useIsMobile();
  const [renderContinue, setRenderContinue] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setRenderContinue(true);
    }, 2000);
  });

  const { selectedDesignation, setUserOnboardingStep, setSelectedDesignation } =
      useOnboardingState();

  const { data: professions, isLoading: isProfessionsLoading } =
      useProfessions();

  const handleContinue = () => {
    setUserOnboardingStep("interests");
  };

  const onDesignationSelect = (designationId: string) => {
    const designation = professions?.find((d) => d.id === designationId);
    setSelectedDesignation(designation as GetAllProfessionsFnRes);
  };

  return (
      <div className="max-w-screen-md pb-20 lg:pb-0">
        <div>
          <h2 className="text-2xl font-bold lg:text-center">
            Hey, let's personalize your learning path
          </h2>
          <p className="mt-2 text-sm text-dark-300 lg:mt-1 lg:text-center">
            Select topics that interest you and we'll make recommendations for
            you.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 px-4 py-6">
            {isProfessionsLoading ? (
                <Spinner classname="w-20 h-20" />
            ) : (
                professions?.map(({ id, name }) => {
                  const isSelected = selectedDesignation?.id === id;
                  return (
                      <Button
                          key={id}
                          size="md"
                          leftIcon={
                              !isMobile &&
                              isSelected && (
                                  <CheckIcon
                                      variant="Bold"
                                      className="size-5 rounded-full text-white"
                                  />
                              )
                          }
                          className="md:min-w-64"
                          onClick={() => onDesignationSelect(id)}
                          variant={isSelected ? "primary" : "secondary"}
                      >
                        {name}
                      </Button>
                  );
                })
            )}
          </div>
        </div>

        <Separator className="hidden lg:block" />

        <div className="translate-z-0 fixed bottom-0 left-0 right-0 flex w-full translate-x-0 items-end justify-end bg-white p-4 px-4 lg:static lg:bottom-auto lg:pb-0">
          <Button
              onClick={handleContinue}
              className={cn(
                  "w-full touch-none opacity-0 lg:w-auto",
                  renderContinue && "touch-auto opacity-100",
              )}
              rightIcon={<ArrowRightIcon className="size-4" color="white" />}
              disabled={isProfessionsLoading || !selectedDesignation}
          >
            Continue
          </Button>
        </div>
      </div>
  );
};

export default DesignationStep;
