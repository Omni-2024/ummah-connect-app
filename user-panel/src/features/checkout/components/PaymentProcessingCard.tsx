import Spinner from "@/components/base/Spinner";
import CardWrapper from "@/features/auth/components/CardWrapper";
import { useRouter } from "next/navigation";

interface PaymentProcessingCardProps {
  isError?: boolean;
}

const PaymentProcessingCard = ({ isError }: PaymentProcessingCardProps) => {
  const router = useRouter();
  //
  // if there is an error, redirect after 2 seconds
  if (isError) {
    setTimeout(() => {
      router.push(`/explore`);
    }, 2000);
  }
  //
  return (
    <CardWrapper className="flex flex-col items-center justify-center lg:w-[55vw] lg:p-14">
      <Spinner classname="size-14 text-primary-500" />

      <div className="mt-6 space-y-2 lg:w-11/12">
        <h1 className="w-full text-center font-primary text-xl font-bold lg:text-3xl">
          {isError
            ? "Oops! Something went wrong."
            : "Hang tight! Your payment is being processed."}
        </h1>

        <p className="hidden text-center text-sm font-medium text-dark-200 lg:block">
          {isError
            ? "We're currently experiencing some issues. Please try again later."
            : "We're currently processing your payment. This may take a few moments. Thank you for your patience!"}
        </p>
      </div>
    </CardWrapper>
  );
};

export default PaymentProcessingCard;
