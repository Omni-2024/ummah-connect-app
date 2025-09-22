"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Button from "@/components/base/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/base/card"
import { Input } from "@/components/base/input"
import { useMutation } from "@tanstack/react-query"
import { adminSignInFn } from "@/lib/endpoints/authenticationFns"
import { ADMIN_ROLES, NAV_LOGO_SRC } from "@/lib/constants"
import { useAuthState } from "@/features/auth/context/useAuthState"
import { HttpStatusCode, isAxiosError } from "axios"
import { Toast } from "@/components/base/toast"
import Spinner from "@/components/ui/Spinner"
import Image from "next/image"
import { Eye, EyeOff } from "lucide-react"; 


export default function AdminLoginPage() {
  const router = useRouter()
  const { login: setLogin } = useAuthState()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})

  const { mutate: login, isPending, isSuccess } = useMutation({
    mutationFn: adminSignInFn,
    onSuccess: (data) => {
      const allowedRoles = [
        ADMIN_ROLES.ADMIN,
        ADMIN_ROLES.OPERATIONAL_ADMIN,
        ADMIN_ROLES.ROOT,
        ADMIN_ROLES.BUSINESS_ADMIN
      ]

      if (!allowedRoles.includes(data.role)) {
        return Toast.error("Access denied. Invalid admin role.")
      }

      setLogin({
        accessToken: data.token,
        refreshToken: data.refreshToken ?? "",
        role: data.role,
        id: data.id,
      })

      Toast.success(`Welcome back, ${data.role}`)
      router.push("/admin")
    },
    onError: (err) => {
      let emailError = ""
      let passwordError = ""

      if (isAxiosError(err)) {
        if (err.code === "ERR_NETWORK") {
          return Toast.error("Network error. Try again later.")
        }
        if (err.status === HttpStatusCode.NotFound) {
          emailError = "No access to this email"
        }
        if (err.status === HttpStatusCode.Unauthorized) {
          passwordError = "Incorrect password"
        }
      }

      setFieldErrors({ email: emailError, password: passwordError })

      if (!emailError && !passwordError) {
        Toast.error("Login failed. Please try again.")
      }
    },
  })

  const [showPassword, setShowPassword] = useState(false); // toggle password visibilit
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFieldErrors({})
    login({
      email: formData.email,
      password: formData.password,
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: "" })) // clear field error while typing
  }

  return (
     <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-2xl">
        <Card
          className="w-full p-10 border-none rounded-2xl"
          style={{ boxShadow: "0 0 15px rgba(0,0,0,0.1)" }}
        >
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Image
                src={NAV_LOGO_SRC}
                alt="Ummah community logo"
                width={180}
                height={60}
                priority
              />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground pb-2">
              Ummah Community Admin Portal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Username"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isPending}
                  className={`bg-transparent border ${
                    fieldErrors.email ? "border-red-500" : "border-gray-300"
                  } focus:border-[#337f7c] focus:ring-0 h-12 px-3 rounded-xl`}
                />
                {fieldErrors.email && (
                  <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
                )}
              </div>

              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"} // toggle type
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isPending}
                  className={`bg-transparent border ${
                    fieldErrors.password ? "border-red-500" : "border-gray-300"
                  } focus:border-[#337f7c] focus:ring-0 h-12 px-3 rounded-xl pr-10`} // extra padding for icon
                />
                {/* Show/Hide icon */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {fieldErrors.password && (
                  <p className="text-red-500 text-sm mt-1">{fieldErrors.password}</p>
                )}
              </div>

              <Button
                className="mt-6 w-full bg-gradient-to-br from-[#669f9d] to-[#337f7c] rounded-xl"
                type="submit"
                disabled={isPending || isSuccess}
              >
                {isPending ? <Spinner /> : "Continue with email"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


// "use client"
// import type React from "react"
// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import Button from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { useMutation } from "@tanstack/react-query"
// import { adminSignInFn } from "@/lib/endpoints/authenticationFns"
// import { ADMIN_ROLES, NAV_LOGO_SRC } from "@/lib/constants"
// import { useAuthState } from "@/features/auth/context/useAuthState"
// import { HttpStatusCode, isAxiosError } from "axios"
// import { Toast } from "@/components/base/Toast"
// import Spinner from "@/components/ui/Spinner"
// import Image from "next/image"
// import { Eye, EyeOff } from "lucide-react"

// export default function AdminLoginPage() {
//   const router = useRouter()
//   const { login: setLogin } = useAuthState()
//   const [formData, setFormData] = useState({ email: "", password: "" })
//   const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})
//   const [showPassword, setShowPassword] = useState(false)

//   const { mutate: login, isPending, isSuccess } = useMutation({
//     mutationFn: adminSignInFn,
//     onSuccess: (data) => {
//       const allowedRoles = [
//         ADMIN_ROLES.ADMIN,
//         ADMIN_ROLES.OPERATIONAL_ADMIN,
//         ADMIN_ROLES.ROOT,
//       ]
//       if (!allowedRoles.includes(data.role)) {
//         return Toast.error("Access denied. Invalid admin role.")
//       }
//       setLogin({
//         accessToken: data.token,
//         refreshToken: data.refreshToken ?? "",
//         role: data.role,
//         id: data.id,
//       })
//       Toast.success(`Welcome back, ${data.role}`)
//       router.push("/admin/dashboard")
//     },
//     onError: (err) => {
//       let emailError = ""
//       let passwordError = ""
//       if (isAxiosError(err)) {
//         if (err.code === "ERR_NETWORK") {
//           return Toast.error("Network error. Try again later.")
//         }
//         if (err.status === HttpStatusCode.NotFound) {
//           emailError = "No access to this email"
//         }
//         if (err.status === HttpStatusCode.Unauthorized) {
//           passwordError = "Incorrect password"
//         }
//       }
//       setFieldErrors({ email: emailError, password: passwordError })
//       if (!emailError && !passwordError) {
//         Toast.error("Login failed. Please try again.")
//       }
//     },
//   })

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     setFieldErrors({})
//     login({ email: formData.email, password: formData.password })
//   }

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
//     setFieldErrors((prev) => ({ ...prev, [e.target.name]: "" }))
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
//       {/* Center container */}
//       <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden flex">
        
//         {/* Left side gradient */}
//         <div className="w-1/2 bg-gradient-to-br from-[#669f9d] to-[#337f7c] flex flex-col justify-center items-center text-white p-10">
//           <div className="flex flex-col items-center space-y-6">
//             <Image src={NAV_LOGO_SRC} alt="Ummah Logo" width={140} height={50} priority />
//             {/* <h1 className="text-3xl font-bold tracking-wide">BLUEBACK</h1> */}
//             {/* <p className="text-sm text-center opacity-80">
//               Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed diam
//               nonummy nibh euismod tincidunt.
//             </p> */}
//           </div>
//         </div>

//         {/* Right side form */}
//         <div className="w-1/2 flex items-center justify-center px-10 py-12">
//           <div className="w-full max-w-md">
//             <h2 className="text-3xl font-bold text-center text-[#337f7c]">Welcome</h2>
//             <p className="text-center text-gray-600 mb-8">
//               Ummah Community Admin Portal
//             </p>

//             <form onSubmit={handleSubmit} className="space-y-6">
//               {/* Email */}
//               <div>
//                 <Input
//                   id="email"
//                   name="email"
//                   type="email"
//                   placeholder="Email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   required
//                   disabled={isPending}
//                   className={`h-12 px-3 rounded-full border ${
//                     fieldErrors.email ? "border-red-500" : "border-gray-300"
//                   } focus:border-[#337f7c] focus:ring-0`}
//                 />
//                 {fieldErrors.email && (
//                   <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
//                 )}
//               </div>

//               {/* Password */}
//               <div className="relative">
//                 <Input
//                   id="password"
//                   name="password"
//                   type={showPassword ? "text" : "password"}
//                   placeholder="Password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   required
//                   disabled={isPending}
//                   className={`h-12 px-3 rounded-full border pr-10 ${
//                     fieldErrors.password ? "border-red-500" : "border-gray-300"
//                   } focus:border-[#337f7c] focus:ring-0`}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
//                 >
//                   {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                 </button>
//                 {fieldErrors.password && (
//                   <p className="text-red-500 text-sm mt-1">{fieldErrors.password}</p>
//                 )}
//               </div>

//               <div className="flex justify-end">
//                 <button
//                   type="button"
//                   className="text-sm text-[#337f7c] hover:underline"
//                 >
//                   Forgot your password?
//                 </button>
//               </div>

//               <Button
//                 className="mt-4 w-full bg-gradient-to-br from-[#669f9d] to-[#337f7c] rounded-full h-12 text-white font-semibold"
//                 type="submit"
//                 disabled={isPending || isSuccess}
//               >
//                 {isPending ? <Spinner /> : "Log In"}
//               </Button>

//               {/* <p className="text-center text-sm mt-4">
//                 Don’t have an account?{" "}
//                 <a href="#" className="text-[#337f7c] font-medium hover:underline">
//                   Sign Up
//                 </a>
//               </p> */}
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

