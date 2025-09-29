import Spinner from "@/components/base/Spinner";
import CardWrapper from "@/features/auth/components/CardWrapper";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

interface PaymentSuccessCardProps {
  isEnrolling: boolean;
  isError: boolean;
}

const PaymentSuccessCard = ({
  isEnrolling,
  isError,
}: PaymentSuccessCardProps) => {
  return (
    <CardWrapper className="flex flex-col items-center justify-center lg:w-[55vw] lg:p-14">
      {isError ? (
        <ExclamationCircleIcon className="h-14 w-14 text-status-red" />
      ) : isEnrolling ? (
        <Spinner classname="size-14 text-primary-500" />
      ) : (
        <CheckCircleIcon className="h-14 w-14 text-primary-500" />
      )}

      <div className="mt-6 space-y-2 lg:w-11/12">
        <h1 className="w-full text-center font-primary text-xl font-bold lg:text-3xl">
          {isError
            ? "Auto Enroll Failed"
            : isEnrolling
              ? "Enrolling to the course"
              : "Payment Successful"}
        </h1>

        <p className="text-center text-sm font-medium text-dark-200 lg:block">
          {isError
            ? "There was an issue with auto-enrollment. Please try to enroll again."
            : isEnrolling
              ? "Payment processed. Enrolling to the course."
              : "Thank you! Your payment has been successfully processed."}
        </p>

        {!isError && !isEnrolling && (
          <p className="text-center text-sm font-medium text-dark-200 lg:block">
            You can now access your course. Enjoy learning!
          </p>
        )}
      </div>
    </CardWrapper>
  );
};

export default PaymentSuccessCard;
