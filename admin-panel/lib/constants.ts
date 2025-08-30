export enum USER_ROLES {
  GENERAL_USER = "general_user",
  BUSINESS_USER = "business_user",
  BUSINESS_ADMIN = "business_admin",
}

export enum ADMIN_ROLES {
  NONE = "none",
  ADMIN = "admin",
  OPERATIONAL_ADMIN = "operational_admin",
  ROOT = "root",
}

export const USER_ROLE_LOGINS = {
  [USER_ROLES.GENERAL_USER]: "/user/login",
  [USER_ROLES.BUSINESS_USER]: "/business/login",
  [USER_ROLES.BUSINESS_ADMIN]: "/business-admin/login",
};

export const ColorPalatte = {
  black: "#1C1C1C",
  whiteBg: "#F6F6F6",
  status: {
    red: "#CB2E27",
    blue: "#0C6FBF",
    green: "#2A7E2E",
    yellow: "#FFAD0D",
  },
  primary: {
    50: "#F3FAFA",
    100: "#C9E7E8",
    200: "#9ED5D6",
    300: "#74C2C4",
    400: "#49B0B2",
    500: "#187E80",
    600: "#1F9EA0",
    700: "#125E60",
    800: "#0C3F40",
    900: "#061F1F",
  },
  secondary: {
    50: "#F2F7F7",
    100: "#C1D8D8",
    200: "#91BABA",
    300: "#609C9C",
    400: "#307E7E",
    500: "#006060",
    600: "#004C4C",
    700: "#003939",
    800: "#002626",
    900: "#001313",
  },
  tertiary: {
    50: "#FEF8F3",
    100: "#FCE0C9",
    200: "#FAC89F",
    300: "#F8B074",
    400: "#F6984A",
    500: "#F58120",
    600: "#C46719",
    700: "#934D13",
    800: "#62330C",
    900: "#301906",
  },
  accent: {
    50: "#FEFAF4",
    100: "#FEEACE",
    200: "#FDDAA7",
    300: "#FCCA81",
    400: "#FBBA5A",
    500: "#FBAB34",
    600: "#C88829",
    700: "#96661F",
    800: "#644414",
    900: "#32220A",
  },
  dark: {
    50: "#F3F3F3",
    100: "#C8C8C8",
    200: "#9D9D9D",
    300: "#727272",
    400: "#474747",
    500: "#1C1C1C",
    600: "#161616",
    700: "#101010",
    800: "#0B0B0B",
    900: "#050505",
  },
};
export const MAX_CME_POINTS = 15;
export const AUTH_STORAGE_KEY = "token";

export enum SubscriptionPlanType {
  CATEGORY = "category",
  UNLIMITED = "unlimited",
}