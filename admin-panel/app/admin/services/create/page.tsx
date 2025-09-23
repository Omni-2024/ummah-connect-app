"use client"
import {useCreateServiceState} from "@/features/services/context/useCreateServiceState";
import {useEffect, useState} from "react";
import {usePathname, useRouter} from "next/navigation";
import {PageSteps} from "@/features/services/constants/createServicePages";
import SimpleDialog from "@/components/widget/simpleDialog";
import withAuth from "@/components/withAuth";
import {ADMIN_ROLES} from "@/lib/constants";

const SuperAdminCreateService = () => {
    const router = useRouter();
    const pathname = usePathname();
    const {
        currentStep,
        resetCreateServiceStateFull,
        showBackWarning,
        setShowBackWarning,
    } = useCreateServiceState();
    const [showModal, setShowModal] = useState(false);
    const [nextRoute, setNextRoute] = useState("");
    const [isDirty, setIsDirty] = useState(true);

    const CurrentPage = PageSteps[currentStep].component;

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        resetCreateServiceStateFull();
        return () => resetCreateServiceStateFull();
    }, []);

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
        if (isDirty && showBackWarning) {
            setIsDirty(false)
            setShowModal(true);
            setNextRoute(pathname);
        }
    }, [pathname, isDirty, showBackWarning]);

    useEffect(() => {
        if (PageSteps[currentStep].title === "Publish" || currentStep === 0) {
            setShowBackWarning(false);
        } else setShowBackWarning(true);
    }, [currentStep, setShowBackWarning]);

    return(
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
    )


}

const Page = withAuth(SuperAdminCreateService, [
    ADMIN_ROLES.ADMIN,
    ADMIN_ROLES.OPERATIONAL_ADMIN,
    ADMIN_ROLES.ROOT,
]);

export default function CreateServicePage(props: any) {
    return <Page {...props} />;
}




