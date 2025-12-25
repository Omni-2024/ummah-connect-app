"use client";

import Image from "next/image";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import Button from "@/components/base/Button";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export default function HeroSection({
    isAuthenticated,
    router,
}: {
    isAuthenticated: boolean;
    router: AppRouterInstance;
}) {
    const stats = [
        { value: "10K+", label: "Muslim Learners" },
        { value: "500+", label: "Islamic Services" },
        { value: "100+", label: "Certified Scholars" },
    ];

    return (
        <section className="relative overflow-hidden ">
            <div className="relative min-h-[680px] sm:min-h-[740px] lg:min-h-[800px] ">
                <Image
                    src="/images/banner.png"
                    alt="Ummah Connect Hero Background"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover"
                    style={{ objectPosition: "80% center" }}
                />

                <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/65 to-white/90" />

                <div className="absolute inset-0 opacity-5 pointer-events-none">
                    <div className="absolute top-10 left-10 w-32 h-32 bg-emerald-600 rounded-full rotate-45" />
                    <div className="absolute top-40 right-20 w-24 h-24 bg-teal-600 rounded-full rotate-12" />
                    <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-emerald-500 -rotate-12" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="mb-4 sm:mb-6">
                            <span className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-emerald-100 text-emerald-700 text-xs sm:text-sm font-medium">
                                🕌 Serving the Ummah Worldwide
                            </span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-4 sm:mb-6 leading-tight">
                            Grow in{" "}
                            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                Islamic Knowledge
                            </span>
                            <br />& Professional Skills
                        </h1>

                        <p className="text-sm sm:text-base lg:text-xl text-slate-600 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto">
                            Join thousands of Muslims advancing their careers while staying true to Islamic principles. Learn from certified scholars and industry experts.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12">
                            {!isAuthenticated ? (
                                <>
                                    <Button
                                        variant="unstyled"
                                        onClick={() => router.push("/user/signup")}
                                        className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-4 sm:px-8 sm:py-6 rounded-xl text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                                    >
                                        Begin Your Journey
                                        <ArrowRightIcon className="w-5 h-5" />
                                    </Button>

                                    <Button
                                        variant="unstyled"
                                        onClick={() => router.push("/explore")}
                                        className="border-2 border-emerald-500 text-slate-800 px-6 py-4 sm:px-8 sm:py-6 rounded-xl text-base sm:text-lg font-semibold hover:bg-emerald-50"
                                    >
                                        Explore Services
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        variant="unstyled"
                                        onClick={() => router.push("/my-purchases")}
                                        className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-4 sm:px-8 sm:py-6 rounded-xl text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                                    >
                                        Continue Learning
                                        <ArrowRightIcon className="w-5 h-5" />
                                    </Button>

                                    <Button
                                        variant="unstyled"
                                        onClick={() => router.push("/explore")}
                                        className="border-2 border-emerald-500 text-slate-800 px-6 py-4 sm:px-8 sm:py-6 rounded-xl text-base sm:text-lg font-semibold hover:bg-emerald-50"
                                    >
                                        Discover New Paths
                                    </Button>
                                </>
                            )}
                        </div>

                        {/*<div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto">*/}
                        {/*    {stats.map((stat, index) => (*/}
                        {/*        <div key={index} className="text-center">*/}
                        {/*            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900">*/}
                        {/*                {stat.value}*/}
                        {/*            </div>*/}
                        {/*            <div className="text-xs sm:text-sm text-slate-600 mt-1">*/}
                        {/*                {stat.label}*/}
                        {/*            </div>*/}
                        {/*        </div>*/}
                        {/*    ))}*/}
                        {/*</div>*/}

                    </div>
                </div>
            </div>
        </section>
    );
}
