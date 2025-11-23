"use client"

import PaymentProcessingCard from "@/features/checkout/components/PaymentProcessingCard"
import PaymentSuccessCard from "@/features/checkout/components/PaymentSuccessCard"
import { useService } from "@/lib/hooks/useServices"
import { useSessionStatus } from "@/lib/hooks/usePayments"
import { useMutation } from "@tanstack/react-query"
import { useRouter, useSearchParams } from "next/navigation"
import React, { useEffect, useState } from "react"

const PaymentProcessingClient = () => {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [sessionId, setSessionId] = useState("")

    const { data: session, isError: isSessionError } = useSessionStatus(sessionId)
    const { data: service } = useService(session?.metadata?.service_id ?? "")

    // const {
    //   mutate: enrollUser,
    //   isPending: isUserEnrolling,
    //   isError: isEnrollmentError,
    // } = useMutation({
    //   mutationFn: enrollUserToCourseFn,
    // })

    useEffect(() => {
        const session_id = searchParams.get("session_id")
        if (session_id) {
            setSessionId(session_id)
        }
    }, [searchParams])

    // redirect when session completes
    useEffect(() => {
        if (session?.status === "complete" && service) {
            router.push("/my-purchases")
        }
    }, [session, service, router])

    useEffect(() => {
        if (session?.status === "open" || session?.status === "error") {
            router.push("/checkout")
        }
    }, [session, router])

    if (session?.status === "complete") {
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
                    {/* <PaymentSuccessCard
            isEnrolling={isUserEnrolling}
            isError={isEnrollmentError}
          /> */}
                </div>
            </main>
        )
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
    )
}

export default PaymentProcessingClient
