"use client"
import PaymentProcessingCard from "@/features/checkout/components/PaymentProcessingCard";
import PaymentSuccessCard from "@/features/checkout/components/PaymentSuccessCard";
// import { enrollUserToCourseFn } from "@lib/endpoints/enrollmentFns";
import { generateSlug } from "@/lib/helpers/strings";
import { useService } from "@/lib/hooks/useServices";
import { useSessionStatus } from "@/lib/hooks/usePayments";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const PaymentProcessing = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [sessionId, setSessionId] = useState("");

    const { data: session, isError: isSessionError } =
        useSessionStatus(sessionId);
    const { data: service } = useService(session?.metadata?.service_id ?? "");

    // const {
    //     mutate: enrollUser,
    //     isPending: isUserEnrolling,
    //     isError: isEnrollmentError,
    // } = useMutation({
    //     mutationFn: enrollUserToCourseFn,
    // });

    useEffect(() => {
        const session_id = searchParams.get("session_id");
        if (session_id) {
            setSessionId(session_id);
        }
    }, [searchParams]);

    // enroll user to the course once the session.status is complete
    useEffect(() => {
        if (session?.status === "complete" && service) {
            router.push("/my-purchases")
            // enroll user to the course
            // enrollUser(
            //     {
            //         serviceId: session?.metadata?.course_id ?? "",
            //         userId: session?.metadata?.user_id ?? "",
            //     },
            //     {
            //         onSuccess: () => {
            //             router.push(
            //                 `/learn/${generateSlug(session?.metadata?.course_name ?? "")}_${session?.metadata?.course_id}`,
            //             );
            //         },
            //         onError: () => {
            //             setTimeout(() => {
            //                 router.push(`/course/${course.slug}`);
            //             }, 2000);
            //         },
            //     },
            // );
        }
    }, [session, router, service]);

    if (session?.status === "open") {
        router.push("/checkout");
    }

    if (session?.status === "complete") {
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
                        className="object-contain"
                        height={72}
                        width={128}
                    />
                </div>

                <div className="container flex min-h-[calc(100vh-10rem)] flex-row items-center justify-center py-8 lg:min-h-[calc(100vh-5rem)]">
                    {/*<PaymentSuccessCard*/}
                    {/*    isEnrolling={isUserEnrolling}*/}
                    {/*    isError={isEnrollmentError}*/}
                    {/*/>*/}
                </div>
            </main>
        );
    }

    // we need more time to process the payment
    if (session?.status === "error") {
        router.push("/checkout");
    }

    return (
        <main
            style={{ backgroundImage: "url(/images/textures/1.svg)" }}
            className="h-screen overflow-y-scroll scrollbar-thin"
        >
            <div className="flex w-full items-center justify-center pt-6">
                <img
                    alt="logo"
                    src="/images/logo.png"
                    className="object-contain"
                    height={72}
                    width={128}
                />
            </div>

            <div className="container flex min-h-[calc(100vh-10rem)] flex-row items-center justify-center py-8 lg:min-h-[calc(100vh-5rem)]">
                <PaymentProcessingCard isError={isSessionError} />
            </div>
        </main>
    );
};

export default PaymentProcessing;
