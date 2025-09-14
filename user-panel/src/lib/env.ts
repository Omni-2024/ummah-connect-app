const envs={
    backendBaseUrl : process.env.NEXT_PUBLIC_BACKEND_BASE_URL || '',
    mainBaseUrl : process.env.NEXT_PUBLIC_MAIN_BASE_URL || '',
    googleAuthClientId:process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID || '476764314833-a9748vmq2nc43q53k2jv3e2ithecmmj4.apps.googleusercontent.com',
    imageBaseUrl:process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_URL || '',
    streamApiKey:process.env.NEXT_PUBLIC_STREAM_API_KEY ||'',
}

export default envs;