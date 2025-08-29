import { AxiosError } from "axios";

export const getErrorMessage = (
    axiosError: AxiosError<{ message?: string }>,
    customErrorMessage: string = "Something went wrong!",
) => {
    if (axiosError.isAxiosError) {
        const errorMsgAxios = axiosError.response?.data?.message;
        if (!errorMsgAxios?.trim()) return customErrorMessage;
        return errorMsgAxios;
    } else {
        return customErrorMessage;
    }
};
