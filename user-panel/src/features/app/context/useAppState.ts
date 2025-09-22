"use client";

import { useSnapshot } from 'valtio';
import {
  appState, setServiceId,
  setShowNavDrawer,
  setShowNotificationsModal,
  setShowNotLoggedInNavModal, setShowServiceShareModal,
} from './AppState';

export const useAppState = () => {
  const snap = useSnapshot(appState);
  return {
    showNotificationsModal: snap.showNotificationsModal,
    showNavDrawer: snap.showNavDrawer,
    showNotLoggedInNavModal: snap.showNotLoggedInNavModal,
    showServiceShareModal:snap.showServiceShareModal,
    serviceId:snap.serviceId,
    //
    setServiceId:setServiceId,
    setShowServiceShareModal:setShowServiceShareModal,
    setShowNotificationsModal: setShowNotificationsModal,
    setShowNavDrawer: setShowNavDrawer,
    setShowNotLoggedInNavModal: setShowNotLoggedInNavModal,
  };
};
