import { useQuery } from "@tanstack/react-query";
import {
  getOneServiceBySlugFn,
  getAllServicesFn, getOneServiceFn,
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
  educator: string;
}) => {
  return useQuery({
    queryKey: ["provider-services", params],
    queryFn: () => getAllServicesFn(params),
    enabled: !!params.limit && !!params.educator,
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

// export const useCourseEnrollmentStatus = (params: {
//   uid?: string;
//   course?: GetOneCourseDetailsFnRes | null;
// }) => {
//   return useQuery({
//     queryKey: ["enrollment-status-by-user", params],
//     queryFn: () =>
//       getCourseEnrollmentStatusFn({
//         uid: params.uid ?? "",
//         course: params.course as GetOneCourseDetailsFnRes,
//       }),
//     enabled: !!params.uid && !!params.course, // ! Should be enabled only when uid and course are present
//   });
// };
