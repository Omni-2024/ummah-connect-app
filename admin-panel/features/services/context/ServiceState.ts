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

export const courseState = proxy<ServiceState>(initialState);

export const setLimit = (limit: number) => {
  courseState.limit = limit;
};

export const setOffset = (offset: number) => {
  courseState.offset = offset;
};

export const setCMEUp = (cmeUp: number) => {
  courseState.cmeUp = cmeUp;
};

export const setCMEDown = (cmeDown: number) => {
  courseState.cmeDown = cmeDown;
};

export const setSearch = (search: string) => {
  courseState.search = search;
};

export const setIsPublished = (isPublished: boolean) => {
  courseState.isPublished = isPublished;
};

export const setProviders = (edu: string[]) => {
  courseState.providers = edu;
};

export const removeProviders = (id: string) => {
  // Filter out the educator by id
  courseState.providers = courseState.providers.filter(
    (providerId) => providerId !== id
  );
};

export const setProfession = (pro: string) => {
  courseState.profession = pro;
};


export const setSpecialist = (spe: string[]) => {
  courseState.specialist = spe;
};
