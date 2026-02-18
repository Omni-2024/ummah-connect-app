"use client"
import { useAuthState } from "@/features/auth/context/useAuthState";
import { redirect } from "next/navigation"

export default async function Home() {
  const {isAuthenticated} = useAuthState();


  if (!isAuthenticated) {
    redirect("/login")
  }

  redirect("/admin")
}
