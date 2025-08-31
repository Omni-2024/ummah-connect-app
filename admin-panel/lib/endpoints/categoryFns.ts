import type { CategoryData } from "@/types/data";
import Request from "@/lib/http";

export const getCategoriesFn = async () => {
  const res = await Request<CategoryData[]>({
    method: "get",
    url: "/api/category",
  });
  return res.data;
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

export interface Specialist {
  id: string;
  name: string;
  price: number;
  professionId: string;
  typeId: string;
}



export interface Profession {
  id: string;
  name: string;
  price: number;
}
