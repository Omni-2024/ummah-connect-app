import type { CategoryData } from "@/types/data";

import Request from "@/lib/http";
import { v4 as uuid } from "uuid";

/** Get - '/category'- get all categories.
 */
export const getCategoriesFn = async () => {
  const res = await Request<CategoryData[]>({
    method: "get",
    url: "/api/category",
  });
  return res.data.sort((a, b) => a.order - b.order);
};

export const addCategoryFn = async (data: Pick<CategoryData, "name">) => {
  const res = await Request<CategoryData>({
    method: "post",
    url: "/api/profession",
    data: {
      name: data.name,
      // TODO::: Update price correctly
      price: 5,
      professionId: uuid(),
      typeId: uuid(),
    },
  });
  return res.data;
};

export const removeCategoryFn = async (id: string) => {
  const res = await Request<CategoryData>({
    method: "delete",
    url: `/api/profession/${id}`,
  });
  return res.data;
};

export const updateCategoryNameFn = async (
  data: Pick<CategoryData, "name" | "id">
) => {
  const res = await Request<CategoryData>({
    method: "patch",
    url: `/api/profession/${data.id}`,
    data: {
      name: data.name,
    },
  });
  return res.data;
};




export const addSecondaryCategory = async (data: {
  name: string;
  professionId: string;
  typeId: string;
}) => {
  const res = await Request<CategoryData>({
    method: "post",
    url: "/api/specialist",
    data: {
      name: data.name,
      price: 5,
      professionId: data.professionId,
      typeId: data.typeId,
    },
  });
  return data;
};

export const removeSecondaryCategory = async (id: string) => {
  const res = await Request<CategoryData>({
    method: "delete",
    url: `/api/specialist/${id}`,
  });
  return res.data;
};

export const updateSecondaryCategoryNameFn = async (data: {
  name: string;
  id: string;
  professionId: string;
  typeId: string;
  price: number;
}) => {
  const res = await Request<CategoryData>({
    method: "patch",
    url: `/api/specialist/${data.id}`,
    data: {
      name: data.name,
      professionId: data.professionId,
      typeId: data.typeId,
      price: data.price,
      id: data.id,
    },
  });
  return data;
};

/** Get - '/profession/:id' - get profession by id */
export const getProfessionByIdFn = async (id: string) => {
  try {
    const res = await Request<CategoryData>({
      method: "get",
      url: `/api/profession/${id}`,
    });
    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

/** Get - '/profession` - get all professions */
export const getProfessionsFn = async () => {
  try {
    const res = await Request<CategoryData[]>({
      method: "get",
      url: "/api/profession",
    });
    return res.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const updateCategoryOrderFn = async (data: {
  newData: CategoryData[];
  oldData: CategoryData[];
}) => {
  const oldOrderMap = new Map(
    data.oldData.map((item, i) => [item.id, item.order])
  );

  // Find items with changed order
  const changedItems = data.newData
    .map((item, index) => ({
      id: item.id,
      order: index,
    }))
    .filter((item) => oldOrderMap.get(item.id) !== item.order);

  if (changedItems.length === 0) {
    return true;
  }

  const requests = changedItems.map((item) => {
    return Request<CategoryData>({
      method: "patch",
      url: `/api/profession/${item.id}`,
      data: {
        order: item.order,
      },
    });
  });

  await Promise.all(requests);

  return true;
};
