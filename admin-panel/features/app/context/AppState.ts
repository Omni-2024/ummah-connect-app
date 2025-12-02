import { proxy } from 'valtio';

type AppState = {
    onboardingSuccess: boolean;
};

const initialState: AppState = {
   onboardingSuccess: false,
};

export const appState = proxy<AppState>(initialState);

export const setOnboardingSuccess = (show: boolean) => {
    appState.onboardingSuccess = show;
};