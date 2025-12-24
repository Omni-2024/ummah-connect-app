import { MAX_CME_POINTS } from "@/lib/constants";
import { proxy } from "valtio";

type ServiceState = {
  limit: number;
  offset: number;
  cmeUp: number;
  cmeDown: number;
  search: string;
  isPublished: boolean;
  providers: string[];
  profession: string;
  specialist: string[];
};

const initialState: ServiceState = {
  limit: 8,
  offset: 0,
  cmeUp: MAX_CME_POINTS,
  cmeDown: 0,
  search: "",
  isPublished: true,
  providers: [],
  profession: "",
  specialist: [],
};

export const serviceState = proxy<ServiceState>(initialState);

export const setLimit = (limit: number) => {
  serviceState.limit = limit;
};

export const setOffset = (offset: number) => {
  serviceState.offset = offset;
};

export const setCMEUp = (cmeUp: number) => {
  serviceState.cmeUp = cmeUp;
};

export const setCMEDown = (cmeDown: number) => {
  serviceState.cmeDown = cmeDown;
};

export const setSearch = (search: string) => {
  serviceState.search = search;
};

export const setIsPublished = (isPublished: boolean) => {
  serviceState.isPublished = isPublished;
};

export const setProviders = (edu: string[]) => {
  serviceState.providers = edu;
};

export const removeProviders = (id: string) => {
  // Filter out the educator by id
  serviceState.providers = serviceState.providers.filter(
    (providerId) => providerId !== id
  );
};

export const setProfession = (pro: string) => {
  serviceState.profession = pro;
};


export const setSpecialist = (spe: string[]) => {
  serviceState.specialist = spe;
};
