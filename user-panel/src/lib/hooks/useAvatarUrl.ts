// src/lib/hooks/useAvatarUrl.ts
"use client";

import { useMemo } from "react";
import envs from "@/lib/env";

type UseAvatarUrlOptions = {
    /** Override the public base URL (defaults to envs.imageBaseUrl or NEXT_PUBLIC_R2_PUBLIC_BASE_URL) */
    base?: string;
    /** Value to return when img is empty/undefined */
    fallback?: string | null;
};

const ABSOLUTE_URL = /^https?:\/\//i;

function joinUrl(base: string, path: string) {
    if (!base) return path;
    const b = base.endsWith("/") ? base.slice(0, -1) : base;
    const p = path.startsWith("/") ? path.slice(1) : path;
    return `${b}/${p}`;
}

export function useAvatarUrl(
    img?: string | null,
    opts: UseAvatarUrlOptions = {}
): string | null {
    const base =
        opts.base ??
        envs?.imageBaseUrl ??
        (process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_URL as string | undefined) ??
        "";

    const url = useMemo(() => {
        if (!img || img.trim() === "") return opts.fallback ?? null;
        if (ABSOLUTE_URL.test(img)) return img;
        return joinUrl(base, img);
    }, [img, base, opts.fallback]);

    return url;
}
