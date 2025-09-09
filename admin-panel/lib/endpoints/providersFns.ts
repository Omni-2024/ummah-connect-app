import Request from "@/lib/http";
import {isAxiosError} from "axios";
import type {UserData} from "@/types/data";
import type {R} from "@/lib/types/request";
import {USER_ROLES} from "@/lib/constants";

type GetAllGeneralProvidersFnProps = {
    limit: number;
    offset: number;
};

type GetAllGeneralProvidersFnResponse = {
    data: UserData[];
    meta: {
        total: number;
        limit: number;
        offset: number;
        query?: string;
    };
};

export const getAllGeneralProvidersFn = async (
    params: GetAllGeneralProvidersFnProps
) => {
    try {
        const res = await Request<GetAllGeneralProvidersFnResponse>({
            method: "get",
            url: "/api/provider/all",
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

export const changeProviderRoleFn = async (data: {
    id: string;
    role: USER_ROLES;
}) => {
    const res = await Request<R<undefined>>({
        method: "patch",
        url: `/api/user/${data.id}/change-role`,
        data: { role: data.role },
    });
    return res.data.status === 200;
};
