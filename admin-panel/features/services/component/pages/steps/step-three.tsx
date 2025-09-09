"use client"

import ServiceEditorLayout from "@/features/services/layouts/ServiceEditorPageLayout";
import {createServicePages} from "@/features/services/constants/createServicePages";
import {useCreateServiceState} from "@/features/services/context/useCreateServiceState";
import {useMutation} from "@tanstack/react-query";
import {updateServiceFn} from "@/lib/endpoints/serviceFns";
import {useFormik} from "formik";
import {useRouter} from "next/navigation";


export function StepThree() {
    const router=useRouter()

  const {
    serviceId,
    handleNext,
    handleBack,
    categoryData,
    serviceDetailsData,
  } = useCreateServiceState();


  function onBackHandle(): void {
    handleBack();
  }

  const { mutate: updateServiceMutate, isPending: isUpdateServicePending } =
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
                router.push("/admin/dashboard/services");
            },
          }
      );
    },
  });

  return (
      <ServiceEditorLayout
          onBack={onBackHandle}
          disabled={isUpdateServicePending || formik.isSubmitting}
          onSubmit={formik.handleSubmit}
          steps={createServicePages}
          // activeAction={CreateCourseActiveActionType.SUBMIT}
      >

      </ServiceEditorLayout>
  )
}
