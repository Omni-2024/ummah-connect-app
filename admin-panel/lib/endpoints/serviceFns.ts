import { setLimit, setOffset } from "@/features/services/context/ServiceState";
import type { ServiceDetailsAPI } from "@/features/services/types/addService";
import Request from "@/lib/http";
import {getQuestionsFn, QuestionDBtype} from "@/lib/endpoints/faqFns";

export interface GetAllServiceParams {
  limit?: number;
  offset?: number;
  search?: string;
  provider?: string;
  profession?: string;
  specialties?: string[];
  isPublished?: boolean;
  providers?: string[];
}

export const getAllServicesFn = async (params: GetAllServiceParams) => {
  try {
    const res = await Request<GetAllServicesFnRes>({
      method: "get",
      url: "/api/service/all",
      params,
    });
    return res.data;
  } catch (error) {
    console.error(error);
    setLimit(9);
    setOffset(0);
    return { data: [], meta: { total: 0, limit: null, offset: null } };
  }
};

export interface GetAllServicesFnRes {
  data: Service[];
  meta: Meta;
}

export interface Service {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  version: number;
  title: string;
  tagline: string;
  description: string;
  cmePoints: number;
  coverImageUrl: string;
  providerId: string;
  price: number;
  cmeId: string;
  totalReviewScore: string;
  totalReviewCount: string;
  averageReviewScore: string;
  specialtyId: string;
  professionId: string;
  learningPoints: string[];
  discount: number;
  discountEnabled: boolean;
  duration: number;
  isPublished: boolean;
  isArchived: boolean;
  slug: string;
  enrollmentCount: number;
}

export interface Meta {
  total: number;
  limit: number | null;
  offset: number | null;
}

/** Post - '/api/service' - create a course */
export const createServiceFn = async (data: CreateServiceFnArgs) => {
  const res = await Request<Service>({
    method: "post",
    url: "/api/service",
    data,
  });
  return res.data;
};

export interface CreateServiceFnArgs {
  title: string;
  tagline: string;
  description: string;
  coverImageUrl: string;
  providerId: string;
  price: number;
  specialtyId?: string | null;
  professionId: string;
  learningPoints: string[];
  discount: number;
  discountEnabled: boolean;
}

/** Patch - '/api/service/:id' - update a service */
export const updateServiceFn = async ({
  id,
  data,
}: {
  id: string;
  data: UpdateServiceFnArgs;
}) => {
  const res = await Request<Service>({
    method: "patch",
    url: `/api/service/${id}`,
    data,
  });
  return res.data;
};

export interface UpdateServiceFnArgs {
  title?: string;
  tagline?: string;
  description?: string;
  coverImageUrl?: string;
  providerId?: string;
  price?: number;
  specialtyId?: string | null;
  professionId?: string | null;
  learningPoints?: string[];
  discount?: number;
  discountEnabled?: boolean;
  duration?: number;
  isPublished?: boolean;
}

type GetAllServicesData = {
  categoryData: {
    profession: string;
    specialist: string;
    provider: string;
  };
  detailsData: {
    serviceTitle: string;
    serviceDescription: string;
    coverImage: string;
    previewDescription: string;
    learningPoints: string[];
    pricing: number;
    discount: number;
    discountOn: boolean;
  };
  faqData:QuestionDBtype[]
};

export const getServiceFullDataFn = async (
  id: string
): Promise<GetAllServicesData> => {
  const [serviceDetails,_faqData] = await Promise.all([
    Request<ServiceDetailsAPI>({
      method: "get",
      url: `/api/service/detail/${id}`,
    }),
    getQuestionsFn(id)
  ]);
  const categoryData = {
    profession: serviceDetails.data.profession?.id,
    specialist: serviceDetails.data.specialty?.id,
    provider: serviceDetails.data.provider.id,
  };

  const detailsData = {
    serviceTitle: serviceDetails.data.title,
    serviceDescription: serviceDetails.data.description,
    coverImage: serviceDetails.data.coverImageUrl,
    previewDescription: serviceDetails.data.tagline,
    learningPoints: serviceDetails.data.learningPoints,
    pricing: serviceDetails.data.price,
    discount: serviceDetails.data.discount,
    discountOn: serviceDetails.data.discountEnabled,
    duration: serviceDetails.data.duration,
  };

  const faqData=_faqData


  return { categoryData, detailsData ,faqData};
};

export const archiveServiceFn = async (id: string) => {
  const res = await Request<Service>({
    method: "delete",
    url: `/api/service/${id}`,
  });
  return res.data;
};

export const getServiceDataFn = async (id: string) => {
  const res = await Request<ServiceDetailsAPI>({
    method: "get",
    url: `/api/service/detail/${id}`,
  });
  return res.data;
};
