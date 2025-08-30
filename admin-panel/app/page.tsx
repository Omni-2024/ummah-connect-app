"use client"
import { authState } from "@/features/auth/context/AuthState";
import { useAuthState } from "@/features/auth/context/useAuthState";
import { redirect } from "next/navigation"
import { useSnapshot } from "valtio";

export default async function Home() {
  // 👇 you can add logic here (e.g., check cookies, auth, etc.)
  const snap = useSnapshot(authState);

  if (!snap.isAuthenticated) {
    redirect("/admin/login")  // will redirect on server
  }

  redirect("/admin/dashboard") // if logged in, go to dashboard
}
