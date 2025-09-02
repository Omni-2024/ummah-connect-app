"use client"
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import { ArrowRight as ArrowRightIcon } from "iconsax-react";
import {useRouter, useSearchParams} from "next/navigation";
import * as Yup from "yup";

import { generalUserSignUpFn } from "@/lib/endpoints/authenticationFns";
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
// import { useLinkedInLogin } from "@/lib/hooks/useLinkedInLogin";
import { useGoogleLogin } from "@/lib/hooks/useGoogleLogin";
import { useForgotPasswordState } from "@/features/auth/context/useForgotPasswordState";

const GeneralUserSignupRoute = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const methodParam = searchParams.get("method");
  const callbackParam = searchParams.get("_callback") ?? "";
  const actionParam = searchParams.get("_action") ?? "";

  const { setEmail } = useForgotPasswordState();

  const showEmailLogin = methodParam === "email";
  const changeLoginMethod = (method: "sso" | "email") => {
    const params = new URLSearchParams(window.location.search);
    params.set("method", method);
    if (callbackParam) {
      params.set("_callback", callbackParam);
    }
    if (actionParam) {
      params.set("_action", actionParam);
    }
    router.push(`/user/signup?${params.toString()}`);
  };

  // Custom social login hooks
  // const { linkedInLogin, linkedInLoginIsPending } = useLinkedInLogin();
  const { googleLogin, googleLoginIsPending } = useGoogleLogin();

  const { isPending, mutate: generalUserSignUp } = useMutation({
    mutationFn: generalUserSignUpFn,
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
    initialValues: { name: "", email: "", password: "" },
    validationSchema: SignUpFormValidationSchema,
    onSubmit: ({ email, name, password }) => {
      generalUserSignUp(
          {
            email,
            password,
            name,
          },
          {
            onSuccess: () => {
              setEmail(email);
              router.push("/email-sent");
            },
            onError: (err:any) => {
              // TODO: Handle error message
              const message = getErrorMessage(err, "An error occurred!");
              Toast.error(message);
            },
          },
      );
    },
  });

  return (
      <main style={{ backgroundImage: "url(/images/textures/1.svg)" }}>
        <div className=" flex min-h-svh items-center justify-center">
          <AuthCardLayout childrenContainerClassName="flex-[1.1]" sliderContainerClassName="hidden lg:block">
            <div className="flex size-full flex-1 flex-col items-center space-y-12 py-4">
              <AuthCardHeader heading="Create a Ummah Community account" />

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
                          id="name"
                          onBlur={handleBlur}
                          value={values.name}
                          onChange={handleChange}
                          placeholder="Your full name"
                          errorMessage={
                            touched.name && errors.name ? errors.name : undefined
                          }
                      />
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

                      <Button
                          type="submit"
                          className="mt-4 bg-green-900"
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
                    Already have a Ummah community account?{" "}
                    <Button
                        size="sm"
                        variant="link"
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
                              `/user/login${queryString ? `?${queryString}` : ""}`,
                          );
                        }}
                        className="px-2 font-medium text-status-blue hover:text-status-blue"
                        rightIcon={
                          <ArrowRightIcon className="size-3.5 text-status-blue" />
                        }
                    >
                      Log in
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

export default GeneralUserSignupRoute;

const SignUpFormValidationSchema = Yup.object().shape({
  name: Yup.string()
      .trim()
      .label("Name")
      .min(1)
      .max(50)
      .required("Name is required"),

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
