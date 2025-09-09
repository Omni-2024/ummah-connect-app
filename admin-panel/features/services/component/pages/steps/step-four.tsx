"use client"

import ServiceEditorLayout from "@/features/services/layouts/ServiceEditorPageLayout";
import {createServicePages} from "@/features/services/constants/createServicePages";
import {useCreateServiceState} from "@/features/services/context/useCreateServiceState";
import {useFormik} from "formik";
import {useRouter} from "next/navigation";
import {Book1} from "iconsax-react";
import LinkButton from "@/components/base/LinkButton";
import envs from "@/lib/env";
import {useServiceById} from "@/hooks/useServices";


export function StepFour() {
    const router=useRouter()
    const {
        handleBack,
        serviceId,
    } = useCreateServiceState();
    const { data: service } = useServiceById(serviceId);



    function onBackHandle(): void {
    handleBack();
  }

    const formik = useFormik({
        initialValues: {},
        onSubmit: () => {
            router.push("/admin/dashboard/services");
        },
    });

  return (
      <ServiceEditorLayout
          onBack={onBackHandle}
          disabled={formik.isSubmitting}
          onSubmit={formik.handleSubmit}
          steps={createServicePages}
          // activeAction={CreateCourseActiveActionType.SUBMIT}
      >
          <div className="flex flex-col justify-center text-center items-center pb-20">
              <div className="size-24 bg-primary-50 rounded-full items-center flex justify-center">
                  <Book1 color="green" variant="Bold" size={48} className="text-status-green" />
              </div>

              <div className="font-primary text-[31px] mt-8">
                  Take a look at your service that has been published
              </div>
              <div className="mt-4 mb-12 font-primary font-bold text-[39px] text-primary-500">
                  “
                  {service?.title ||
                      "ECG of Myocardial Infarction (MI): STEMI vs NSTEMI"}
                  ”
              </div>
              {/* TODO::  */}
              <LinkButton
                  target="_blank"
                  href={`${envs.mainBaseUrl}/service/${service?.slug}`}
                  variant="secondary"
              >
                  Service preview
              </LinkButton>
          </div>


      </ServiceEditorLayout>
  )
}
