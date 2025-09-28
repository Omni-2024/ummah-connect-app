"use client";

import useIsMobile from "@/lib/hooks/useIsMobile";
import {useParams, useRouter, useSearchParams} from "next/navigation";
import withAuth from "@/components/withAuth";
import { UserRole } from "@/lib/constants";
import CheckoutPageLayout from "@/features/checkout/components/checkoutPageLayout";
import StripeCheckout from "@/features/checkout/components/stripeCheckout";

type CheckoutServicePageProps = {
    children?: React.ReactNode;
};

const CheckoutServicePage: React.FC<CheckoutServicePageProps> = (props) => {
    const router = useRouter();
    const params = useParams();

    const serviceId = params?.slug as string;

    const isMobile = useIsMobile();

    return (
        <CheckoutPageLayout>
            {/* Figma design for checkout page */}
            {/* {isMobile ? <CheckoutMobilePage /> : <CheckoutDesktopPage />} */}

            {/* Stripe embedded checkout */}
            <StripeCheckout serviceId={serviceId} />
        </CheckoutPageLayout>
    );
};

export default withAuth(CheckoutServicePage, [
    UserRole.USER,
    UserRole.BUSINESS_ADMIN,
]);