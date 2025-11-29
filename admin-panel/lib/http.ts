import axios, { type AxiosError } from "axios";
import envs from "./env";
import { authState, login } from "@/features/auth/context/AuthState";
import { refreshTokenFn } from "./endpoints/authenticationFns";

const Request = axios.create({
    baseURL: envs.backendBaseUrl,
    // headers: {
    //     "Content-Type": "application/json",
    // },
});

const clearAuthStateAndRedirect = () => {
    localStorage.removeItem("authState");
    window.location.href = "/login";
};

const authExcludedPaths = ["/api/auth/login-admin", "/api/auth/refresh-token"];

Request.interceptors.request.use(
    (config) => {
        const { accessToken } = authState;
        if (accessToken && !authExcludedPaths.includes(config.url ?? "")) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

Request.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error?.response?.status === 401 &&
            !authExcludedPaths.includes(originalRequest?.url)
        ) {
            try {
                const { refreshToken } = authState;
                const res = await refreshTokenFn(refreshToken);
                login({
                    accessToken: res.token,
                    refreshToken: res.refreshToken,
                    role: res.role,
                    id: res.id,
                });

                originalRequest.headers.Authorization = `Bearer ${res.token}`;

                // Retry the original request with the new token
                return axios(originalRequest);
            } catch {
                clearAuthStateAndRedirect();
            }
        }
        return Promise.reject(error);
    }
);

type AxiosErrorResult<T> = [AxiosError, null] | [null, T];

export const catchAxiosErrorTyped = async <T>(
    promise: Promise<T>
): Promise<AxiosErrorResult<T>> => {
    try {
        const result = await promise;
        return [null, result] as const;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return [error, null] as const;
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