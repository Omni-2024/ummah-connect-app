import type { Metadata } from "next";
import { Suspense } from "react";
import SendFeedbackPage from "@/app/feedback/SendFeedbackPage";

export const metadata: Metadata = {
    title: "Send Feedack - Ummah Connect | Connecting the Islamic Community",
    alternates: { canonical: "/feedback" },
};

 function SendFeedbackLoading() {
    return (
        <div className="min-h-screen bg-gray-50 sm:bg-white">
            <div className="animate-pulse">
                <div className="h-16 bg-gray-200 mb-6"></div>

                <div className="max-w-4xl mx-auto px-4">
                    <div className="space-y-6">
                        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>

                        <div className="bg-white rounded-xl p-6 space-y-4 shadow-sm">
                            <div className="h-4 bg-gray-200 rounded w-1/5"></div>
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        </div>

                        <div className="bg-white rounded-xl p-6 space-y-4 shadow-sm">
                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/5"></div>
                        </div>

                        <div className="h-20 bg-gray-200 rounded mt-10"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default function Page() {
    return (
        <Suspense fallback={<SendFeedbackLoading />}>
            <SendFeedbackPage  />
        </Suspense>
    );
}