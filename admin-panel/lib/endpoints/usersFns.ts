import type { UserData } from "@/types/data";
import Request from "@/lib/http";
import type { R } from "@/lib/types/request";
import { isAxiosError } from "axios";

type GetAllGeneralUsersFnProps = {
    limit: number;
    offset: number;
};

type GetAllGeneralUsersFnResponse = {
    data: UserData[];
    meta: {
        total: number;
        limit: number;
        offset: number;
        query?: string;
    };
};

/** Get - '/user/all' - get all General Users with pagination */
export const getAllGeneralUsersFn = async (
    params: GetAllGeneralUsersFnProps
) => {
    try {
        const res = await Request<GetAllGeneralUsersFnResponse>({
            method: "get",
            url: "/api/user/all",
            params,
        });
        return res.data;
    } catch (e) {
        if (!isAxiosError(e)) throw e;

        if (e.status === 404)
            return { data: [], meta: { total: 0, limit: 0, offset: 0 } };

        throw e;
    }
};

/** Get - '/user/:id' - get General User by ID */
export const getGeneralUser = async (id?: string) => {
    if (!id) return {} as UserData;

    const res = await Request<UserData>({
        method: "get",
        url: `/api/user/${id}`,
    });
    return res.data;
};

/** Delete - '/user/:id' - delete General User */
export const deleteUserFn = async (id: string) => {
    const res = await Request<R<null>>({
        method: "delete",
        url: `/api/user/${id}`,
    });
    return res.data;
};

export const enableUser = async (id: string) => {
    const res = await Request<R<null>>({
        method: "patch",
        url: `/user/${id}`,
        data: { active: true },
    });
    return res.data;
};

export const changeUserStatusFn = async (data: {
    id: string;
    status: boolean;
}) => {
    const res = await Request<R<undefined>>({
        method: "patch",
        url: `/api/user/${data.id}/change-status`,
        data: { status: data.status },
    });
    return res.data.status === 200;
};

/** Update - '/user/:id' - update General User */
export const updateUserFn = async (data: {
  id: string
  name?: string
  designations?: string[]
  interests?: string[]
  profileImage?: string
  contactNumber?: string
  company?: string
  country?: string
  specializations?: string
  bio?: string; // ✅ added bio

}) => {
  const res = await Request<UserData>({
    method: "patch",
    url: `/api/user/${data.id}`,
    data,
  })
  return res.data
}