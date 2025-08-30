"use client"
import Spinner from "@/components/base/Spinner";
import CardWrapper from "@/features/auth/components/CardWrapper";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation"; // ✅ useSearchParams
import { useEffect, useState } from "react";
import Button from "@/components/base/Button";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { verifyEmailFn } from "@/lib/endpoints/authenticationFns";

const VerifyEmailRoute = () => {
    const router = useRouter();
    const searchParams = useSearchParams(); // ✅ get URL query params
    const [isVerificationStarted, setVerificationStarted] = useState(false);

    const {
        mutate: verifyEmail,
        isPending: isVerifyingEmail,
        isError: verifyEmailError,
    } = useMutation({
        mutationFn: verifyEmailFn,
        onSuccess: () => {
            router.push("/user/login");
        },
    });

    useEffect(() => {
        const token = searchParams.get("token"); // ✅ read token from ?token=...
        if (token) {
            setVerificationStarted(true);
            verifyEmail(token);
        }
    }, [searchParams, verifyEmail]);

    const mainText = isVerificationStarted
        ? isVerifyingEmail
            ? "Hang on while we verify your email!"
            : verifyEmailError
                ? "Email verification unsuccessful"
                : "Email verified successfully"
        : "Starting email verification...";

    const descriptionText = isVerificationStarted
        ? isVerifyingEmail
            ? "Please wait while we verify your email."
            : verifyEmailError
                ? "We couldn't verify your email. Please try again or check for any errors in the link. If the issue persists, contact our support team for assistance."
                : "Your email has been successfully verified. You can now explore MedLearning and access all the features to enhance your medical knowledge. Let's get started!"
        : "Please wait while we verify your token.";

    return (
        <main
            style={{ backgroundImage: "url(/images/textures/1.svg)" }}
            className="h-screen overflow-y-scroll scrollbar-thin"
        >
            <div className="flex w-full items-center justify-center pt-6">
                <img
                    alt="logo"
                    src="/images/logo.svg"
                    className="h-14 object-contain"
                />
            </div>

            <div className="container flex min-h-[calc(100vh-10rem)] flex-row items-center justify-center py-8 lg:min-h-[calc(100vh-5rem)]">
                <CardWrapper className="flex flex-col items-center justify-center lg:w-1/2">
                    {isVerificationStarted ? (
                        isVerifyingEmail ? (
                            <Spinner classname="mb-4 mt-4 size-14 text-primary-500" />
                        ) : verifyEmailError ? (
                            <div className="mb-4 mt-4 flex size-12 items-center justify-center rounded-full bg-red-50 md:mt-0">
                                <XMarkIcon className="size-6 text-tertiary-500" />
                            </div>
                        ) : (
                            <div className="mb-4 mt-4 flex size-12 items-center justify-center rounded-full bg-primary-50 md:mt-0">
                                <CheckIcon className="size-6 text-primary-500" />
                            </div>
                        )
                    ) : (
                        <Spinner classname="size-14 text-primary-500" />
                    )}

                    <div className="flex w-10/12 flex-col items-center space-y-5">
                        <h1 className="text-center font-primary text-2xl font-semibold">
                            {mainText}
                        </h1>

                        <p className="text-center text-sm text-dark-300">
                            {descriptionText}
                        </p>

                        {!isVerifyingEmail && isVerificationStarted && (
                            <Button
                                variant={"link"}
                                onClick={() => {
                                    if (verifyEmailError) {
                                        router.push("/contact-support");
                                    }
                                }}
                            >
                                {verifyEmailError
                                    ? "Contact support team"
                                    : "You'll be redirected shortly to MedLearning..."}
                            </Button>
                        )}
                    </div>
                </CardWrapper>
            </div>
        </main>
    );
};

export default VerifyEmailRoute;
