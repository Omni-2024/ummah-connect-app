import { ADMIN_ROLES, AUTH_STORAGE_KEY } from "@/lib/constants";
import { decrypt, encrypt } from "@/lib/helpers/utils";
import { proxy, subscribe } from "valtio";

export type AuthState = {
    isAuthenticated: boolean;
    accessToken: string;
    refreshToken: string;
    role: ADMIN_ROLES;
    id: string;
};

const initialState: AuthState = {
    isAuthenticated: false,
    accessToken: "",
    refreshToken: "",
    role: ADMIN_ROLES.NONE,
    id: "",
};

// Load state from localStorage
const savedState =
    typeof window !== "undefined" ? localStorage.getItem(AUTH_STORAGE_KEY) : null;

let parsedState: AuthState;
try {
    if (savedState) {
        const decryptedState = decrypt(savedState);
        parsedState = JSON.parse(decryptedState);
    } else {
        parsedState = initialState;
    }
} catch (error) {
    console.error("Failed to parse or decrypt state from localStorage:", error);
    parsedState = initialState;
}

export const authState = proxy<AuthState>(parsedState);

// encrypt and store state in localStorage
if (typeof window !== "undefined") {
    subscribe(authState, () => {
        try {
            const encryptedState = encrypt(JSON.stringify(authState));
            localStorage.setItem(AUTH_STORAGE_KEY, encryptedState);
        } catch (error) {
            console.error("Failed to encrypt or store state in localStorage:", error);
        }
    });
}

type LoginParams = {
    accessToken: string;
    refreshToken: string;
    role: ADMIN_ROLES;
    id: string;
};

export const login = ({ accessToken, refreshToken, role, id }: LoginParams) => {
    authState.isAuthenticated = true;
    authState.accessToken = accessToken;
    authState.refreshToken = refreshToken;
    authState.role = role;
    authState.id = id;
};

export const logout = () => {
    authState.isAuthenticated = false;
    authState.accessToken = "";
    authState.refreshToken = "";
    authState.role = ADMIN_ROLES.NONE;
    authState.id = "";
};
