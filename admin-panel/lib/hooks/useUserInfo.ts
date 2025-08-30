import { authState } from "@/features/auth/context/AuthState";
import { getGeneralUser } from "@/lib/endpoints/usersFns";
import { useQuery } from "@tanstack/react-query";

export const useUserInfo = (id?: string) => {
    return useQuery({
        queryKey: ["user_one", "general", id ?? ""],
        queryFn: () => getGeneralUser(id),
    });
};

export const useCurrentUser = () => {
    const id = authState.id;
    return useQuery({
        queryKey: ["currentUser", id],
        queryFn: () => getGeneralUser(id),
        enabled: !!id,
    });
};
