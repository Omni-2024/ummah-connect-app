import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        // ✅ hostnames only (no protocol, no path)
        domains: [
            "pub-08208f7576844a018495f0edfac47490.r2.dev", // replace with your real public host
            // "cdn.yourdomain.com",                        // if you mapped a custom domain
            // "5ce46b8075c72e337577b3e116da44a5.r2.cloudflarestorage.com", // only if you truly serve from API endpoint (not recommended)
        ],

        // OR you can use remotePatterns instead of domains:
        // remotePatterns: [
        //   { protocol: "https", hostname: "pub-08208f7576844a018495f0edfac47490.r2.dev" },
        //   // { protocol: "https", hostname: "cdn.yourdomain.com" },
        // ],
    },
};

export default nextConfig;
