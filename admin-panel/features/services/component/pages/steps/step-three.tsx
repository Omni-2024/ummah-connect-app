"use client"
import {useCreateServiceState} from "@/features/services/context/useCreateServiceState";
import {useCategories} from "@/hooks/useCategories";
import {useMutation} from "@tanstack/react-query";
import {updateServiceFn} from "@/lib/endpoints/serviceFns";
import {useGeneralUser} from "@/lib/hooks/useGeneralUsers";
import {useFormik} from "formik";
import ServiceEditorLayout from "@/features/services/layouts/ServiceEditorPageLayout";
import {createServicePages} from "@/features/services/constants/createServicePages";
import ServiceHeader from "@/features/services/component/cards/ServiceHeader";
import ServiceContent from "@/features/services/component/cards/ServiceContent";
import ServiceSidebar from "@/features/services/component/cards/ServiceSidebar";
import {useServiceById} from "@/lib/hooks/useServices";
import {useState} from "react";
import Spinner from "@/components/ui/Spinner";

export function StepThree() {
    const [isScrolled, setIsScrolled] = useState(false);
    const {
        serviceId,
        handleNext,
        handleBack,
        categoryData,
        serviceDetailsData,
    } = useCreateServiceState();
    const {
        data: service,
        isLoading,
        error,
    } = useServiceById(serviceId);
    const { data: categories, isLoading: categoriesLoading } = useCategories();
    const { data: provider } = useGeneralUser(categoryData.provider);

    const { mutate: updateServiceMutate, isPending: isUpdateCoursePending } =
        useMutation({ mutationFn: updateServiceFn });

    const formik = useFormik({
        initialValues: {},
        onSubmit: () => {
            updateServiceMutate(
                {
                    id: serviceId,
                    data: {
                        isPublished: true,
                    },
                },
                {
                    onSuccess: () => {
                        handleNext();
                    },
                }
            );
        },
    });

    function onBackHandle(): void {
        handleBack();
    }

    const profession = categories?.find(
        (cat) => cat.id === categoryData.profession
    );
    const specialist = profession?.specialists.find(
        (spec) => spec.id === categoryData.specialist
    );

    if (!service){
        return <Spinner/>
    }
    const discountedPrice = service?.discountEnabled
        ? service.price - (service.price * service.discount) / 100
        : service?.price;

    return(
        <ServiceEditorLayout
            onBack={onBackHandle}
            disabled={isUpdateCoursePending || formik.isSubmitting}
            onSubmit={formik.handleSubmit}
            steps={createServicePages}
        >
            <div className="container py-4 lg:px-20 lg:py-10">
                <div className="lg:grid lg:grid-cols-3 lg:gap-8">
                    <div className="lg:col-span-2">
                        <ServiceHeader
                            service={service}
                            educator={provider}
                            discountedPrice={discountedPrice}
                        />
                        <ServiceContent service={service} />
                    </div>
                    <ServiceSidebar
                        service={service}
                        discountedPrice={discountedPrice}
                        isScrolled={isScrolled}
                    />

                </div>
            </div>

        </ServiceEditorLayout>
    )
}