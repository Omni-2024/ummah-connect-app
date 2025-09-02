import axios, { AxiosError, AxiosInstance } from "axios";
import envs from "./env";
import { refreshTokenFn } from "./endpoints/authenticationFns";
import { login, authState } from "@/features/auth/context/AuthState";

const Request: AxiosInstance = axios.create({
  baseURL: envs.backendBaseUrl,
  // headers: {
  //   "Content-Type": "application/json",
  // },
});

const clearAuthStateAndRedirect = (currUrl: string) => {
  localStorage.removeItem("authState");

  try {
    const currentUrl = new URL(window.location.href);
    const loginUrl = new URL("/user/login", window.location.origin);

    const callback =
      currentUrl.searchParams.get("_callback") ||
      (currUrl && currUrl !== "/user/login" ? currUrl : null);

    if (callback) {
      loginUrl.searchParams.set("_callback", callback);
    }

    const action = currentUrl.searchParams.get("_action");
    if (action) {
      loginUrl.searchParams.set("_action", action);
    }

    window.location.href = loginUrl.toString();
  } catch (error) {
    window.location.href = "/user/login";
  }
};

const authExcludedPaths = [
  "/api/auth/login",
  "/api/auth/social-login",
  "/api/auth/refresh-token",
];

Request.interceptors.request.use(
  (config) => {
    const { accessToken } = authState;
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

Request.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = (error as AxiosError).config;
    if (!originalRequest) return Promise.reject(error);
    if (
      error?.response?.status === 401 &&
      !authExcludedPaths.includes(originalRequest?.url || "")
    ) {
      try {
        const { refreshToken } = authState;
        const res = await refreshTokenFn(refreshToken);
        login(res.token, res.refreshToken, res.role, res.id, res.isFirstLogin);

        originalRequest.headers["Authorization"] = `Bearer ${res.token}`;

        // Retry the original request with the new token
        return axios(originalRequest);
      } catch {
        clearAuthStateAndRedirect(
          originalRequest.url || window.location.pathname,
        );
      }
    }
    return Promise.reject(error);
  },
);

type AxiosErrorResult<T> = [AxiosError | null, T | null];

export const catchAxiosErrorTyped = async <T>(
  promise: Promise<T>,
): Promise<AxiosErrorResult<T>> => {
  try {
    const result = await promise;
    return [null, result];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return [error, null];
    }
    throw error;
  }
};

export default Request;

export type WithPagination<T> = {
  data: T[];
  meta: {
    total: number;
    limit: number;
    offset: number;
  };
};
