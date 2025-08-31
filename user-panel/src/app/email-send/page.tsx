// app/email-send/page.tsx
"use client";

import { Sms as SmsIcon } from "iconsax-react";
import CardWrapper from "@/features/auth/components/CardWrapper";
import { useRouter } from "next/router";
import Button from "@/components/base/Button";
import { useForgotPasswordState } from "@/features/auth/context/useForgotPasswordState";

const EmailSentRoute = () => {
    const router = useRouter();
    //
    const { email } = useForgotPasswordState();
    //
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
                    <div className="mb-4 mt-4 flex size-12 items-center justify-center rounded-full bg-tertiary-50 md:mt-0">
                        <SmsIcon className="size-6 text-tertiary-500" />
                    </div>
                    <div className="flex w-10/12 flex-col items-center space-y-1">
                        <h1 className="text-center font-primary text-2xl font-semibold">
                            Check your inbox
                        </h1>

                        <p className="text-center text-sm text-dark-300">
                            We sent you a verification link to verify your email address.
                            Please click on the verification link sent to{" "}
                            <span className="font-semibold">{email}</span>
                        </p>

                        <Button
                            className="py-10"
                            variant={"link"}
                            onClick={() => {
                                router.push("/user/signup");
                            }}
                        >
                            Sign up with different email
                        </Button>
                    </div>
                </CardWrapper>
            </div>
        </main>
    );
};
export default EmailSentRoute;