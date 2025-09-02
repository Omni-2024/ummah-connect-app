"use client"
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import { ArrowRight as ArrowRightIcon } from "iconsax-react";
import {useRouter, useSearchParams} from "next/navigation";
import * as Yup from "yup";

import { userSignInFn } from "@/lib/endpoints/authenticationFns";
import { getErrorMessage } from "@/lib/helpers/errors";
import Button from "@/components/base/Button";
import Separator from "@/components/base/Separator";
import { Toast } from "@/components/base/Toast";
import PasswordInput from "@/components/widgets/PasswordInput";
import TextInput from "@/components/widgets/TextInput";
import AuthButtonSSO from "@/features/auth/components/AuthButtonSSO";
import AuthCardFooter from "@/features/auth/components/AuthCardFooter";
import AuthCardHeader from "@/features/auth/components/AuthCardHeader";
import AuthCardLayout from "@/features/auth/components/AuthCardLayout";
import Link from "next/link";
import { useAuthState } from "@/features/auth/context/useAuthState";
// import { useLinkedInLogin } from "@/lib/hooks/useLinkedInLogin";
import { useGoogleLogin } from "@/lib/hooks/useGoogleLogin";

const UserLoginRoute = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const methodParam = searchParams.get("method");
  const callbackParam = searchParams.get("_callback") ?? "";
  const actionParam = searchParams.get("_action") ?? "";

  const { login } = useAuthState();

  const showEmailLogin = methodParam === "email";
  const changeLoginMethod = (method: "sso" | "email") => {
    const params = new URLSearchParams(window.location.search);
    params.set("method", method);
    router.push(`/user/login?${params.toString()}`);
  };

  // Custom social login hooks
  // const { linkedInLogin, linkedInLoginIsPending } = useLinkedInLogin();
  const { googleLogin, googleLoginIsPending } = useGoogleLogin();

  const { isPending, mutate: userSignIn } = useMutation({
    mutationFn: userSignInFn,
  });

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    errors,
    touched,
    isValid,
  } = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: SignUpFormValidationSchema,
    onSubmit: ({ email, password }) => {
      userSignIn(
          { email, password },
          {
            onSuccess: (res) => {
              Toast.success("Login Successful!");

              // Update the auth state
              login(
                  res.token,
                  res.refreshToken,
                  res.role,
                  res.id,
                  res.isFirstLogin,
              );
              console.log(callbackParam);

              // Redirect to onboarding if it's the first login
              if (res.isFirstLogin) {
                router.push("/onboarding");
              } else if (callbackParam) {
                const redirectUrl = new URL(
                    callbackParam,
                    window.location.origin,
                );
                if (actionParam) {
                  redirectUrl.searchParams.set("_action", actionParam);
                }
                router.push(redirectUrl.toString());
              } else {
                router.push("/");
              }
            },
            onError: (err:any) => {
              const message = getErrorMessage(err);
              Toast.error(message);
            },
          },
      );
    },
  });

  // TODO: redirect to home if user is already authenticated

  return (
      <main style={{ backgroundImage: "url(/images/textures/1.svg)" }}>
        <div className=" flex min-h-svh items-center justify-center">
          <AuthCardLayout childrenContainerClassName="flex-[1.1]" sliderContainerClassName="hidden lg:block">
            <div className="flex size-full flex-1 flex-col items-center space-y-12 py-4">
              <AuthCardHeader heading="Welcome back to Ummah Community" />

              <div className="w-full flex-1 space-y-4 md:max-w-[80%]">
                {showEmailLogin ? (
                    <form
                        className="flex w-full flex-col gap-2.5"
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleSubmit();
                        }}
                    >
                      <TextInput
                          id="email"
                          onBlur={handleBlur}
                          value={values.email}
                          onChange={handleChange}
                          placeholder="Email address"
                          inputProps={{ type: "email" }}
                          errorMessage={
                            touched.email && errors.email ? errors.email : undefined
                          }
                      />
                      <PasswordInput
                          id="password"
                          onBlur={handleBlur}
                          placeholder="Password"
                          value={values.password}
                          onChange={handleChange}
                          errorMessage={
                            touched.password && errors.password
                                ? errors.password
                                : undefined
                          }
                      />

                      {/* Forgot password link */}
                      <Link
                          href="/forgot-password"
                          className="text-xs text-dark-300 hover:text-status-blue"
                      >
                        Forgot password
                      </Link>

                      <Button
                          type="submit"
                          className="mt-4 "
                          disabled={!isValid || isPending}
                          isLoading={isPending}
                      >
                        Get started
                      </Button>
                    </form>
                ) : (
                    <div className="flex flex-col items-center gap-2.5">
                      <AuthButtonSSO
                          method="email"
                          onClick={() => changeLoginMethod("email")}
                      />
                      <AuthButtonSSO
                          method="google"
                          onClick={googleLogin}
                          isLoading={googleLoginIsPending}
                      />
                      {/*<AuthButtonSSO*/}
                      {/*    method="linkedin"*/}
                      {/*    onClick={linkedInLogin}*/}
                      {/*    isLoading={linkedInLoginIsPending}*/}
                      {/*/>*/}
                    </div>
                )}

                <div className="flex items-center justify-between gap-4 overflow-hidden text-xs font-light text-dark-100">
                  <Separator className="flex-1" />
                  <span>OR</span>
                  <Separator className="flex-1" />
                </div>

                <div className="">
                  <p className="flex items-center justify-center text-xs">
                    New to Ummah Community?{" "}
                    <Button
                        size="sm"
                        variant="link"
                        className="px-2 font-medium text-status-blue hover:text-status-blue"
                        onClick={() => {
                          const params = new URLSearchParams();
                          if (callbackParam) {
                            params.set("_callback", callbackParam);
                          }
                          if (actionParam) {
                            params.set("_action", actionParam);
                          }
                          const queryString = params.toString();
                          router.push(
                              `/user/signup${queryString ? `?${queryString}` : ""}`,
                          );
                        }}
                        rightIcon={
                          <ArrowRightIcon className="size-3.5 text-status-blue" />
                        }
                    >
                      Get started
                    </Button>
                  </p>
                </div>
              </div>

              <AuthCardFooter />
            </div>
          </AuthCardLayout>
        </div>
      </main>
  );
};

export default UserLoginRoute;

const SignUpFormValidationSchema = Yup.object().shape({
  email: Yup.string()
      .trim()
      .email("Invalid email address")
      .label("Email")
      .min(5)
      .max(50)
      .required("Email is required"),

  password: Yup.string()
      .trim()
      .label("Password")
      .min(5)
      .max(30)
      .required("Password is required"),
});
