import type { ADMIN_ROLES } from "@/lib/constants";
import Request from "@/lib/http";

export interface UserSignInFnRes {
  token: string;
  refreshToken: string;
  id: string;
  role: ADMIN_ROLES;
  isFirstLogin: boolean;
}

/** Post - 'admin/login' - user login */
export const adminSignInFn = async (data: {
  email: string;
  password: string;
}) => {
  const res = await Request<UserSignInFnRes>({
    method: "post",
    url: "/api/auth/login-admin",
    data,
  });

  return res.data;
};

export interface RefreshTokenFnRes {
  token: string;
  refreshToken: string;
  id: string;
  role: ADMIN_ROLES;
  isFirstLogin: boolean;
}

/** Post - '/auth/refresh-token' - refresh user token */
export const refreshTokenFn = async (refreshToken: string) => {
  const res = await Request<RefreshTokenFnRes>({
    method: "post",
    url: "/api/auth/refresh-token",
    data: { token: refreshToken },
  });

  return res.data;
};
