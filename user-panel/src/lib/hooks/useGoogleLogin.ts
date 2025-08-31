import {useGoogleLogin as useGoogle} from "@react-oauth/google";
import {useMutation} from "@tanstack/react-query";
import {useRef} from "react";
import {socialLoginFn} from "@/lib/endpoints/authenticationFns";
import {getErrorMessage} from "@/lib/helpers/errors";
import {Toast} from "@/components/base/Toast";
import {useRouter,useSearchParams} from "next/navigation";
import {useAuthState} from "@/features/auth/context/useAuthState";
import {SOCIAL_TYPE} from "@/lib/constants";
import type {LoginAction} from "@/lib/helpers/urls";

export const useGoogleLogin = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Read query params via App Router API
    const action = (searchParams.get("_action") as LoginAction) || undefined;
    const callbackParam = searchParams.get("_callback") || undefined;

    const {login} = useAuthState();

    // Prevent multiple mutation triggers
    const mutationTriggeredRef = useRef(false);

    const {mutate: googleLoginMutate, isPending: googleLoginIsPending} =
        useMutation({mutationFn: socialLoginFn});

    const googleLogin = useGoogle({
        onSuccess: (response) => {
            if (mutationTriggeredRef.current) return; // Prevent second trigger
            mutationTriggeredRef.current = true; // Mark as triggered

            // Send code to the server to get the JWT token
            googleLoginMutate(
                {
                    accessToken: response.access_token,
                    type: SOCIAL_TYPE.GOOGLE,
                },
                {
                    onSuccess: (res) => {
                        // Update the auth state
                        login(
                            res.token,
                            res.refreshToken,
                            res.role,
                            res.id,
                            res.isFirstLogin,
                        );

                        let redirectUrl = "/";

                        if (action && callbackParam) {
                            try {
                                // Decode the callback URL and ensure it's valid
                                const decodedCallback = decodeURIComponent(callbackParam);
                                const url = new URL(decodedCallback, window.location.origin);

                                // Only use the callback if it's from the same origin
                                if (url.origin === window.location.origin) {
                                    url.searchParams.set("_action", action);
                                    redirectUrl = url.toString();
                                }
                            } catch (e) {
                                console.error("Invalid callback URL:", e);
                            }
                        } else if (res.isFirstLogin) {
                            redirectUrl = "/onboarding";
                        }

                        router.push(redirectUrl);
                    },
                    onError: (err:any) => {
                        const message = getErrorMessage(err);
                        Toast.error(message);
                    },
                },
            );
        },
        onError: (error) => {
            console.log(error);
        },
    });

    return {
        googleLogin,
        googleLoginIsPending,
    };
};
