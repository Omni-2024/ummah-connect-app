import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import {createCheckoutSessionFn, getPaymentsByUserIdFn, getSessionStatusFn} from "@/lib/endpoints/paymentFns";

export const useSessionStatus = (sessionId: string) => {
  return useQuery({
    queryKey: ["session-status", sessionId],
    queryFn: () => getSessionStatusFn(sessionId),
    enabled: !!sessionId,
  });
};

export const useCreateCheckoutSession = () => {
  return useMutation({
    mutationFn: createCheckoutSessionFn,
    mutationKey: ["create-checkout-session"],
  });
};

export const usePaymentsByUser = (
  userId: string,
  limit: number,
  offset: number,
) => {
  return useQuery({
    queryKey: ["paymentsByUser", userId, offset],
    queryFn: () => getPaymentsByUserIdFn(userId, limit, offset),
  });
};
