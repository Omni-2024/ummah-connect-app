import { Profession } from "@/types";
import Request from "@/lib/http";

/** Get - '/category' - get all categories */
export const getAllCategoriesFn = async () => {
  try {
    const res = await Request<Profession[]>({
      method: "get",
      url: "/api/category",
    });
    // return res.data;
    /**
     * Checking if the categories is an array or not
     * Reason: Backend isn't updated yet
     */
    if (Array.isArray(res.data)) {
      return res.data;
    } else {
      return [];
    }
  } catch (error) {
    console.error(error);
    return [];
  }
};

/** Get - '/profession/:id' - get profession by id */
export const getProfessionByIdFn = async (id: string) => {
  try {
    const res = await Request<GetProfessionByIdFnRes>({
      method: "get",
      url: `/api/profession/${id}`,
    });
    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};


export interface GetProfessionByIdFnRes {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  version: number;
  name: string;
  price: number;
}

/** Get - '/profession' - get all professions */
export const getAllProfessionsFn = async () => {
  try {
    const res = await Request<GetAllProfessionsFnRes[]>({
      method: "get",
      url: "/api/profession",
    });
    return res.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getAllSpecialistByProfessionIdFn = async (professionId: string) => {
  try {
    const res = await Request<GetAllTypesByProfessionIdFnRes[]>({
      method: "get",
      url: "/api/specialist",
      params: {
        professionId,
      },
    });
    return res.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export interface GetAllProfessionsFnRes {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  version: number;
  name: string;
  price: number;
}



export interface GetAllTypesByProfessionIdFnRes {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  version: number;
  name: string;
  price: number;
  professionId: string;
}