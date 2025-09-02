import { GetAllProfessionsFnRes, GetAllTypesByProfessionIdFnRes } from '@/lib/endpoints/categoryFns';
import { proxy } from 'valtio';

export type UserOnboardingStep = "profession" | "interests" | "setupAccount";

type OnboardingState = {
    userOnboardingStep: UserOnboardingStep;
    selectedDesignation: GetAllProfessionsFnRes | null;
    selectedInterests: GetAllTypesByProfessionIdFnRes[];
};

const initialState: OnboardingState = {
    userOnboardingStep: "profession",
    selectedDesignation: null,
    selectedInterests: [],
};

export const onboardingState = proxy<OnboardingState>(initialState);

export const setUserOnboardingStep = (step: UserOnboardingStep) => {
    onboardingState.userOnboardingStep = step;
};

export const setSelectedDesignation = (designation: GetAllProfessionsFnRes) => {
    onboardingState.selectedDesignation = designation;
};

export const setSelectedInterests = (interests: GetAllTypesByProfessionIdFnRes[]) => {
    onboardingState.selectedInterests = interests;
};

export const resetOnboardingState = () => {
    onboardingState.userOnboardingStep = "profession";
    onboardingState.selectedDesignation = null;
    onboardingState.selectedInterests = [];
};