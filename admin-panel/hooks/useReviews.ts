import {
  getReviewByProviderId,
  getReviewByServiceId, ReviewByProviderIdReq,
  ReviewByServiceIdReq,
  viewReviewByUserAndServiceId,
} from "@/lib/endpoints/reviewsFns";
import { useQuery } from "@tanstack/react-query";

export const useReviewByService = (data: ReviewByServiceIdReq, p0: { enabled: boolean; }) => {
  return useQuery({
    queryKey: ["reviewByService", data],
    queryFn: () => getReviewByServiceId(data),
    enabled: !!data.serviceId,
  });
};

export const useReviewByProvider = (data: ReviewByProviderIdReq, p0: { enabled: boolean; }) => {
  return useQuery({
    queryKey: ["reviewByProvider", data],
    queryFn: () => getReviewByProviderId(data),
    enabled: !!data.providerId,
  });
};

export const useViewReviewByUserAndServiceId = (data: {
  serviceId?: string;
  userId?: string;
}) => {
  return useQuery({
    queryKey: ["viewReviewByUserAndServiceId", data],
    queryFn: () => viewReviewByUserAndServiceId(data),
    enabled: !!data.serviceId && !!data.userId,
  });
};
