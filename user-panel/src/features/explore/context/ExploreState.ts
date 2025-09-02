import { proxy } from 'valtio';

type ExploreState = {
  showNotificationsModal: boolean;
  showNavDrawer: boolean;
  showNotLoggedInNavModal: boolean;
};

const initialState: ExploreState = {
  showNotificationsModal: false,
  showNavDrawer: false,
  showNotLoggedInNavModal: false,
};

export const appState = proxy<ExploreState>(initialState);

export const setShowNotificationsModal = (show: boolean) => {
  appState.showNotificationsModal = show;
};

export const setShowNavDrawer = (show: boolean) => {
  appState.showNavDrawer = show;
};

export const setShowNotLoggedInNavModal = (show: boolean) => {
  appState.showNotLoggedInNavModal = show;
};