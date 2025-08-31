import { useSnapshot } from 'valtio';
import { onboardingState, setUserOnboardingStep, setSelectedDesignation, setSelectedInterests, resetOnboardingState } from './OnboardingState';

export const useOnboardingState = () => {
    const snap = useSnapshot(onboardingState);
    return {
        userOnboardingStep: snap.userOnboardingStep,
        selectedDesignation: snap.selectedDesignation,
        selectedInterests: snap.selectedInterests,
        //
        setUserOnboardingStep: setUserOnboardingStep,
        setSelectedDesignation: setSelectedDesignation,
        setSelectedInterests: setSelectedInterests,
        resetOnboardingState: resetOnboardingState,
    };
};
