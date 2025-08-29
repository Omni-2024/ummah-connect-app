import { getCookie, setCookie, deleteCookie } from "@/utils/cookies"

export const AUTH_COOKIES = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  USER_TYPE: "userType", // 'user' | 'provider' | 'admin'
} as const

export const setAuthTokens = (accessToken: string, refreshToken: string, userType: "user" | "provider" | "admin") => {
  setCookie(AUTH_COOKIES.ACCESS_TOKEN, accessToken, { maxAge: 15 * 60 }) // 15 minutes
  setCookie(AUTH_COOKIES.REFRESH_TOKEN, refreshToken, { maxAge: 7 * 24 * 60 * 60 }) // 7 days
  setCookie(AUTH_COOKIES.USER_TYPE, userType, { maxAge: 7 * 24 * 60 * 60 }) // 7 days
}

export const clearAuthTokens = () => {
  deleteCookie(AUTH_COOKIES.ACCESS_TOKEN)
  deleteCookie(AUTH_COOKIES.REFRESH_TOKEN)
  deleteCookie(AUTH_COOKIES.USER_TYPE)
}

export const getAccessToken = () => getCookie(AUTH_COOKIES.ACCESS_TOKEN)
export const getRefreshToken = () => getCookie(AUTH_COOKIES.REFRESH_TOKEN)
export const getUserType = () => getCookie(AUTH_COOKIES.USER_TYPE) as "user" | "provider" | "admin" | null

export const isAuthenticated = () => {
  const accessToken = getAccessToken()
  const userType = getUserType()
  return !!(accessToken && userType)
}

// Admin hardcoded credentials (for initial implementation)
export const ADMIN_CREDENTIALS = {
  username: "admin1",
  password: "admin123@",
}

export const validateAdminCredentials = (username: string, password: string) => {
  return username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password
}
