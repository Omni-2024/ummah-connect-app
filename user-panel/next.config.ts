import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        // ✅ hostnames only (no protocol, no path)
        domains: [
            "pub-08208f7576844a018495f0edfac47490.r2.dev",
            "lh3.googleusercontent.com",
        ],

        // OR you can use remotePatterns instead of domains:
        // remotePatterns: [
        //   { protocol: "https", hostname: "pub-08208f7576844a018495f0edfac47490.r2.dev" },
        //   // { protocol: "https", hostname: "cdn.yourdomain.com" },
        // ],
    },
};

export default nextConfig;
