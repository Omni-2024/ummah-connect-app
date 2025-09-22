"use client"
import { ArrowLeft as ArrowLeftIcon, Lock1 as LockIcon } from "iconsax-react";
import Button from "@/components/base/Button";
import TextInput from "@/components/widgets/TextInput";
import CardWrapper from "@/features/auth/components/CardWrapper";
import { useForgotPasswordState } from "@/features/auth/context/useForgotPasswordState";
import { forgotPasswordFn } from "@/lib/endpoints/authenticationFns";
import { useMutation } from "@tanstack/react-query";
import { Toast } from "@/components/base/Toast";
import { useRouter } from "next/navigation";

const EnterEmailCard = () => {
  const router = useRouter();

  const { email, setForgotPasswordStep, setEmail } = useForgotPasswordState();

  const { mutate: forgotPassword, isPending: isForgotPasswordPending } =
    useMutation({ mutationFn: forgotPasswordFn });

  const handleVerifyEmail = () => {
    forgotPassword(email, {
      onSuccess: () => {
        setForgotPasswordStep("check-inbox");
      },
      onError: () => {
        Toast.error("Failed to verify email");
      },
    });
  };

  const handleBackToLogin = () => {
    router.push("/user/login");
  };

  return (
    <CardWrapper className="flex h-svh min-w-[40vw] flex-col items-center justify-center space-y-6 p-4 sm:h-auto md:p-8">
      <div className="flex size-12 items-center justify-center rounded-full bg-tertiary-50">
        <LockIcon color="#307E7E" className="text-tertiary-500" />
      </div>

      <div className="space-y-1">
        <h1 className="text-center font-primary text-2xl font-semibold">
          Forgot password
        </h1>

        <p className="w-11/12 text-center text-sm text-dark-300">
          Enter your registered email below, and we'll send you a secure link to
          reset your password.
        </p>
      </div>

      <div className="bg-slate-40 flex w-full max-w-xs flex-col items-center justify-center gap-4">
        <TextInput
          id="email"
          placeholder="Email address"
          containerClassName="w-full"
          inputProps={{ autoFocus: true }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button
          onClick={handleVerifyEmail}
          className="w-full"
          size="lg"
          isLoading={isForgotPasswordPending}
          disabled={!email || isForgotPasswordPending}
        >
          Verify Email
        </Button>
      </div>

      <div className="flex w-full items-center justify-center">
        <Button
          size="sm"
          variant="link"
          className="px-2 font-medium text-status-blue hover:text-status-blue active:text-status-blue"
          leftIcon={<ArrowLeftIcon className="size-4 text-status-blue" />}
          onClick={handleBackToLogin}
        >
          Back to login
        </Button>
      </div>
    </CardWrapper>
  );
};

export default EnterEmailCard;
