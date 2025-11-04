"use client"
import { Lock1 as LockIcon } from "iconsax-react";
import Button from "@/components/base/Button";
import PasswordInput from "@/components/widgets/PasswordInput";
import CardWrapper from "@/features/auth/components/CardWrapper";
import { AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPasswordFn } from "@/lib/endpoints/authenticationFns";
import { useMutation } from "@tanstack/react-query";
import { useEffect, Suspense } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Toast } from "@/components/base/Toast";
import ResetSuccessful from "@/features/auth/components/reset-password/ResetSuccessful";

const ResetPasswordContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  //
  const token = searchParams.get('token') as string;
  //
  const {
    mutate: resetPassword,
    isPending: isResetPasswordPending,
    isSuccess,
  } = useMutation({
    mutationFn: resetPasswordFn,
  });
  //
  const {
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    errors,
    touched,
    isValid,
  } = useFormik({
    initialValues: { password: "", confirmPassword: "" },
    validationSchema: resetPasswordFormValidationSchema,
    onSubmit: ({ password }) => {
      resetPassword(
          { token, password },
          {
            onSuccess: () => {
              router.push("/user/login");
            },
            onError: () => {
              Toast.error("Failed to reset password");
            },
          },
      );
    },
  });
  //
  // if token is not provided, redirect to login
  useEffect(() => {
    if (!token) {
      router.push("/user/login");
    }
  }, [token, router]);
  //
  if (isSuccess) {
    return <ResetSuccessful />;
  }
  //
  return (
      <main className="flex flex-col min-h-screen" style={{ backgroundImage: "url(/images/textures/1.svg)" }}>
        <div className="hidden w-full items-center justify-center pt-6 md:flex">
          <img
              alt="logo"
              src="/images/logo.png"
              className="h-32 object-contain"
          />
        </div>

        <div className="container flex flex-1 flex-row items-center justify-center md:py-8">
          <AnimatePresence mode="wait">
            <CardWrapper className="flex h-svh min-w-[40vw] flex-col items-center justify-center space-y-6 p-4 sm:h-auto md:p-8">
              <div className="flex size-12 items-center justify-center rounded-full bg-tertiary-50">
                <LockIcon className="text-tertiary-500" />
              </div>

              <div className="space-y-1">
                <h1 className="text-center font-primary text-2xl font-semibold">
                  Reset your password
                </h1>

                <p className="text-center text-sm text-dark-300">
                  To reset your password, please enter your registered email
                  address, and we'll send you instructions.
                </p>
              </div>

              <form
                  className="bg-slate-40 flex w-full max-w-xs flex-col items-center justify-center gap-4 pb-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
              >
                <PasswordInput
                    id="password"
                    onBlur={handleBlur}
                    placeholder="New password"
                    containerClassName="w-full"
                    inputProps={{ autoFocus: true }}
                    value={values.password}
                    onChange={handleChange}
                    errorMessage={
                      touched.password && errors.password ? errors.password : ""
                    }
                />
                <PasswordInput
                    id="confirmPassword"
                    onBlur={handleBlur}
                    placeholder="Re-enter new password"
                    containerClassName="w-full"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    errorMessage={
                      touched.confirmPassword && errors.confirmPassword
                          ? errors.confirmPassword
                          : ""
                    }
                />

                <Button
                    className="mt-2 w-full"
                    size="lg"
                    type="submit"
                    disabled={!isValid || isResetPasswordPending}
                    isLoading={isResetPasswordPending}
                >
                  Reset password
                </Button>
              </form>
            </CardWrapper>
          </AnimatePresence>
        </div>
      </main>
  );
};

const ResetPasswordRoute = () => {
  return (
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordContent />
      </Suspense>
  );
};

export default ResetPasswordRoute;

const resetPasswordFormValidationSchema = Yup.object().shape({
  password: Yup.string()
      .trim()
      .label("Password")
      .min(5)
      .max(30)
      .required("Password is required"),
  confirmPassword: Yup.string()
      .trim()
      .label("Confirm password")
      .min(5)
      .max(30)
      .required("Confirm password is required")
      .oneOf([Yup.ref("password")], "Passwords do not match"),
});