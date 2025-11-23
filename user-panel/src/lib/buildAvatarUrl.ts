import envs from "@/lib/env";

export const buildAvatarUrl = (img?: string | null): string | null => {
    if (!img) return null
    if (/^https?:\/\//i.test(img)) return img
    const base = envs.imageBaseUrl
    return `${base}/${img}`
}
