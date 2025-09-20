import {
  getReviewByServiceId,
  ReviewByServiceIdReq,
  viewReviewByUserAndServiceId,
} from "@/lib/endpoints/reviewFns";
import { useQuery } from "@tanstack/react-query";

export const useReviewByService = (data: ReviewByServiceIdReq) => {
  return useQuery({
    queryKey: ["reviewByService", data],
    queryFn: () => getReviewByServiceId(data),
    enabled: !!data.serviceId,
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
