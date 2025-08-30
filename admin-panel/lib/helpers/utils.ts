import envs from "@/lib/env";
import CryptoJS from "crypto-js";

export const encrypt = (text: string, key?: string) => {
    return CryptoJS.AES.encrypt(text, key ?? envs.secretKey).toString();
};

export const decrypt = (text: string, key?: string) => {
    return CryptoJS.AES.decrypt(text, key ?? envs.secretKey).toString(
        CryptoJS.enc.Utf8
    );
};

export const isEmpty = <T>(obj: Record<string, T>): boolean => {
    if (obj === null || obj === undefined) return true;
    if (typeof obj !== "object") return true;
    for (const key in obj) if (key in obj) return false;
    return true;
};
