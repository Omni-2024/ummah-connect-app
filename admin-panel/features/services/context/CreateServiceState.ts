import { proxy } from "valtio";
import type {
  CategoriesPageData,
ServiceDetailsPageData} from "../types/addService";

export const CREATE_SERVICE_LAST_STEP = 2;



type CreateServiceState = {
  currentStep: number;
  showBackWarning: boolean;
  isSavedData: boolean;
  isEdit?: boolean;
  isLoading: boolean;

  serviceId: string;

  categoryData: CategoriesPageData;
  serviceDetailsData: ServiceDetailsPageData;
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

  serviceDetailsData: {
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

export const createServiceState = proxy<CreateServiceState>(initialState);

type CreateServiceStateUpdate = Pick<
  CreateServiceState,
  "categoryData" | "serviceDetailsData"
>;

export const setServiceId = (serviceId: string) => {
  createServiceState.serviceId = serviceId;
};

export const setCurrentStep = (step: number) => {
  createServiceState.currentStep = step;
};
export const handleNext = () => {
  if (createServiceState.currentStep === CREATE_SERVICE_LAST_STEP) {
    return;
  }
  createServiceState.currentStep += 1;
};
export const handleBack = () => {
  if (createServiceState.currentStep === 0) {
    createServiceState.showBackWarning = true;
    return;
  }
  createServiceState.currentStep -= 1;
};
export const setShowBackWarning = (show: boolean) => {
  createServiceState.showBackWarning = show;
};

export const handleIsSavedData = (isSaved: boolean) => {
  createServiceState.isSavedData = isSaved;
};

export const updateCreateServiceState = async <
  T extends keyof CreateServiceStateUpdate,
>(
  page: T,
  data: CreateServiceStateUpdate[T]
) => {
  if (page.endsWith("Data")) {
    (createServiceState as CreateServiceStateUpdate)[page] = data;
  }
};


export const setCoverImage = (coverImage: string) => {
  createServiceState.serviceDetailsData.coverImage = coverImage;
};

export const setLoading = (loading: boolean) => {
  createServiceState.isLoading = loading;
};

export const resetCreateServiceState = <T extends keyof CreateServiceStateUpdate>(
  page: T
) => {
  createServiceState[page] = initialState[page];
};

export const resetCreateServiceStateFull = () => {
  createServiceState.currentStep = 0;
  createServiceState.showBackWarning = false;
  createServiceState.isEdit = false;
  createServiceState.isSavedData = true;
  createServiceState.categoryData = {
    profession: "",
    specialist: "",
    provider: "",
  };
  createServiceState.serviceDetailsData = {
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
  createServiceState.serviceId = "";
  createServiceState.isLoading = false;
};

export const setEditMode = (isEdit: boolean) => {
  createServiceState.isEdit = isEdit;
};
