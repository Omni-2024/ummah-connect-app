import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import {createCheckoutSessionFn, GetAllPaymentsFnRes, getPaymentsByUserIdFn, getSessionStatusFn} from "@/lib/endpoints/paymentFns";

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
    queryFn: async () => {
      const res = await getPaymentsByUserIdFn(userId, limit, offset);

      // Normalize the shape to always be { data: Payment[], meta: Meta }
      if (res && (res as any).data?.data) {
        // API returned nested structure { data: { data: Payment[], meta: Meta } }
        return {
          data: (res as any).data.data,
          meta: (res as any).data.meta,
        } as GetAllPaymentsFnRes;
      }

      // API already returned correct structure
      return res as GetAllPaymentsFnRes;
    },
  });
};

