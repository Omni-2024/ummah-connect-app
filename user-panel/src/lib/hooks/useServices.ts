import { useQuery } from "@tanstack/react-query";
import {
  getAllCoursesFn,
  // getServiceEnrollmentStatusFn,
  getOneServiceBySlugFn,
  GetOneServiceDetailsFnRes,
  getOneCourseFn,
} from "@/lib/endpoints/serviceFns";
import { GetAllServiceParams } from "@/types";

export const useServices = (params: GetAllServiceParams) => {
  return useQuery({
    queryKey: ["courses", params],
    queryFn: () => getAllCoursesFn(params),
  });
};

export const useCoursesHints = (params: GetAllServiceParams) => {
  return useQuery({
    queryKey: ["courses-hints", params],
    queryFn: () => getAllCoursesFn(params),
    enabled: !!params.limit && !!params.search,
  });
};

export const useCoursesByEducator = (params: {
  limit: number;
  educator: string;
}) => {
  return useQuery({
    queryKey: ["educator-courses", params],
    queryFn: () => getAllCoursesFn(params),
    enabled: !!params.limit && !!params.educator,
  });
};

export const useCourse = (id: string) => {
  return useQuery({
    queryKey: ["course", id],
    queryFn: () => getOneCourseFn(id),
    enabled: !!id, // ! Should be enabled only when id is present
  });
};

export const useCourseBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["course-by-slug", slug],
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
