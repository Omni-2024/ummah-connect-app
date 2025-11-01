import { UserRole } from "@/lib/constants"
import { proxy, subscribe } from "valtio"

export type AuthState = {
  isAuthenticated: boolean
  accessToken: string
  refreshToken: string
  role: UserRole
  id: string
  isFirstLogin: boolean
  onboardingCompleted: boolean
  isHydrated: boolean,
}

const initialState: AuthState = {
  isAuthenticated: false,
  accessToken: "",
  refreshToken: "",
  role: UserRole.NONE,
  id: "",
  isFirstLogin: false,
  onboardingCompleted: false,
  isHydrated: false,
}

const savedState =
    typeof window !== "undefined" && localStorage.getItem("authState");

let parsedState = initialState;

if (savedState) {
  const parsed = JSON.parse(savedState);
  if (parsed.refreshToken && parsed.refreshToken.trim() !== "") {
    parsedState = { ...parsed, isHydrated: false };
  } else {
    // fallback if refreshToken is empty
    parsedState = initialState;
  }
} else {
  parsedState = initialState;
}

export const authState = proxy<AuthState>(parsedState)

if (typeof window !== "undefined") {
  subscribe(authState, () => {
    const { isHydrated, ...persist } = authState;
    localStorage.setItem("authState", JSON.stringify(persist));
  });
}

export function hydrateAuthFromStorage() {
  try {
    const raw = localStorage.getItem("authState");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.refreshToken && parsed.refreshToken.trim() !== "") {
        authState.isAuthenticated      = !!parsed.isAuthenticated;
        authState.accessToken          = parsed.accessToken ?? "";
        authState.refreshToken         = parsed.refreshToken ?? "";
        authState.role                 = parsed.role ?? UserRole.NONE;
        authState.id                   = parsed.id ?? "";
        authState.isFirstLogin         = !!parsed.isFirstLogin;
        authState.onboardingCompleted  = !!parsed.onboardingCompleted;
      }
    }
  } finally {
    authState.isHydrated = true;
  }
}

export const setIsFirstLogin = (isFirstLogin: boolean) => {
  authState.isFirstLogin = isFirstLogin
}

export const setOnboardingCompleted = (completed: boolean) => {
  authState.onboardingCompleted = completed
  if (completed) {
    authState.isFirstLogin = false
  }
}

export const login = (
  accessToken: string,
  refreshToken: string,
  role: UserRole,
  id: string,
  isFirstLogin: boolean,
) => {
  authState.isAuthenticated = true
  authState.accessToken = accessToken
  authState.refreshToken = refreshToken
  authState.role = role
  authState.id = id
  authState.isFirstLogin = isFirstLogin
  authState.onboardingCompleted = !isFirstLogin
}

export const logout = () => {
  authState.isAuthenticated = false
  authState.accessToken = ""
  authState.refreshToken = ""
  authState.role = UserRole.NONE
  authState.id = ""
  authState.isFirstLogin = false
  authState.onboardingCompleted = false
}
