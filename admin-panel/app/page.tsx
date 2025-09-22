"use client"
import { authState } from "@/features/auth/context/AuthState";
import { useAuthState } from "@/features/auth/context/useAuthState";
import { redirect } from "next/navigation"
import { useSnapshot } from "valtio";

export default async function Home() {
  // 👇 you can add logic here (e.g., check cookies, auth, etc.)
  const {isAuthenticated} = useAuthState();


  if (!isAuthenticated) {
    redirect("/login")
  }

  redirect("/admin")
}
