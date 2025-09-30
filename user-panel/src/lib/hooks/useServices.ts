import { useQuery } from "@tanstack/react-query";
import {
  getOneServiceBySlugFn,
  getAllServicesFn, getOneServiceFn, GetOneServiceDetailsFnRes, getServiceEnrollmentStatusFn,
} from "@/lib/endpoints/serviceFns";
import { GetAllServiceParams } from "@/types";

export const useServices = (params: GetAllServiceParams) => {
  return useQuery({
    queryKey: ["services", params],
    queryFn: () => getAllServicesFn(params),
  });
};

export const useServicesHints = (params: GetAllServiceParams) => {
  return useQuery({
    queryKey: ["services-hints", params],
    queryFn: () => getAllServicesFn(params),
    enabled: !!params.limit && !!params.search,
  });
};

export const useServicesByEducator = (params: {
  limit: number;
  provider: string;
  userId:string
}) => {
  return useQuery({
    queryKey: ["provider-services", params],
    queryFn: () => getAllServicesFn(params),
    enabled: !!params.limit && !!params.provider,
  });
};

export const useService = (id: string) => {
  return useQuery({
    queryKey: ["service", id],
    queryFn: () => getOneServiceFn(id),
    enabled: !!id, // ! Should be enabled only when id is present
  });
};

export const useServiceBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["service-by-slug", slug],
    queryFn: () => getOneServiceBySlugFn(slug),
    enabled: !!slug, // ! Should be enabled only when slug is present
  });
};

export const useServiceEnrollmentStatus = (params: {
  uid?: string;
  service?: GetOneServiceDetailsFnRes | null;
}) => {
  return useQuery({
    queryKey: ["enrollment-status-by-user", params],
    queryFn: () =>
      getServiceEnrollmentStatusFn({
        uid: params.uid ?? "",
        service: params.service as GetOneServiceDetailsFnRes,
      }),
    enabled: !!params.uid && !!params.service, // ! Should be enabled only when uid and course are present
  });
};
