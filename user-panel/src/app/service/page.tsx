"use client"

import Navbar from "@/features/app/components/Navbar";
import NavbarMobile, {TitleWithBackButton} from "@/features/app/components/Navbar.mobile";
import {useParams, useRouter} from "next/navigation";
import {IconButton} from "@radix-ui/themes";
import ComingSoonToolTip from "@/components/widgets/ComingSoonToolTip";
import {Gift} from "iconsax-react";
import {useExploreState} from "@/features/explore/context/useExploreState";
import useIsMobile from "@/lib/hooks/useIsMobile";
import {useEffect, useState} from "react";
import {useCurrentUser} from "@/lib/hooks/useUser";
import {useAuthState} from "@/features/auth/context/useAuthState";
import {useServiceBySlug} from "@/lib/hooks/useServices";

export default function Service() {
    const router = useRouter();
    const params = useParams();
    const isMobile = useIsMobile();
    const [serviceUnavailableModal, setServiceUnavailableModal] = useState(false);
    const { setShowGiftServiceModal,setShowServiceShareModal,serviceSlug,setServiceSlug,setServiceId}=useExploreState()


    useEffect(() => {
        let slug = params?.slug;

        if (Array.isArray(slug)) {
            slug = slug[0];
        }

        if (slug) {
            setServiceSlug(slug)
            console.log("Slug from params:", slug);
        }
    }, [params]);

    const { isAuthenticated } = useAuthState();
    const { data: currentUser, isLoading: isCurrentUserLoading } =
        useCurrentUser();
    // Fetch the service data only when the courseSlug is available and not null
    const { data: service, isLoading: isServiceLoading } = useServiceBySlug(
        serviceSlug ?? "",
    );

    useEffect(() => {
        if (service) {
           setServiceId(service.id)
        }
    }, [service]);

    // const {
    //     data: enrollmentStatus,
    //     isLoading: isEnrollmentStatusLoading,
    //     isPending: isEnrollmentStatusPending,
    // } = useServiceEnrollmentStatus({
    //     uid: currentUser?.id,
    //     service: service,
    // });

    // useEffect(() => {
    //     if (!service) {
    //         return;
    //     }
    //
    //     if (service.isArchived && !isEnrollmentStatusLoading) {
    //         if (!isAuthenticated || enrollmentStatus === undefined) {
    //             if (enrollmentStatus === undefined || !isAuthenticated) {
    //                 setServiceUnavailableModal(true);
    //             }
    //         }
    //         else if (isAuthenticated && enrollmentStatus !== CourseEnrollmentStatus.GO_TO_COURSE) {
    //             serviceUnavailableModal(true);
    //         } else {
    //             serviceUnavailableModal(false);
    //         }
    //     }
    // }, [enrollmentStatus, service, isEnrollmentStatusLoading]);


    const handleShareCourse = () => {
        setShowServiceShareModal(true)
    };

    const handleGiftCourse = () => {
        setShowGiftServiceModal(true)
    };


    return(
        <div>
            <Navbar/>
            <NavbarMobile
                className="bg-white/90 backdrop-blur-2xl"
                left={
                    <TitleWithBackButton
                        title="Service Details"
                        onBackClick={() => {
                            if (
                                history.length <= 1 ||
                                (document.referrer !== "" &&
                                    !document.referrer.includes(window.location.origin))
                            ) {
                                router.push("/");
                            } else {
                                history.back();
                            }
                        }}
                    />
                }
                right={
                    <div className="flex items-center gap-1">
                        <IconButton onClick={handleShareCourse}>
                            <img src="/icons/filled/share-colored.svg" className="size-6" />
                        </IconButton>
                        {/* TODO: Temporarily disabled - text-dark-400 */}
                        <ComingSoonToolTip>
                            <IconButton onClick={handleGiftCourse} disabled>
                                <Gift className="size-5 text-dark-200" variant="Bold" />
                            </IconButton>
                        </ComingSoonToolTip>
                    </div>
                }
            />
        </div>
    )
}