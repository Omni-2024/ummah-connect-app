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

/** Post - '/auth/forgot-password' - forgot password */
export const forgotPasswordFn = async (email: string) => {
  const res = await Request<ForgotPasswordFnRes>({
    method: "post",
    url: "/api/auth/forgot-password",
    data: { email },
  });
  return res.data;
};
export interface ForgotPasswordFnRes { }

/** Post - '/auth/reset-password' - reset password */
export const resetPasswordFn = async (data: { token: string; password: string }) => {
  const res = await Request<ResetPasswordFnRes>({
    method: "post",
    url: "/api/auth/reset-password",
    data,
  });
  return res.data;
};
export interface ResetPasswordFnRes { }

/** Post - '/auth/change-password' - change password */
export const changePasswordFn = async (data: { id: string; oldPassword: string; newPassword: string; otp: string }) => {
  const res = await Request<ChangePasswordFnRes>({
    method: "post",
    url: "/api/auth/change-password",
    data,
  });
  return res.data;
};
export interface ChangePasswordFnRes { }

/** Post - '/auth/set-password' - set password */
export const setPasswordFn = async (data: { id: string; password: string; otp: string }) => {
  const res = await Request<SetPasswordFnRes>({
    method: "post",
    url: "/api/auth/set-password",
    data,
  });
  return res.data;
};
export interface SetPasswordFnRes { }

/** Post - '/auth/send-otp' - send otp */
export const sendOtpFn = async (email: string) => {
  const res = await Request<SendOtpFnRes>({
    method: "post",
    url: "/api/auth/send-otp",
    data: { email },
  });
  return res.data;
};

export interface SendOtpFnRes { }

export const changePasswordNoOtpFn = async (
  userId: string,
  oldPassword: string,
  newPassword: string
) => {
  if (!userId) throw new Error("User ID is missing");

  const res = await Request({
    method: "PATCH",
    url: `/api/user/${userId}/change-password`,
    data: { oldPassword, newPassword },
  });
  return res.data;
};
