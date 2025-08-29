"use client";

import React, { useCallback, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight as ArrowRightIcon } from "iconsax-react";
import { useRouter, useSearchParams } from "next/navigation";

import { generalUserSignUpFn } from "@/lib/endpoints/authenticationFns";
import { getErrorMessage } from "@/lib/helpers/errors";
import Button from "@/components/base/Button";
import Separator from "@/components/base/Separator";
import { Toast } from "@/components/base/Toast";
import PasswordInput from "@/components/widgets/PasswordInput";
import TextInput from "@/components/widgets/TextInput";
import { useGoogleLogin } from "@/lib/hooks/useGoogleLogin";
import { useForgotPasswordState } from "@/features/auth/context/useForgotPasswordState";
import AuthCardHeader from "@/features/auth/components/AuthCardHeader";
import AuthCardLayout from "@/features/auth/components/AuthCardLayout";
import AuthButtonSSO from "@/features/auth/components/AuthButtonSSO";
import AuthCardFooter from "@/features/auth/components/AuthCardFooter";


type Values = { name: string; email: string; password: string };
type Errors = Partial<Record<keyof Values, string>>;
type Touched = Partial<Record<keyof Values, boolean>>;

const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const validate = (v: Values): Errors => {
    const e: Errors = {};
    const name = v.name.trim();
    const email = v.email.trim();
    const pw = v.password.trim();

    if (!name) e.name = "Name is required";
    else if (name.length > 50) e.name = "Name is too long";

    if (!email) e.email = "Email is required";
    else if (!emailRegex.test(email)) e.email = "Invalid email address";
    else if (email.length > 50) e.email = "Email is too long";

    if (!pw) e.password = "Password is required";
    else if (pw.length < 5) e.password = "Password must be at least 5 characters";
    else if (pw.length > 30) e.password = "Password must be at most 30 characters";

    return e;
};

export default function GeneralUserSignupRoute() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Read query params via useSearchParams (App Router)
    const methodParam = searchParams.get("method") ?? undefined;
    const callbackParam = searchParams.get("_callback") ?? undefined;
    const actionParam = searchParams.get("_action") ?? undefined;

    const showEmailLogin = methodParam === "email";

    const buildQS = (method: "sso" | "email") => {
        const p = new URLSearchParams(searchParams.toString());
        p.set("method", method);
        if (callbackParam) p.set("_callback", callbackParam);
        if (actionParam) p.set("_action", actionParam);
        return p.toString();
    };

    const changeLoginMethod = (method: "sso" | "email") => {
        // Keep path casing consistent with your folder: /user/signUp
        router.push(`/user/signUp?${buildQS(method)}`);
    };

    const { setEmail } = useForgotPasswordState();
    // const { linkedInLogin, linkedInLoginIsPending } = useLinkedInLogin();
    const { googleLogin, googleLoginIsPending } = useGoogleLogin();

    const { isPending, mutate: generalUserSignUp } = useMutation({
        mutationFn: generalUserSignUpFn,
    });

    const [values, setValues] = useState<Values>({ name: "", email: "", password: "" });
    const [errors, setErrors] = useState<Errors>({});
    const [touched, setTouched] = useState<Touched>({});

    const setField = useCallback(
        (field: keyof Values, val: string) => {
            setValues((prev) => ({ ...prev, [field]: val }));
            if (touched[field]) setErrors(validate({ ...values, [field]: val }));
        },
        [touched, values]
    );

    const handleBlur = (field: keyof Values) => {
        setTouched((t) => ({ ...t, [field]: true }));
        setErrors(validate(values));
    };

    const isValid = useMemo(() => Object.keys(validate(values)).length === 0, [values]);

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const v = validate(values);
        setErrors(v);
        setTouched({ name: true, email: true, password: true });
        if (Object.keys(v).length > 0) return;

        const { email, name, password } = values;
        generalUserSignUp(
            { email, password, name },
            {
                onSuccess: () => {
                    setEmail(email);
                    router.push("/email-sent");
                },
                onError: (err) => {
                    const message = getErrorMessage(err, "An error occurred!");
                    Toast.error(message);
                },
            }
        );
    };

    return (
        <main style={{ backgroundImage: "url(/images/textures/1.svg)" }}>
            <div className="container flex min-h-svh items-center justify-center">
                <AuthCardLayout childrenContainerClassName="flex-[1.1]">
                    <div className="flex size-full flex-1 flex-col items-center space-y-12 py-4">
                        <AuthCardHeader heading="Create a  Ummah Community account" />

                        <div className="w-full flex-1 space-y-4 md:max-w-[80%]">
                            {showEmailLogin ? (
                                <form className="flex w-full flex-col gap-2.5" onSubmit={onSubmit}>
                                    <TextInput
                                        id="name"
                                        value={values.name}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            setField("name", e.target.value)
                                        }
                                        onBlur={() => handleBlur("name")}
                                        placeholder="Your full name"
                                        errorMessage={touched.name && errors.name ? errors.name : undefined}
                                    />

                                    <TextInput
                                        id="email"
                                        value={values.email}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            setField("email", e.target.value)
                                        }
                                        onBlur={() => handleBlur("email")}
                                        placeholder="Email address"
                                        inputProps={{ type: "email" }}
                                        errorMessage={touched.email && errors.email ? errors.email : undefined}
                                    />

                                    <PasswordInput
                                        id="password"
                                        value={values.password}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            setField("password", e.target.value)
                                        }
                                        onBlur={() => handleBlur("password")}
                                        placeholder="Password"
                                        errorMessage={touched.password && errors.password ? errors.password : undefined}
                                    />

                                    <Button
                                        type="submit"
                                        className="mt-4"
                                        disabled={!isValid || isPending}
                                        isLoading={isPending}
                                    >
                                        Get started
                                    </Button>
                                </form>
                            ) : (
                                <div className="flex flex-col items-center gap-2.5">
                                    <AuthButtonSSO method="email" onClick={() => changeLoginMethod("email")} />
                                    <AuthButtonSSO
                                        method="google"
                                        onClick={googleLogin}
                                        isLoading={googleLoginIsPending}
                                    />
                                    {/* If you re-enable LinkedIn:
                  <AuthButtonSSO
                    method="linkedin"
                    onClick={linkedInLogin}
                    isLoading={linkedInLoginIsPending}
                  /> */}
                                </div>
                            )}

                            <div className="flex items-center justify-between gap-4 overflow-hidden text-xs font-light text-dark-100">
                                <Separator className="flex-1" />
                                <span>OR</span>
                                <Separator className="flex-1" />
                            </div>

                            <div>
                                <p className="flex items-center justify-center text-xs">
                                    Already have a  Ummah Community account?{" "}
                                    <Button
                                        size="sm"
                                        variant="link"
                                        onClick={() => {
                                            const p = new URLSearchParams();
                                            if (callbackParam) p.set("_callback", callbackParam);
                                            if (actionParam) p.set("_action", actionParam);
                                            const qs = p.toString();
                                            router.push(`/user/login${qs ? `?${qs}` : ""}`);
                                        }}
                                        className="px-2 font-medium text-status-blue hover:text-status-blue"
                                        rightIcon={<ArrowRightIcon className="size-3.5 text-status-blue" />}
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
}
