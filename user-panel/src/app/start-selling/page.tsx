import type { Metadata } from "next";
import { Suspense } from "react";
import BecomeSellerPage from "@/app/start-selling/BecomeSellerPage";

export const metadata: Metadata = {
    title: "Become a Seller - Ummah Connect | Connecting the Islamic Community",
    alternates: { canonical: "/start-selling" },
};

function BecomeSellerPageLoading() {
    return (
        <div className="min-h-screen bg-gray-50 sm:bg-white">
            {/* <div className="animate-pulse">
                <div className="h-16 bg-gray-200 mb-4"></div>
                <div className="max-w-4xl mx-auto px-4">
                    <div className="space-y-4">
                        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="bg-white rounded-xl p-6 space-y-4">
                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                            <div className="h-10 bg-gray-200 rounded"></div>
                            <div className="h-10 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>
            </div> */}
        </div>
    );
}

export default function Page() {
    return (
        <Suspense fallback={<BecomeSellerPageLoading />}>
            <BecomeSellerPage />
        </Suspense>
    );
}