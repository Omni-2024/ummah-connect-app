import { SOCIAL_TYPE, UserRole } from "@/lib/constants";
import Request from "@/lib/http";

/** Post - '/auth/user/register' - create a new user account */
export const generalUserSignUpFn = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const res = await Request<UserSignUpFnRes>({
    method: "post",
    url: "/api/auth/register",
    data,
  });
  return res.data;
};
export interface UserSignUpFnRes { }

/** Post - '/auth/user/login' - user login */
export const userSignInFn = async (data: {
  email: string;
  password: string;
}) => {
  const res = await Request<UserSignInFnRes>({
    method: "post",
    url: "/api/auth/login",
    data,
  });

  return res.data;
};

export interface UserSignInFnRes {
  token: string;
  refreshToken: string;
  id: string;
  role: UserRole;
  isFirstLogin: boolean;
}

/** Post - '/auth/verify-email' - verify user email adress */
export const verifyEmailFn = async (token: string) => {
  const res = await Request<VerifyEmailFnRes>({
    method: "post",
    url: "/api/auth/verify-email",
    data: { token },
  });

  return res.data;
};
export interface VerifyEmailFnRes { }

/** Post - '/auth/refresh-token' - refresh user token */
export const refreshTokenFn = async (refreshToken: string) => {
  const res = await Request<RefreshTokenFnRes>({
    method: "post",
    url: "/api/auth/refresh-token",
    data: { token: refreshToken },
  });

  return res.data;
};
export interface RefreshTokenFnRes {
  token: string;
  refreshToken: string;
  id: string;
  role: UserRole;
  isFirstLogin: boolean;
}

/** Post - '/auth/validate-token' - validate user token */
export const validateTokenFn = async (accessToken: string) => {
  const res = await Request<ValidateTokenFnRes>({
    method: "post",
    url: "/api/auth/validate-token",
    data: { token: accessToken },
  });

  return res.data;
}
export interface ValidateTokenFnRes {
  id: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
  iss: string;
}

/** Post - '/auth/social-login' - social login */
export const socialLoginFn = async (data: {
  accessToken: string;
  type: SOCIAL_TYPE;
}) => {
  const res = await Request<UserSignInFnRes>({
    method: "post",
    url: "/api/auth/social-login",
    data,
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
export const resetPasswordFn = async (data: {
  token: string;
  password: string;
}) => {
  const res = await Request<ResetPasswordFnRes>({
    method: "post",
    url: "/api/auth/reset-password",
    data,
  });

  return res.data;
};
export interface ResetPasswordFnRes { }

/** Post - '/auth/change-password' - change password */
export const changePasswordFn = async (data: {
  id: string;
  oldPassword: string;
  newPassword: string;
  otp: string;
}) => {
  const res = await Request<ChangePasswordFnRes>({
    method: "post",
    url: "/api/auth/change-password",
    data,
  });

  return res.data;
};
export interface ChangePasswordFnRes { }

/** Post - '/auth/set-password' - set password */
export const setPasswordFn = async (data: {
  id: string;
  password: string;
  otp: string;
}) => {
  const res = await Request<SetPasswordFnRes>({
    method: "post",
    url: "/api/auth/set-password",
    data,
  });

  return res.data;
};
export interface SetPasswordFnRes { }

/** Post - '/auth/send-otp` - send otp */
export const sendOtpFn = async (email: string) => {
  const res = await Request<SendOtpFnRes>({
    method: "post",
    url: "/api/auth/send-otp",
    data: { email },
  });

  return res.data;
};
export interface SendOtpFnRes { }