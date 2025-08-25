import axios from "axios";
import { globalState } from "@/store/globalStore";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = globalState.user ? document.cookie.split("access_token=")[1] : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        document.cookie = `access_token=${res.data.accessToken}; path=/`;
        error.config.headers.Authorization = `Bearer ${res.data.accessToken}`;
        return api.request(error.config);
      } catch (err) {
        globalState.user = null;
        globalState.isAuthenticated = false;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
