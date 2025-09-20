import Request, { WithPagination } from "@/lib/http";
import { isAxiosError } from "axios";

export type Review = {
  id: string;
  userId: string;
  serviceId: string;
  description: string;
  status: string;
  stars: number;
  createdAt: string;
  updatedAt: string;
  userName: string;
  userImageUrl: string;
};

export type ReviewByServiceIdReq = {
  serviceId: string;
  stars: number;
  limit: number;
  offset: number;
};
export const getReviewByServiceId = async (
  data: ReviewByServiceIdReq,
): Promise<WithPagination<Review>> => {
  try {
    const res = await Request<WithPagination<Review>>({
      method: "get",
      url: "/api/review/service",
      params: data,
    });
    return res.data;
  } catch (e) {
    if (isAxiosError(e)) {
      if (e.response?.status === 404) {
        return { data: [], meta: { total: 0, limit: 0, offset: 0 } };
      }
    }
    throw e;
  }
};

export const createReview = async (
  data: Pick<Review, "serviceId" | "description" | "userId" | "stars">,
): Promise<Review> => {
  const res = await Request<Review>({
    method: "post",
    url: "/api/review",
    data: {
      ...data,
      status: "pending",
    },
  });
  return res.data;
};

export const updateReview = async (
  data: Partial<Pick<Review, "description" | "stars">> & { id: string },
): Promise<Review> => {
  const res = await Request<Review>({
    method: "patch",
    url: `/api/review/${data.id}`,
    data,
  });
  return res.data;
};

export const viewReviewByUserAndServiceId = async (
  data: Partial<Pick<Review, "serviceId" | "userId">>,
): Promise<Review> => {
  const res = await Request<Review>({
    method: "get",
    url: `/api/review/user/${data.userId}/service/${data.serviceId}`,
  });
  return res.data;
};

export const deleteReview = async (id: string): Promise<void> => {
  await Request({
    method: "delete",
    url: `/api/review/${id}`,
  });
};
