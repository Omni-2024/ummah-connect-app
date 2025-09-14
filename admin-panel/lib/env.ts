const envs={
    backendBaseUrl : process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3035',
    mainBaseUrl : process.env.NEXT_PUBLIC_MAIN_BASE_URL || '',
    googleAuthClientId:process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID || '476764314833-a9748vmq2nc43q53k2jv3e2ithecmmj4.apps.googleusercontent.com',
    secretKey: process.env.NEXT_PUBLIC_SECRET_KEY || "secretKey",
    disableAuthReDir: process.env.NEXT_PUBLIC_DISABLE_AUTH_REDIRECT === "true",
    imageBaseUrl: process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_URL || "",
    streamApiKey: process.env.NEXT_PUBLIC_STREAM_API || ""
}

export default envs;