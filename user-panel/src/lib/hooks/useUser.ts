import { useQuery } from "@tanstack/react-query";
import { getUserByIdFn } from "@/lib/endpoints/userFns";
import { authState } from "@/features/auth/context/AuthState";
import {useAuthState} from "@/features/auth/context/useAuthState";

export const useCurrentUser = () => {
  // Get the logged in user's id from the auth state
  const { isAuthenticated, accessToken,id } = useAuthState();

  return useQuery({
    queryKey: ["currentUser", id],
    queryFn: () => getUserByIdFn(id),
    enabled: isAuthenticated && !!accessToken,
    retry: (count, err: any) =>
        (err?.response?.status ?? 0) !== 401 && count < 2, // don't loop on 401
  });
};

export const useGeneralUser = (id?: string) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserByIdFn(id ?? ""),
    enabled: !!id,
  });
};
