import { proxy } from "valtio";
import type {
  CategoriesPageData,
ServiceDetailsPageData} from "../types/addService";

export const CREATE_COURSE_LAST_STEP = 5;



type CreateServiceState = {
  currentStep: number;
  showBackWarning: boolean;
  isSavedData: boolean;
  isEdit?: boolean;
  isLoading: boolean;

  serviceId: string;

  categoryData: CategoriesPageData;
  courseDetailsData: ServiceDetailsPageData;
};

export const initialState: CreateServiceState = {
  //TEST
  currentStep: 0,
  showBackWarning: false,
  isSavedData: true,
  isEdit: false,
  isLoading: false,
  serviceId: "",

  categoryData: {
    profession: "",
    specialist: "",
    provider: "",
  },

  courseDetailsData: {
    serviceTitle: "",
    serviceDescription: "",
    coverImage: "",
    previewDescription: "",
    learningPoints: [],
    pricing: 0,
    discount: 0,
    discountOn: false,
    cmePoints: 0,
    cmdId: "",
    duration: 0,
  },
};

export const createCourseState = proxy<CreateServiceState>(initialState);

type CreateCourseStateUpdate = Pick<
  CreateServiceState,
  "categoryData" | "courseDetailsData"
>;

export const setServiceId = (serviceId: string) => {
  createCourseState.serviceId = serviceId;
};

export const setCurrentStep = (step: number) => {
  createCourseState.currentStep = step;
};
export const handleNext = () => {
  if (createCourseState.currentStep === CREATE_COURSE_LAST_STEP) {
    return;
  }
  createCourseState.currentStep += 1;
};
export const handleBack = () => {
  if (createCourseState.currentStep === 0) {
    createCourseState.showBackWarning = true;
    return;
  }
  createCourseState.currentStep -= 1;
};
export const setShowBackWarning = (show: boolean) => {
  createCourseState.showBackWarning = show;
};

export const handleIsSavedData = (isSaved: boolean) => {
  createCourseState.isSavedData = isSaved;
};

export const updateCreateCourseState = async <
  T extends keyof CreateCourseStateUpdate,
>(
  page: T,
  data: CreateCourseStateUpdate[T]
) => {
  if (page.endsWith("Data")) {
    (createCourseState as CreateCourseStateUpdate)[page] = data;
  }
};


export const setCoverImage = (coverImage: string) => {
  createCourseState.courseDetailsData.coverImage = coverImage;
};

export const setLoading = (loading: boolean) => {
  createCourseState.isLoading = loading;
};

export const resetCreateCourseState = <T extends keyof CreateCourseStateUpdate>(
  page: T
) => {
  createCourseState[page] = initialState[page];
};

export const resetCreateCourseStateFull = () => {
  createCourseState.currentStep = 0;
  createCourseState.showBackWarning = false;
  createCourseState.isEdit = false;
  createCourseState.isSavedData = true;
  createCourseState.categoryData = {
    profession: "",
    specialist: "",
    provider: "",
  };
  createCourseState.courseDetailsData = {
    serviceTitle: "",
    serviceDescription: "",
    coverImage: "",
    previewDescription: "",
    learningPoints: [],
    pricing: 0,
    discount: 0,
    discountOn: false,
    cmePoints: 0,
    cmdId: "",
    duration: 0,
  };

  // reset IDs
  createCourseState.serviceId = "";
  createCourseState.isLoading = false;
};

export const setEditMode = (isEdit: boolean) => {
  createCourseState.isEdit = isEdit;
};
