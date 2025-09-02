import { useSnapshot } from 'valtio';
import {
  appState,
  setShowNavDrawer,
  setShowNotificationsModal,
  setShowNotLoggedInNavModal,
} from './ExploreState';

export const useExploreState = () => {
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
