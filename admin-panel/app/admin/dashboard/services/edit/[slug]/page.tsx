"use client"
//TODO remove that eslint-disable
import withAuth from "@/components/withAuth";
import type React from "react";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {usePathname, useRouter, useSearchParams,useParams} from "next/navigation";
import {PageSteps} from "@/features/services/constants/createServicePages";
import {useCreateServiceState} from "@/features/services/context/useCreateServiceState";
import {getServiceFullDataFn} from "@/lib/endpoints/serviceFns";
import LoadingError from "@/components/widget/loadingError";
import Spinner from "@/components/ui/Spinner";
import SimpleDialog from "@/components/widget/simpleDialog";
import {ADMIN_ROLES} from "@/lib/constants";
import {setShowBackWarning} from "@/features/services/context/CreateServiceState";

function useServiceIdFromRoute() {
    const params = useParams();            // from next/navigation
    const search = useSearchParams();

    const fromParams = (params as Record<string, string | string[] | undefined>)?.slug;
    const fromQuery = search?.get("slug") ?? undefined;

    return Array.isArray(fromParams) ? fromParams[0] : fromParams ?? fromQuery ?? "";
}

const SuperAdminEditService = () => {
    const router = useRouter();
    const serviceID = useServiceIdFromRoute();


    console.log("omma",serviceID)


    const [showModal, setShowModal] = useState(false);
    const [pendingUrl, setPendingUrl] = useState<string | null>(null);
    const [nextRoute, setNextRoute] = useState("");
    const [isDirty, setIsDirty] = useState(true);

    const {
        setServiceId,
        currentStep,
        resetCreateServiceStateFull,
        setEditMode,
        updateCreateServiceState,
        showBackWarning,
    } = useCreateServiceState();

    const CurrentPage = PageSteps[currentStep].component;

    const [isLoading, setIsLoading] = useState(true);

    const {
        data: serviceData,
        error: serviceDataError,
        isPending: serviceDataLoading,
        isError: serviceDataIsError,
        mutate: getServiceFullData,
    } = useMutation({
        mutationFn: getServiceFullDataFn,
        onError: (error) => {
            console.error("Error getting service data:", error);
        },
        onSuccess: (data) => {
            setPageData(data);
        },
    });

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        resetCreateServiceStateFull();
        return () => resetCreateServiceStateFull();
    }, []);

    // show warning if user tries to leave the page
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty && showBackWarning) {
                e.preventDefault();
                e.returnValue = "";
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [showBackWarning, isDirty]);

    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (!showBackWarning || !isDirty) return;

            const target = e.target as HTMLElement | null;
            const anchor = target?.closest?.("a[href]") as HTMLAnchorElement | null;
            if (!anchor) return;

            const href = anchor.getAttribute("href");
            if (!href) return;
            // ignore external, hash, or new-tab links
            if (href.startsWith("http") || href.startsWith("#") || anchor.target === "_blank") return;

            // prevent SPA navigation, show confirm modal
            e.preventDefault();
            setPendingUrl(href);
            setShowModal(true);
        };

        document.addEventListener("click", onClick, true);
        return () => document.removeEventListener("click", onClick, true);
    }, [showBackWarning, isDirty]);

    useEffect(() => {
        if (PageSteps[currentStep].title === "Publish" || currentStep === 0) {
            setShowBackWarning(false);
        } else {
            setShowBackWarning(true);
        }
    }, [currentStep, setShowBackWarning]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        if (serviceID) {
            getServiceFullData(serviceID);
        }
    }, [serviceID]);

    const setPageData = async (data: typeof serviceData) => {
        if (!data) return;

        setIsLoading(true);

        setEditMode(true);
        setServiceId(serviceID ?? "");

        await updateCreateServiceState("serviceDetailsData", data.detailsData);
        await updateCreateServiceState("categoryData", {
            profession: data.categoryData.profession,
            specialist: data.categoryData?.specialist,
            provider: data.categoryData.provider,
        });
        setIsLoading(false);
    };

    if (serviceDataIsError) {
        return (
            <LoadingError
                error=""
                reload={() => {
                    if (serviceID) {
                        getServiceFullData(serviceID);
                    }
                }}
            />
        );
    }

    if (isLoading || serviceDataLoading)
        return (
            <div className="flex justify-center items-center h-80 w-full">
                <Spinner size={40} />
            </div>
        );
    return (
        <>
            <CurrentPage />
            <SimpleDialog
                title={"Warning: There Might Be Unsaved Changes"}
                description="You may have unsaved changes on this page. If you navigate away now, you will lose all your current data. You can save your work as a draft to prevent data loss."
                onRemove={() => {
                    setShowModal(false);
                    router.push(nextRoute);
                }}
                onClose={() => {
                    setShowModal(false);
                    setNextRoute("");
                    setIsDirty(true);
                }}
                open={showModal}
                loading={false}
            />
        </>
    );
};

const Page = withAuth(SuperAdminEditService, [
    ADMIN_ROLES.ADMIN,
    ADMIN_ROLES.OPERATIONAL_ADMIN,
    ADMIN_ROLES.ROOT,
]);

export default function EditServicePage(props: any) {
    return <Page {...props} />;
}



