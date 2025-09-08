import Request from "@/lib/http";

export const uploadPublicFn = async (data: { imageFile: File }) => {
    const formData = new FormData();
    formData.append("file", data.imageFile);

    const res = await Request<UploadPublicFnRes>({
        method: "post",
        url: "/api/files/upload",
        data: formData,
    });

    return res.data;
};

export interface UploadPublicFnRes {
    key: string;
    url: string;
}
