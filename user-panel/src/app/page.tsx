"use client"

import React from "react"
import { useAuthState } from "@/features/auth/context/useAuthState"
import { useRouter } from "next/navigation"
import {ArrowRightIcon, PersonIcon, TargetIcon, StarIcon, GlobeIcon, TextAlignCenterIcon} from "@radix-ui/react-icons"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import type { ReactNode, MouseEventHandler } from "react"
import Navbar from "../features/app/components/Navbar";
import IconButton from "@/components/base/IconButton";
import Link from "next/link";
import NavbarMobile from "@/features/app/components/Navbar.mobile";
import ComingSoonToolTip from "@/components/widgets/ComingSoonToolTip";
import {useAppState} from "@/features/app/context/useAppState";
import { Notification, HambergerMenu } from "iconsax-react";
import Button from "@/components/base/Button"
import {NAV_LOGO_SRC} from "@/lib/constants";
import NavDrawerMobile from "@/features/app/components/NavDrawer.mobile";
import NotLoggedInNavModal from "@/features/app/components/NotLoggedInNavModal.mobile";
import Bottombar from "@/features/app/components/Bottombar";
import ProfileMenuButton from "@/features/app/components/ProfileMenuButton"
import HeroSection from "@/features/home/HeroSection"
import FeaturesSection from "@/features/home/FeaturesSection"
import CTASection from "@/features/home/CTASection"
import Footer from "@/features/app/components/Footer"


interface DashboardCardProps {
  icon: ReactNode
  title: string
  description: string
  action: string
  onClick?: MouseEventHandler<HTMLDivElement>
}
export default function HomePage() {
  const { isAuthenticated } = useAuthState()
  const router = useRouter()

  const {
    setShowNavDrawer,
    setShowNotificationsModal,
    setShowNotLoggedInNavModal,
  } = useAppState();

  const handleNotificationButton = () => {
    setShowNotificationsModal(true);
  };

  const handleShowNavDrawer = () => {
    setShowNavDrawer(true);
  };

  const handleHamBurgerMenu = () => {
    setShowNotLoggedInNavModal(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar/>
      <NavbarMobile
          left={
            <Link href="/">
              <img
                  alt="Ummah Logo"
                  src={NAV_LOGO_SRC}
                  className="w-20 cursor-pointer object-contain"
              />
            </Link>
          }
          right={
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                  <>
                    {/*<ComingSoonToolTip>*/}
                    {/*  <IconButton size="sm" onClick={handleNotificationButton}>*/}
                    {/*    <Notification color="black" className="text-dark-600" />*/}
                    {/*  </IconButton>*/}
                    {/*</ComingSoonToolTip>*/}

                    <ProfileMenuButton onClick={handleShowNavDrawer} />
                  </>
              ) : (
                  <IconButton size="lg" onClick={handleHamBurgerMenu}>
                    <HambergerMenu className="text-dark-600" />
                  </IconButton>
              )}
            </div>
          }
      />

      <NavDrawerMobile />
      <NotLoggedInNavModal />

      <HeroSection isAuthenticated={isAuthenticated} router={router} />

      <FeaturesSection />

      {/* <CategoriesSection router={router} /> */}

      {/* {isAuthenticated && <DashboardSection router={router} />} */}

      {!isAuthenticated && <CTASection router={router} />}



      <Bottombar/>
    </div>
  )
}


// function CategoriesSection({ router }: { router: AppRouterInstance }) {
//   const categories = [
//     {
//       title: "Physicians",
//       description: "General Medicine, Surgery, Pediatrics, Psychiatry",
//       icon: <PersonIcon className="w-12 h-12 text-emerald-600" />,
//       courses: "150+ courses",
//       bgColor: "from-emerald-50 to-teal-50"
//     },
//     {
//       title: "Dentistry",
//       description: "General Dentistry, Orthodontics, Oral Surgery",
//       icon: <StarIcon className="w-12 h-12 text-blue-600" />,
//       courses: "80+ courses",
//       bgColor: "from-blue-50 to-indigo-50"
//     },
//     {
//       title: "Allied Health",
//       description: "Nursing, Physical Therapy, Medical Technology",
//       icon: <TargetIcon className="w-12 h-12 text-purple-600" />,
//       courses: "120+ courses",
//       bgColor: "from-purple-50 to-pink-50"
//     }
//   ]

//   return (
//     <section className="py-20 bg-slate-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center mb-16">
//           <h2 className="text-4xl font-bold text-slate-900 mb-4">Explore by Specialty</h2>
//           <p className="text-lg text-slate-600">
//             Find courses tailored to your healthcare profession and specialty.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           {categories.map((category, index) => (
//             <div
//               key={index}
//               onClick={() => router.push(`/courses/${category.title.toLowerCase()}`)}
//               className={`bg-gradient-to-br ${category.bgColor} p-8 rounded-2xl cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-white`}
//             >
//               <div className="mb-6">{category.icon}</div>
//               <h3 className="text-2xl font-bold text-slate-900 mb-3">{category.title}</h3>
//               <p className="text-slate-600 mb-4">{category.description}</p>
//               <div className="flex items-center justify-between">
//                 <span className="text-sm font-medium text-slate-500">{category.courses}</span>
//                 <ArrowRightIcon className="w-5 h-5 text-slate-400" />
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }

// function DashboardSection({ router }: { router: AppRouterInstance }) {
//   return (
//     <section className="py-20 bg-white">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center mb-12">
//           <h2 className="text-3xl font-bold text-slate-900 mb-4">Your Learning Journey</h2>
//           <p className="text-lg text-slate-600">Continue where you left off and discover new opportunities.</p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           <DashboardCard
//             icon={<StarIcon className="w-8 h-8 text-emerald-600" />}
//             title="Continue Learning"
//             description="Resume your in-progress courses and keep building your expertise."
//             action="View Dashboard"
//             onClick={() => router.push("/dashboard")}
//           />
//           <DashboardCard
//             icon={<StarIcon className="w-8 h-8 text-blue-600" />}
//             title="Recommended for You"
//             description="Discover courses curated based on your learning history and interests."
//             action="See Recommendations"
//             onClick={() => router.push("/recommendations")}
//           />
//           <DashboardCard
//             icon={<TargetIcon className="w-8 h-8 text-purple-600" />}
//             title="Your Achievements"
//             description="Track your progress, certificates, and learning milestones."
//             action="View Progress"
//             onClick={() => router.push("/achievements")}
//           />
//         </div>
//       </div>
//     </section>
//   )
// }


// function DashboardCard({ icon, title, description, action, onClick }: DashboardCardProps) {
//   return (
//     <div
//       className={`bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300 hover:-translate-y-1 ${
//         onClick ? "cursor-pointer" : ""
//       }`}
//       onClick={onClick}
//     >
//       <div className="mb-4">{icon}</div>
//       <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
//       <p className="text-slate-600 text-sm mb-4">{description}</p>
//       <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center gap-1 transition-colors duration-200">
//         {action}
//         <ArrowRightIcon className="w-4 h-4" />
//       </button>
//     </div>
//   )
// }

