"use client";

import { useSnapshot } from 'valtio';
import {
    appState, setOnboardingSuccess,
} from './AppState';

export const useAppState = () => {
    const snap = useSnapshot(appState);
    return {
        onboardingSuccess: snap.onboardingSuccess,
        setOnboardingSuccess:setOnboardingSuccess,
    };
};

// const {
//     setShowNavDrawer,
//     setShowNotificationsModal,
// } = useAppState()