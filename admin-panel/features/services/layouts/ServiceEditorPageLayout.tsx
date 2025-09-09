"use client"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/base/breadcrumb";
import Button from "@/components/base/button";
import Spinner from "@/components/base/Spinner";
import { cn } from "@/lib/className";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { TickCircle } from "iconsax-react";
import {useCreateServiceState} from "@/features/services/context/useCreateServiceState";
import {CREATE_SERVICE_LAST_STEP} from "@/features/services/context/CreateServiceState";
import {useRouter} from "next/navigation";

export enum CreateServiceActiveActionType {
  SUBMIT = "SUBMIT",
  DRAFT = "DRAFT",
}
type ServiceEditorLayoutProps = {
  steps: string[];
  onSubmit: (e?: React.FormEvent<HTMLFormElement>) => void;
  onBack: () => void;
  onDraft?: () => void;

  // disable buttons
  disabled: boolean;

  // show spinner on save or draft button
  activeAction?: CreateServiceActiveActionType;
  children?: React.ReactNode;
};

const ServiceEditorLayout: React.FC<ServiceEditorLayoutProps> = (props) => {
  const router=useRouter();
  const { currentStep, isSavedData, editMode } = useCreateServiceState();

  console.log("current",currentStep,props.steps.length-1,props.steps.length-2)


  return (
    <div className="flex flex-col py-14 px-6">
      <div className="flex justify-between items-center">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/admin/dashboard/services"
                className="text-dark-400 text-xl font-primary font-normal hover:underline"
              >
                Back to service
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator className="text-black [&>svg]:h-5 [&>svg]:w-5" />

            <BreadcrumbItem>
              <BreadcrumbPage className="text-primary-500 text-xl font-primary font-medium">
                {editMode ? "Edit Service" : "Add new service"}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {
          currentStep==CREATE_SERVICE_LAST_STEP-1 ?
            <Button
                variant="primary"
                type="button"
                className="w-48"
                onClick={()=>router.push("/admin/dashboard/services")}
            >
              {props.activeAction === CreateServiceActiveActionType.DRAFT ? (
                  <Spinner color="white" />
              ) : (
                  "Close without publish"
              )}
            </Button>
              :
              <Button
                  variant="primary"
                  disabled={currentStep === 0 || props.disabled || !props.onDraft}
                  type="button"
                  className="w-40"
                  onClick={props.onDraft}
              >
                {props.activeAction === CreateServiceActiveActionType.DRAFT ? (
                    <Spinner color="white" />
                ) : (
                    "Save as draft"
                )}
              </Button>
        }
      </div>

      <form
        onSubmit={props.onSubmit}
        className="border border-dark-50 rounded-2xl py-12 relative"
      >
        {props.disabled && <div className="h-full w-full absolute z-10" />}
        <div>
          <div className="flex gap-16 justify-center px-12 pt-14">
            {props.steps.map((step, index) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                key={index}
                className={cn(
                  "flex items-center shrink-0 flex-col 2xl:flex-row gap-y-2"
                )}
              >
                <div
                  className={cn(
                    "w-[45px] h-[45px] shrink-0 rounded-full text-xl flex items-center justify-center bg-tertiary-500 text-white ",
                    currentStep < index && "bg-tertiary-100"
                  )}
                >
                  {currentStep <= index ? (
                    index + 1
                  ) : (
                    <TickCircle
                      color="white"
                      size={45}
                      className="[&_path:first-of-type]:opacity-0"
                    />
                  )}
                </div>
                <div
                  className={cn(
                    "ml-4 font-primary text-xl font-medium text-tertiary-500",
                    currentStep < index && "text-tertiary-100"
                  )}
                >
                  {step}
                </div>
              </div>
            ))}
          </div>

          <Separator className="mt-12 bg-dark-50 h-[1px]" />

          <div className="mt-8 px-12 mb-">{props.children}</div>
        </div>

        <div className="flex justify-between px-12">
          <Button
            variant="secondary"
            type="button"
            onClick={props.onBack}
            disabled={props.disabled}
          >
            {currentStep === 0 ? "Cancel" : "Back"}
          </Button>

          <Button type="submit" disabled={props.disabled} className="w-56">
            {props.disabled ? (
              <Spinner color="white" />
            ) : props.activeAction === CreateServiceActiveActionType.SUBMIT ? (
              <Spinner color="white" />
            ) : currentStep > props.steps.length - 2 ? (
              "Done"
            ) : currentStep > props.steps.length - 3 ? (
              "Save & publish"
            ) : currentStep === 0 ? (
              "Continue"
            ) : (
              "Save & continue"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ServiceEditorLayout;
