"use client"

import React, {useState} from "react"

import Button from "@/components/base/button"
import { Label } from "@/components/base/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { CreateServiceFnArgs } from "@/features/services/types/gig-types"
import {useRouter} from "next/navigation";
import {useCreateServiceState} from "@/features/services/context/useCreateServiceState";
import {useCategories} from "@/hooks/useCategories";
import { useFormik } from "formik";
import {addCategorySchema} from "@/features/services/validation/addService";
import LoadingError from "@/components/widget/loadingError";
import Spinner from "@/components/ui/Spinner";
import {ArrowRight} from "lucide-react";
import {useGeneralUsers} from "@/lib/hooks/useGeneralUsers";
import Selector from "@/components/widget/selector";
import ComboBoxWithManualSearch from "@/components/widget/ComboboxWithManualSearch";



export function StepOne() {
  const [search, setSearch] = useState("");

  const router = useRouter();

  const {
    categoryData: categoryDataState,
    updateCreateServiceState,
    handleNext,
    handleBack,
    currentStep,
  } = useCreateServiceState();

  const {
    data: categories,
    isLoading: categoriesLoading,
    isError: categoriesError,
    error: categoriesErrorData,
    refetch: refetchCategories,
  } = useCategories();

  const {
    data: providers,
    isLoading: providersLoading,
    isError: providersError,
    error: providersErrorData,
    refetch: refetchProviders,
  }=useGeneralUsers(
      {
        search,
        limit:20,
        offset:0
      }
  )

  // const {
  //   data: educators,
  //   isLoading: educatorsLoading,
  //   isError: educatorsError,
  //   error: educatorsErrorData,
  //   refetch: refetchEducators,
  // } = useProviders(
  //     {
  //       search,
  //       limit: 20,
  //       offset: 0,
  //     },
  //     true
  // );

  const formik = useFormik({
    initialValues: {
      mainCategory: categoryDataState.profession,
      secondaryCategory: categoryDataState.specialist,
      provider: categoryDataState.provider,
    },
    validationSchema: addCategorySchema,
    onSubmit: (values) => {
      updateCreateServiceState("categoryData", {
        profession: formik.values.mainCategory,
        specialist:
            formik.values.secondaryCategory === ""
                ? null
                : formik.values.secondaryCategory,
        provider: formik.values.provider,
      });
      handleNext();
    },
  });

  const onDraftHandle = () => {};

  // if (categoriesError || educatorsError)
  //   return (
  //       <LoadingError
  //           error={
  //               (categoriesError
  //                   ? categoriesErrorData.message
  //                   : educatorsErrorData?.message) ?? ""
  //           }
  //           reload={() => {
  //             if (categoriesError) refetchCategories();
  //             else refetchEducators();
  //           }}
  //       />
  //   );

  if (categoriesError)
    return (
        <LoadingError
            error={
                 categoriesErrorData.message
            }
            reload={() => {
             refetchCategories();
            }}
        />
    );

  if (categoriesLoading)
    return (
        <div className="flex justify-center items-center h-80 w-full">
          <Spinner size={40} />
        </div>
    );


  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Which provider and specialty best describe your gig?</h2>
        <p className="text-gray-600">Select the provider and their area of expertise for this service</p>
      </div>

      <div className="min-h-[300px] mb-24">
        <h2 className="text-black font-primary font-bold text-[25px] text-center pt-12 pb-11">
          Which categories best describe your course?
        </h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="flex justify-center items-center gap-5 w-full">
            <Selector
                items={categories?.map((i) => ({
                  value: i.id,
                  label: i.name,
                }))}
                placeholder="Select main category"
                className="w-[300px]"
                name="mainCategory"
                value={formik.values.mainCategory}
                onValueChange={(value) => {
                  formik.setFieldValue("mainCategory", value);
                  formik.setFieldTouched("mainCategory", false);
                  formik.setFieldValue("secondaryCategory", "");
                }}
                error={
                  formik.touched.mainCategory
                      ? formik.errors.mainCategory
                      : undefined
                }
            />
            <ArrowRight />
            <Selector
                items={categories
                    ?.filter((i) => i.id === formik.values.mainCategory)[0]
                    ?.specialists?.map((i) => ({
                      value: i.id,
                      label: i.name,
                    }))}
                name="subCategory"
                placeholder="Select secondary category"
                className="w-[300px]"
                disabled={
                    formik.values.mainCategory === "" ||
                    formik.values.mainCategory == null
                }
                value={formik.values.secondaryCategory ?? ""}
                onValueChange={(value) => {
                  formik.setFieldValue("secondaryCategory", value);
                  formik.setFieldTouched("secondaryCategory", false);
                }}
                error={
                  formik.touched.secondaryCategory
                      ? formik.errors.secondaryCategory
                      : undefined
                }
            />
            {/*<ArrowRight />*/}
          </div>
          <div>
            <h2 className="text-black font-primary font-bold text-[25px] text-center pt-24 pb-11">
              Who is the provider for this service?
            </h2>
            <div className="flex w-full justify-center">
              <ComboBoxWithManualSearch
                  items={providers?.data?.map((i) => ({
                    value: i.id,
                    label: i.name,
                  }))}
                  placeholder="Search provider"
                  className="w-full max-w-lg"
                  searchValue={search}
                  setSearchValue={setSearch}
                  onChange={(value) => formik.setFieldValue("provider", value)}
                  value={formik.values.provider}
                  error={formik.errors.provider}
              />
            </div>
          </div>
        </form>
      </div>


    </div>
  )
}
