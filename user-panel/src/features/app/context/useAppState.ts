"use client";

import { useSnapshot } from 'valtio';
import {
  appState,
  setShowNavDrawer,
  setShowNotificationsModal,
  setShowNotLoggedInNavModal,
} from './AppState';

export const useAppState = () => {
  const snap = useSnapshot(appState);
  return {
    showNotificationsModal: snap.showNotificationsModal,
    showNavDrawer: snap.showNavDrawer,
    showNotLoggedInNavModal: snap.showNotLoggedInNavModal,
    //
    setShowNotificationsModal: setShowNotificationsModal,
    setShowNavDrawer: setShowNavDrawer,
    setShowNotLoggedInNavModal: setShowNotLoggedInNavModal,
  };
};
