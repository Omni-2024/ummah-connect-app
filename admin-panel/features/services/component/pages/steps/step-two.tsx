"use client"

import {FormEvent} from "react"

import  Input  from "@/components/base/form/Input"
import  Textarea  from "@/components/base/form/Textarea"
import  Switch  from "@/components/base/switch"
import {useCreateServiceState} from "@/features/services/context/useCreateServiceState";
import {useMutation} from "@tanstack/react-query";
import {updateServiceFn,createServiceFn} from "@/lib/endpoints/serviceFns";
import {Toast} from "@/components/base/toast";
import {useFormik} from "formik";
import {addServiceSchema} from "@/features/services/validation/addService";
import useUnsavedChangesWarning from "@/lib/hooks/useUnsavedChangesWarning";
import {MAX_IMAGE_BYTES} from "@/lib/constants";
import ServiceEditorLayout from "@/features/services/layouts/ServiceEditorPageLayout";
import LabelTooltip from "@/components/widget/labelTooltip";
import { ADD_SERVICE_INPUTS as inputTitles } from "@/features/services/constants/AddServiceInputs";
import InputTooltipCard from "@/features/services/component/cards/inputTooltipCard";
import {InputWithAdornment} from "@/components/widget/InputWithAdornment";
import {createServicePages} from "@/features/services/constants/createServicePages";
import {uploadPublicFn} from "@/lib/endpoints/fileUploadFns";
import FileUploadWidget from "@/components/widget/FileUploadWidget";
import envs from "@/lib/env";


interface FormValues {
  serviceTitle: string;
  serviceDescription: string;
  previewDescription: string;
  coverImage: string;
  learningPoints: string[];
  whyMe: string[];
  pricing: number;
  discount: number;
  discountOn: boolean;
}

export function StepTwo() {
  const {
    serviceId,
    categoryData: serviceCategoryDataState,
    serviceDetailsData: serviceDetailsDataState,
    isLoading,
    setIsLoading,
    setServiceId,
    updateCreateServiceState,
    setCoverImage,
    handleNext,
    handleBack,
  } = useCreateServiceState();

  const { mutate: createServiceMutate, isPending: isCreateServicePending } =
      useMutation({ mutationFn: createServiceFn });
  const { mutate: updateServiceMutate, isPending: isUpdateServicePending } =
      useMutation({ mutationFn: updateServiceFn });

  const { mutate: uploadPublicMutate, isPending: isUploadPublicPending } =
      useMutation({ mutationFn: uploadPublicFn });

  const updateLocalServiceState = async (values: FormValues) => {
    await updateCreateServiceState("serviceDetailsData", {
      ...values,
      learningPoints: values.learningPoints.filter((point) => point !== ""),
      whyMe: values.whyMe.filter((point) => point !== ""),

    });
  };

  const getServiceData = (values: FormValues) => ({
    title: values.serviceTitle,
    tagline: values.previewDescription,
    description: values.serviceDescription,
    coverImageUrl: values.coverImage,
    providerId: serviceCategoryDataState.provider,
    price: values.pricing,
    specialtyId: serviceCategoryDataState.specialist,
    professionId: serviceCategoryDataState.profession,
    learningPoints: values.learningPoints.filter((point) => point !== ""),
    whyMe: values.whyMe.filter((point) => point !== ""),
    discount: values.discount,
    discountEnabled: values.discountOn,
  });

  const saveService = async (
      values: FormValues,
      options: { next?: boolean } = {}
  ) => {
    const { next = false } = options;

    setIsLoading(true);
    await updateLocalServiceState(values);

    const serviceData = getServiceData(values);

    if (serviceId === "") {
      createServiceMutate(serviceData, {
        onSuccess: (data: any) => {
          setServiceId(data.id);
          if (!next) Toast.success("Draft saved successfully");
          if (next) handleNext();
          setIsLoading(false);
        },
        onError: (error: any) => {
          console.log("Error",error)
          Toast.error("Something went wrong");
          setIsLoading(false);
        },
      });
    } else {
      updateServiceMutate(
          {
            id: serviceId,
            data: serviceData,
          },
          {
            onSuccess: (data: any) => {
              if (!next) Toast.success("Draft saved successfully");
              if (next) handleNext();
              setIsLoading(false);
            },
            onError: (error: any) => {
              Toast.error("CME ID already exists");
              setIsLoading(false);
            },
          }
      );
    }
  };

  const formik = useFormik<FormValues>({
    initialValues: {
      serviceTitle: serviceDetailsDataState.serviceTitle,
      serviceDescription: serviceDetailsDataState.serviceDescription,
      previewDescription: serviceDetailsDataState.previewDescription,
      coverImage: serviceDetailsDataState.coverImage,
      learningPoints: Array.from({ length: 6 }).map(
          (_, index) => serviceDetailsDataState.learningPoints[index] || ""
      ),
      whyMe: Array.from({ length: 6 }).map(
          (_, index) => serviceDetailsDataState.whyMe?.[index] || ""
      ),
      pricing: serviceDetailsDataState.pricing,
      discount: serviceDetailsDataState.discount,
      discountOn: serviceDetailsDataState.discountOn,
    },
    validationSchema: addServiceSchema,
    onSubmit: async (values) => {
      await saveService(values, { next: true });
    },
  });

  const handleImageUpload = (file: File) => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      Toast.error("Invalid file type. Please upload JPG, PNG, or WEBP.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      Toast.error(`Image too large (${sizeMB} MB). Max allowed is 3 MB.`);
      return;
    }

    uploadPublicMutate(
        { imageFile: file },
        {
          onSuccess: (data) => {
            formik.setFieldValue("coverImage", data.key);
            setCoverImage(data.key);
            Toast.success("Image uploaded successfully");
          },
          onError: () => {
            Toast.error("Failed to upload image");
          },
        }
    );
  };

  const handleImageRemove = () => {
    // simply clear the formik coverImage field
    formik.setFieldValue("coverImage", "");
    Toast.success("Image removed");
  };

  const onDraftHandle = async () => {
    await saveService(formik.values);
  };

  const onBackHandle = async () => {
    await updateLocalServiceState(formik.values);
    handleBack();
  };

  useUnsavedChangesWarning(formik.dirty);

  return (
      <ServiceEditorLayout
          onBack={onBackHandle}
          onDraft={onDraftHandle}
          disabled={
              isCreateServicePending ||
              isUpdateServicePending ||
              isUploadPublicPending
              // isDeleteFilePending
          }
          onSubmit={formik.handleSubmit}
          steps={createServicePages}
      >
        <div className="grid grid-cols-[280px_1fr] gap-x-8 mb-28 gap-y-16">
          {/* Title */}
          <LabelTooltip {...inputTitles.serviceTitle}>
            <InputTooltipCard {...inputTitles.serviceTitle} />
          </LabelTooltip>
          <Input
              {...inputTitles.serviceTitle}
              value={formik.values.serviceTitle}
              onChange={formik.handleChange}
              error={formik.errors.serviceTitle}
          />

          {/* Description */}
          <LabelTooltip {...inputTitles.serviceDescription}>
            <InputTooltipCard {...inputTitles.serviceDescription} />
          </LabelTooltip>
          <Textarea
              {...inputTitles.serviceDescription}
              value={formik.values.serviceDescription}
              onChange={formik.handleChange}
              className="max-h-72"
              rows={3}
              onInput={(e: FormEvent<HTMLTextAreaElement>) => {
                const target = e.currentTarget;
                target.style.height = "0px";
                target.style.height = `${target.scrollHeight + 5}px`;
              }}
              error={formik.errors.serviceDescription}
          />

          {/* Preview Description */}
          <LabelTooltip {...inputTitles.previewDescription}>
            <InputTooltipCard {...inputTitles.previewDescription} />
          </LabelTooltip>
          <Textarea
              {...inputTitles.previewDescription}
              value={formik.values.previewDescription}
              onChange={formik.handleChange}
              className="max-h-72"
              rows={3}
              onInput={(e: FormEvent<HTMLTextAreaElement>) => {
                const target = e.currentTarget;
                target.style.height = "0px";
                target.style.height = `${target.scrollHeight + 5}px`;
              }}
              error={formik.errors.previewDescription}
          />

          {/* Cover Image */}
          <LabelTooltip {...inputTitles.coverImage}>
            <InputTooltipCard {...inputTitles.coverImage} />
          </LabelTooltip>
          <FileUploadWidget
              onFileUploaded={handleImageUpload}
              onFileRemoved={handleImageRemove}
              isUploading={isUploadPublicPending}
              // isDeleting={isDeleteFilePending} // add later if you implement delete endpoint
              error={formik.errors.coverImage}
              imageUrl={
                formik.values.coverImage
                    ? `${envs.imageBaseUrl}/${formik.values.coverImage}`
                    : undefined
              }
              accept={{
                "image/*": [".png", ".jpg", ".jpeg", ".webp"],
              }}
          />

          {/* Learning Points */}
          <div>
            <LabelTooltip {...inputTitles.learningPoints}>
              <InputTooltipCard {...inputTitles.learningPoints} />
            </LabelTooltip>
            <div className="text-dark-300 text-[13px] font-normal">
              Please note that you can add up to six learning points.
            </div>
          </div>
          <div className="flex flex-col gap-4 w-full">
            {formik.values.learningPoints.map((point, index) => (
                <div key={index} className="flex items-center gap-4 w-full">
                  <div className="text-white font-medium flex justify-center items-center bg-primary-500 rounded-full h-8 w-8 shrink-0">
                    {index + 1}
                  </div>
                  <Input
                      {...inputTitles.learningPoints}
                      placeholder="Learning point here"
                      value={point}
                      name={`learningPoints[${index}]`}
                      onChange={formik.handleChange}
                      error={
                        Array.isArray(formik.errors.learningPoints)
                            ? formik.errors.learningPoints[index]
                            : formik.errors.learningPoints
                      }
                  />
                </div>
            ))}
          </div>

          {/* Why me */}
          <div>
            <LabelTooltip {...inputTitles.whyMe}>
              <InputTooltipCard {...inputTitles.whyMe} />
            </LabelTooltip>
            <div className="text-dark-300 text-[13px] font-normal">
              Please note that you can add up to six why me? points.
            </div>
          </div>
          <div className="flex flex-col gap-4 w-full">
            {formik.values.whyMe.map((point, index) => (
                <div key={index} className="flex items-center gap-4 w-full">
                  <div className="text-white font-medium flex justify-center items-center bg-primary-500 rounded-full h-8 w-8 shrink-0">
                    {index + 1}
                  </div>
                  <Input
                      {...inputTitles.whyMe}
                      placeholder="Highlight your unique value (e.g., Experienced tutor, Flexible schedule)"
                      value={point}
                      name={`whyMe[${index}]`}
                      onChange={formik.handleChange}
                      error={
                        Array.isArray(formik.errors.whyMe)
                            ? formik.errors.whyMe[index]
                            : formik.errors.whyMe
                      }
                  />
                </div>
            ))}
          </div>

          {/* Pricing */}
          <LabelTooltip {...inputTitles.pricing}>
            <InputTooltipCard {...inputTitles.pricing} />
          </LabelTooltip>
          <div className="grid grid-cols-[250px_300px] items-center">
            <InputWithAdornment
                {...inputTitles.pricing}
                type="number"
                name="pricing"
                step="any"
                endAdornment={<b>USD</b>}
                value={formik.values.pricing}
                onChange={formik.handleChange}
                min={0}
                className="pl-16 w-48"
                error={formik.errors.pricing}
            />
            <div className="flex items-center gap-4">
              <div className="font-medium text-xl font-primary shrink-0">
                Enable Discount
              </div>
              <Switch
                  className="data-[state=checked]:bg-primary-500"
                  checked={formik.values.discountOn}
                  onCheckedChange={(e: boolean) =>
                      formik.setFieldValue("discountOn", e)
                  }
              />
              <InputWithAdornment
                  type="number"
                  {...inputTitles.discount}
                  startAdornment={<b>%</b>}
                  name="discount"
                  value={formik.values.discount}
                  onChange={formik.handleChange}
                  min={0}
                  max={100}
                  disabled={!formik.values.discountOn}
                  className="w-48 ml-11 shrink-0"
                  error={formik.errors.discount}
              />
              <LabelTooltip {...inputTitles.discount}>
                <InputTooltipCard {...inputTitles.discount} />
              </LabelTooltip>
            </div>
          </div>

          {/* CME Points */}
          {/*<LabelTooltip {...inputTitles.cmePoints}>*/}
          {/*  <InputTooltipCard {...inputTitles.cmePoints} />*/}
          {/*</LabelTooltip>*/}
          {/*<div className="flex items-center gap-32">*/}
          {/*  <NumberInput*/}
          {/*      {...inputTitles.cmePoints}*/}
          {/*      value={formik.values.cmePoints}*/}
          {/*      onChange={(value: number) =>*/}
          {/*          formik.setFieldValue("cmePoints", value)*/}
          {/*      }*/}
          {/*      className="w-32 shrink-0"*/}
          {/*      min={0}*/}
          {/*      max={15}*/}
          {/*      increment={0.5}*/}
          {/*  />*/}
          {/*  <LabelTooltip {...inputTitles.cmdId}>*/}
          {/*    <InputTooltipCard {...inputTitles.cmdId} />*/}
          {/*  </LabelTooltip>*/}
          {/*  <Input*/}
          {/*      {...inputTitles.cmdId}*/}
          {/*      value={formik.values.cmdId}*/}
          {/*      onChange={formik.handleChange}*/}
          {/*      className="w-64"*/}
          {/*      error={formik.errors.cmdId}*/}
          {/*  />*/}
          {/*</div>*/}
        </div>
      </ServiceEditorLayout>
  );
}
