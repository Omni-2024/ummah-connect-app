import { useSnapshot } from "valtio";
import { authState, login, logout } from "./AuthState";

export const useAuthState = () => {
    const snap = useSnapshot(authState);
    return {
        isAuthenticated: snap.isAuthenticated,
        accessToken: snap.accessToken,
        refreshToken: snap.refreshToken,
        role: snap.role,
        id: snap.id,
        //
        login: login,
        logout: logout,
    };
};
