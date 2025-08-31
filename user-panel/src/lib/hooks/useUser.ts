import { useQuery } from "@tanstack/react-query";
import { getUserByIdFn } from "@/lib/endpoints/userFns";
import { authState } from "@/features/auth/context/AuthState";

export const useCurrentUser = () => {
  // Get the logged in user's id from the auth state
  const id = authState.id;
  //
  return useQuery({
    queryKey: ["currentUser", id],
    queryFn: () => getUserByIdFn(id),
    enabled: !!id, // ! Should be enabled only when id is present
  });
};
