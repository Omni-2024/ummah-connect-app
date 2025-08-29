import { useSnapshot } from "valtio"
import { AuthState, authState, login, logout, setIsFirstLogin } from "./AuthState"

export const useAuthState = () => {
    const snap = useSnapshot(authState)
    return {
        isAuthenticated:snap.isAuthenticated,
        accessToken:snap.accessToken,
        refreshToken: snap.refreshToken,
        role: snap.role,
        id:snap.id,
        isFirstLogin:snap.isFirstLogin,


        login:login,
        logout:logout,

        setIsFirstLogin: setIsFirstLogin,
    }
}