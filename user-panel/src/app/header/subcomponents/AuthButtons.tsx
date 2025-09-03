import React from "react"
import { useRouter } from "next/navigation"

const AuthButtons = ({ router }: { router: any }) => {
  return (
    <>
      <button
        onClick={() => router.push("/user/login")}
        className="hidden sm:block text-slate-600 hover:text-slate-900 px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg hover:bg-slate-50"
      >
        Sign In
      </button>
      <button
        onClick={() => router.push("/user/signup")}
        className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-5 py-2 rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
      >
        Join Now
      </button>
    </>
  )
}

export default AuthButtons