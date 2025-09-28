const envs={
    backendBaseUrl : process.env.NEXT_PUBLIC_BACKEND_BASE_URL || '',
    mainBaseUrl : process.env.NEXT_PUBLIC_MAIN_BASE_URL || '',
    googleAuthClientId:process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID || '',
    imageBaseUrl:process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_URL || '',
    streamApiKey:process.env.NEXT_PUBLIC_STREAM_API_KEY ||'',
    stripePublishableKey:process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||'',
}

export default envs;