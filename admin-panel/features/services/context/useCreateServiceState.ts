import { useSnapshot } from "valtio";
import {
  createServiceState, handleBack, handleNext, resetCreateServiceState,
  resetCreateServiceStateFull, setCoverImage, setCurrentStep, setEditMode, setFAQId, setLoading,
  setServiceId, setShowBackWarning, updateCreateServiceState
} from "@/features/services/context/CreateServiceState";


export const useCreateServiceState = () => {
  const snap = useSnapshot(createServiceState);
  return {
    // State
    serviceId: snap.serviceId,

    currentStep: snap.currentStep,
    showBackWarning: snap.showBackWarning,
    isSavedData: snap.isSavedData,
    editMode: snap.isEdit,
    isLoading: snap.isLoading,

    // Data
    categoryData: snap.categoryData,
    serviceDetailsData: snap.serviceDetailsData,
    handleIsSavedData: snap.isSavedData,

    faqId:snap.faqId,
    faqData:snap.faqData,
    setFAQId:setFAQId,

    // Actions
    setServiceId: setServiceId,
    setCurrentStep: setCurrentStep,
    setEditMode: setEditMode,
    setIsLoading: setLoading,
    handleNext: handleNext,
    handleBack: handleBack,
    setShowBackWarning: setShowBackWarning,
    updateCreateServiceState: updateCreateServiceState,
    setCoverImage: setCoverImage,
    resetCreateServiceState: resetCreateServiceState,
    resetCreateServiceStateFull: resetCreateServiceStateFull,
  };
};
