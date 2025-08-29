"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import * as Label from "@radix-ui/react-label";
import { useMutation } from "@tanstack/react-query";
import { generalUserSignUpFn } from "@/lib/endpoints/authenticationFns";
import { useRouter } from "next/navigation";
import { login } from "@/features/auth/context/AuthState";


// --- Types ---
interface FormState {
  username: string;
  email: string;
  password: string;
}

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  form?: string;
}

export default function LoginPage() {
  const [form, setForm] = useState<FormState>({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const { isPending, mutate: generalUserSignUp } = useMutation({
    mutationFn: generalUserSignUpFn,
  });

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!form.username.trim()) e.username = "Username is required";
    // if (!form.email.trim()) e.email = "Email is required";
    // else if (!/^\\S+@\\S+\\.\\S+$/.test(form.email))
    //   e.email = "Please enter a valid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6)
      e.password = "Password must be at least 6 characters";
    return e;
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const eobj = validate();
    setErrors(eobj);
    if (Object.keys(eobj).length > 0) return;

    generalUserSignUp(
      {
        email: form.email,
        password: form.password,
        name: form.username,
      },
      {
        onSuccess: (responce:any) => {
            login(
                responce.token,
                responce.refreshToken,
                responce.role,
                responce.id,
                responce.isFirstLogin,
            )
          router.push("/");
        },
        onError: (err) => {
          console.log(err)
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-semibold mb-6 text-center">Sign in</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label.Root className="block text-sm font-medium mb-1">Username</Label.Root>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="e.g. ziya123"
              className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-300 ${errors.username ? "border-red-400" : "border-gray-200"}`}
              aria-invalid={!!errors.username}
              aria-describedby={errors.username ? "username-error" : undefined}
            />
            {errors.username && (
              <p id="username-error" className="text-xs text-red-600 mt-1">
                {errors.username}
              </p>
            )}
          </div>

          <div>
            <Label.Root className="block text-sm font-medium mb-1">Email</Label.Root>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-300 ${errors.email ? "border-red-400" : "border-gray-200"}`}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p id="email-error" className="text-xs text-red-600 mt-1">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label.Root className="block text-sm font-medium mb-1">Password</Label.Root>
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="text-xs underline"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Your secure password"
              className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-300 ${errors.password ? "border-red-400" : "border-gray-200"}`}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
            />
            {errors.password && (
              <p id="password-error" className="text-xs text-red-600 mt-1">
                {errors.password}
              </p>
            )}
          </div>

          {errors.form && (
            <p className="text-sm text-red-600">{errors.form}</p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-xl py-2 font-medium shadow-sm bg-gradient-to-r from-indigo-500 to-indigo-600 text-white disabled:opacity-60"
          >
            {isPending ? "Signing in..." : "Sign in"}
          </button>

          <div className="text-center text-sm text-gray-500">
            Don’t have an account? <a href="#" className="underline">Create one</a>
          </div>
        </form>
      </div>
    </div>
  );
}
