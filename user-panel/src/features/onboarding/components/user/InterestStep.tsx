import { ArrowRightIcon, CheckIcon } from "@radix-ui/react-icons";

import useIsMobile from "@/lib/hooks/useIsMobile";
import Button from "@/components/base/Button";
import Separator from "@/components/base/Separator";
import { useOnboardingState } from "@/features/onboarding/context/useOnboardingState";
import Spinner from "@/components/base/Spinner";
import { useState, useEffect } from "react";
import { cn } from "@/lib/className";
import {useSpecialists} from "@/lib/hooks/useSpecialists";

const InterestStep = () => {
  const isMobile = useIsMobile();
  const [renderContinue, setRenderContinue] = useState(false);

  useEffect(() => {
    setRenderContinue(true);
  });

  const {
    selectedDesignation,
    selectedInterests,
    setUserOnboardingStep,
    setSelectedInterests,
  } = useOnboardingState();

  const { data: specialists, isLoading: isSpecialistsLoading } = useSpecialists(
    selectedDesignation?.id ?? "",
  );

  const handleContinue = () => {
    setUserOnboardingStep("setupAccount");
  };

  const onInterestSelect = (interestId: string) => {
    const alreadySelected = !!selectedInterests.find((i) => i.id === interestId)
      ?.id;

    if (alreadySelected) {
      const filteredInterests = selectedInterests.filter(
        (i) => i.id !== interestId,
      );
      setSelectedInterests(filteredInterests);
    } else {
      const interest = specialists?.find((i) => i.id === interestId);
      if (!interest) return;
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  return (
    <div className="pb-20 lg:pb-0">
      <div>
        <h2 className="text-2xl font-bold lg:text-center">
          Hey, let’s personalize your learning path
        </h2>
        <p className="mt-2 text-sm text-dark-300 lg:mt-1 lg:text-center">
          Select topics that interest you and we’ll make recommendations for
          you.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 px-4 py-6">
          {isSpecialistsLoading ? (
            <Spinner classname="h-20 w-20" />
          ) : (
            specialists?.map(({ id, name }) => {
              const isSelected = !!selectedInterests.find((i) => i.id === id);
              return (
                <button
                  key={id}
                  type="button"
                  className={cn(
                    "px-4 py-2 inline-flex items-center gap-2 font-secondary justify-center rounded-full text-sm transition-colors focus-visible:outline-none select-none ease-in focus-visible:ring-1 disabled:pointer-events-none cursor-pointer ring-primary-200 border text-center",
                    isSelected 
                      ? "bg-primary-500 text-white border-primary-500 hover:bg-primary-500" 
                      : "bg-white text-primary-500 border-primary-500 hover:bg-primary-50 hover:border-transparent active:text-primary-700 active:border-transparent active:bg-primary-100"
                  )}
                  onClick={() => onInterestSelect(id)}
                >
                  {isSelected && !isMobile && (
                    <div className="flex size-4 items-center justify-center rounded-full bg-white shrink-0">
                      <CheckIcon className="size-3 text-primary-500" />
                    </div>
                  )}
                  <span className="break-words">{name}</span>
                </button>
              );
            })
          )}
        </div>
      </div>

      <Separator className="hidden lg:block" />

      <div className="fixed bottom-0 left-0 right-0 flex w-full translate-x-0 items-end justify-end bg-white p-4 px-4 lg:static lg:bottom-auto lg:pb-0">
        <Button
          onClick={handleContinue}
          className={cn(
            "translate-z-0 w-full touch-none opacity-0 lg:w-auto",
            renderContinue && "touch-auto opacity-100",
          )}
          rightIcon={<ArrowRightIcon className="size-4" color="white" />}
          disabled={isSpecialistsLoading || !selectedInterests.length}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default InterestStep;
