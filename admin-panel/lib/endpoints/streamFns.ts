import Request from "@/lib/http";
import {USER_ROLES} from "@/lib/constants";

export interface GetCallDetailParams {
    meetingId: string;
    id: string;
}

export interface GetChatTokenParams {
 id: string;
 name: string;
 role: USER_ROLES;
}


export const getCallDetailsFn = async (params: GetCallDetailParams) => {
    try {
        const res = await Request<any>({
            method: "get",
            url: `/api/stream/calls/${params.meetingId}`,
        });
        const members = res.data.callDetails?.members ?? [];
        const user = members.find(
            (member: { user_id: string }) => member.user_id === params.id
        );
        if (!user) throw new Error("Unauthorized");

        return { role: user.user.role || "user", authorized: true, name: user.name };

    } catch (error) {
        console.error(error);
        return null;
    }

}

export const getStreamTokenFn = async (data: {
    userId: string,
    role: string
}) => {
    try {
        const res = await Request<any>({
            method: "post",
            url: `/api/stream/video-token/`,
            data,
        });
        return res.data;
    } catch (error) {
        console.error(error);
        return null;
    }

}

export const getStreamChatTokenFn = async (data: GetChatTokenParams) => {
    try {
        const res = await Request<any>({
            method: "post",
            url: `/api/stream/upsert-user/`,
            data,
        });
        return res.data.chatToken
    } catch (error) {
        console.error(error);
        return null;
    }

}

