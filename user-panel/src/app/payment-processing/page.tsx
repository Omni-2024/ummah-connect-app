import { Suspense } from "react"
import PaymentProcessingClient from "./PaymentProcessingClient"

export default function PaymentProcessingPage() {
    return (
        <Suspense
            fallback={
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
                        <p className="text-sm text-gray-600">Processing your payment...</p>
                    </div>
                </main>
            }
        >
            <PaymentProcessingClient />
        </Suspense>
    )
}
