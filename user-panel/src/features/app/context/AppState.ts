import { proxy } from 'valtio';

type AppState = {
  showNotificationsModal: boolean;
  showNavDrawer: boolean;
  showNotLoggedInNavModal: boolean;
  serviceId?:string;
  showServiceShareModal?: boolean;

};

const initialState: AppState = {
  showNotificationsModal: false,
  showNavDrawer: false,
  showNotLoggedInNavModal: false,
  serviceId:"",
  showServiceShareModal:false
};

export const appState = proxy<AppState>(initialState);

export const setShowNotificationsModal = (show: boolean) => {
  appState.showNotificationsModal = show;
};

export const setShowNavDrawer = (show: boolean) => {
  appState.showNavDrawer = show;
};

export const setShowNotLoggedInNavModal = (show: boolean) => {
  appState.showNotLoggedInNavModal = show;
};

export const setShowServiceShareModal = (show: boolean) => {
  appState.showServiceShareModal = show;
};

export const setServiceId = (id: string) => {
  appState.serviceId = id;
};