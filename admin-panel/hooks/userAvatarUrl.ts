// src/lib/hooks/useAvatarUrl.ts
"use client";

import { useMemo } from "react";
import envs from "@/lib/env";

type UseAvatarUrlOptions = {
    base?: string;
    fallback?: string; // default to a valid placeholder URL
};

const ABSOLUTE_URL = /^https?:\/\//i;
const DEFAULT_AVATAR = "/avatar-placeholder.png"; // ensure this exists in /public

function joinUrl(base: string, path: string) {
    const b = base?.endsWith("/") ? base.slice(0, -1) : base || "";
    const p = path?.startsWith("/") ? path.slice(1) : path || "";
    return b ? `${b}/${p}` : p;
}

export function useAvatarUrl(
    img?: string | null,
    opts: UseAvatarUrlOptions = {}
): string {
    const base =
        opts.base ??
        envs?.imageBaseUrl ??
        (process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_URL as string | undefined) ??
        "";

    return useMemo(() => {
        if (!img || img.trim() === "") return opts.fallback ?? DEFAULT_AVATAR;
        if (ABSOLUTE_URL.test(img)) return img;
        return joinUrl(base, img);
    }, [img, base, opts.fallback]);
}
