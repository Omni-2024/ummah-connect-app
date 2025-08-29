import {UserRole} from '@/lib/constants';
import { proxy, subscribe } from "valtio";

export type AuthState ={
    isAuthenticated:boolean;
    accessToken: string;
    refreshToken: string;
    role:UserRole;
    id: string;
    isFirstLogin:boolean;
}

const initialState:AuthState = {
    isAuthenticated: false,
    accessToken: "",
    refreshToken: "",
    role: UserRole.NONE,
    id: "",
    isFirstLogin: false,
}

// Check if localStorage is available (i.e., if the code is running in a browser)
const savedState = typeof window !== 'undefined' && localStorage.getItem('authState');
const parsedState = savedState ? JSON.parse(savedState) : initialState;

export const authState = proxy<AuthState>(parsedState);

if (typeof window !== 'undefined') {
  subscribe(authState, () => {
    localStorage.setItem('authState', JSON.stringify(authState));
  });
}

export const setIsFirstLogin = (isFirstLogin: boolean) => {
  authState.isFirstLogin = isFirstLogin;
};

export const login = (accessToken: string, refreshToken: string, role: UserRole, id: string, isFirstLogin: boolean) => {
  authState.isAuthenticated = true;
  authState.accessToken = accessToken;
  authState.refreshToken = refreshToken;
  authState.role = role;
  authState.id = id;
  authState.isFirstLogin = isFirstLogin;
};

export const logout = () => {
  authState.isAuthenticated = false;
  authState.accessToken = "";
  authState.refreshToken = "";
  authState.role = UserRole.NONE;
  authState.id = "";
  authState.isFirstLogin = false;
}