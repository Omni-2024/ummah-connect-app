import { useCallback, useEffect, useState } from "react";
import envs from "@/lib/env";
import {useCurrentUser} from "@/lib/hooks/useUser";
import {useCreateCheckoutSession} from "@/lib/hooks/usePayments";
import {
    EmbeddedCheckoutProvider,
    EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";
const stripePromise = loadStripe(envs.stripePublishableKey);
//
interface StripeCheckoutProps {
  serviceId: string;
}
//
const StripeCheckout = ({ serviceId }: StripeCheckoutProps) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  //
  const { data: currentUser, isLoading: isCurrentUserLoading } =
    useCurrentUser();
  const { mutate: createCheckoutSession } = useCreateCheckoutSession();
  //
  const fetchClientSecret = useCallback(() => {
    // Create a Checkout Session
    if (!currentUser || !serviceId) return;

    createCheckoutSession(
      { serviceId, userId: currentUser.id, mode: "embedded" },
      {
        onSuccess: (res) => {
          setClientSecret(res.data.clientSecret);
        },
        onError: (error) => {
          console.error("Error creating checkout session:", error);
        },
      },
    );
  }, [currentUser, serviceId, createCheckoutSession]);
  //
  useEffect(() => {
    if (!isCurrentUserLoading && currentUser) {
      fetchClientSecret();
    }
  }, [isCurrentUserLoading, currentUser, fetchClientSecret]);

  const options = { clientSecret };
  //
  return (
    <div className="space-y-8">
      <h1 className="text-center font-primary text-lg font-semibold leading-none lg:text-3xl">
        Checkout
      </h1>
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
};

export default StripeCheckout;
