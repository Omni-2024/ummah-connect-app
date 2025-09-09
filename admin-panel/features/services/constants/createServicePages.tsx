"use client"
import {StepOne} from "@/features/services/component/pages/steps/step-one";
import {StepTwo} from "@/features/services/component/pages/steps/step-two";
import {StepFour} from "@/features/services/component/pages/steps/step-four";
import {StepThree} from "@/features/services/component/pages/steps/step-three";


type PageStepType = {
  title: string;
  component: React.FC;
};
export const PageSteps: PageStepType[] = [
  {
    title: "Provider & Specialty",
    component: StepOne,
  },
  {
    title: "Service Details",
    component: StepTwo,
  },
  {
    title: "Preview",
    component: StepThree,
  },
  {
    title: "Publish",
    component: StepFour,
  },
] as const;

export const createServicePages = PageSteps.map((step) => step.title);
