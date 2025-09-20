import { ArrowLeft as ArrowLeftIcon, Sms as SmsIcon } from "iconsax-react";
import Button from "@/components/base/Button";
import CardWrapper from "@/features/auth/components/CardWrapper";
import { useForgotPasswordState } from "@/features/auth/context/useForgotPasswordState";

const CheckInboxCard = () => {
  const { email, setForgotPasswordStep } = useForgotPasswordState();

  const changeEmail = () => {
    setForgotPasswordStep("enter-email");
  };

  return (
    <CardWrapper className="flex h-svh min-w-[40vw] flex-col items-center justify-center space-y-6 p-4 sm:h-auto md:p-8">
      <div className="flex size-12 items-center justify-center rounded-full bg-tertiary-50">
        <SmsIcon className="text-tertiary-500" />
      </div>

      <div className="space-y-1">
        <h1 className="text-center font-primary text-2xl font-semibold">
          Check your inbox
        </h1>

        <p className="text-center text-sm text-dark-300">
          We'll send a password reset link to your email address;
          <span className="font-semibold"> {email}</span>.
        </p>
        <p className="text-center text-sm text-dark-300">
          Please check your inbox.
        </p>
      </div>
      <div>
        <div className="mt-8">
          <Button
            size="sm"
            variant="link"
            leftIcon={
              <ArrowLeftIcon className="size-4 text-primary-500 hover:text-primary-400 active:text-primary-700" />
            }
            onClick={changeEmail}
          >
            Change email address
          </Button>
        </div>
      </div>
    </CardWrapper>
  );
};

export default CheckInboxCard;
