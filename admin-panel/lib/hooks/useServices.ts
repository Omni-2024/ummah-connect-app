import { useQuery } from "@tanstack/react-query";
import {
  getAllServicesFn,
  getServiceDataFn,
  getServiceFullDataFn,
  type GetAllServiceParams,
} from "@/lib/endpoints/serviceFns";

export const useServices = (params: GetAllServiceParams) => {
  return useQuery({
    queryKey: ["services", params],
    queryFn: () => getAllServicesFn(params),
  });
};

export const useCourseAllData = (id?: string) => {
  return useQuery({
    queryKey: ["serviceAllData", id],
    queryFn: () => getServiceFullDataFn(id ?? ""),
    enabled: !!id,
  });
};

export const useCourseById = (id?: string) => {
  return useQuery({
    queryKey: ["serviceById", id],
    queryFn: () => getServiceDataFn(id ?? ""),
    enabled: !!id,
  });
};
