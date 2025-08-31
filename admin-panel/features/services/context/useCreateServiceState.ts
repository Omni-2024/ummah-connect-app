import { useSnapshot } from "valtio";
import {
  createCourseState,
  deleteModule,
  deleteQuestion,
  deleteVideo,
  handleBack,
  handleNext,
  resetCreateCourseState,
  resetCreateCourseStateFull,
  setAssessmentId,
  setAssetCreated,
  setAssetId,
  setCourseId,
  setCoverImage,
  setCurrentStep,
  setDuration,
  setEditMode,
  setLoading,
  setModuleId,
  setQuestionId,
  setResources,
  setShowBackWarning,
  setVideoId,
  setVideoReady,
  setVideoThumbnail,
  setVideoUrl,
  updateCreateCourseState,
} from "./CreateServiceState";

export const useCreateServiceState = () => {
  const snap = useSnapshot(createCourseState);
  return {
    // State
    courseId: snap.courseId,
    assessmentId: snap.assessmentId,

    currentStep: snap.currentStep,
    showBackWarning: snap.showBackWarning,
    isSavedData: snap.isSavedData,
    editMode: snap.isEdit,
    isLoading: snap.isLoading,

    // Data
    categoryData: snap.categoryData,
    courseDetailsData: snap.courseDetailsData,
    modulesData: snap.modulesData,
    handleIsSavedData: snap.isSavedData,
    assessmentsData: snap.assessmentsData,

    // Actions
    setCourseId: setCourseId,
    setModuleId: setModuleId,
    setAssessmentId: setAssessmentId,
    setQuestionId: setQuestionId,
    deleteQuestion: deleteQuestion,
    setVideoId: setVideoId,
    setVideoUrl: setVideoUrl,
    setDuration: setDuration,
    setAssetId: setAssetId,
    setAssetCreated: setAssetCreated,
    setVideoReady: setVideoReady,
    setVideoThumbnail: setVideoThumbnail,
    setResources: setResources,
    deleteModule: deleteModule,
    deleteVideo: deleteVideo,
    setCurrentStep: setCurrentStep,
    setEditMode: setEditMode,
    setIsLoading: setLoading,
    handleNext: handleNext,
    handleBack: handleBack,
    setShowBackWarning: setShowBackWarning,
    updateCreateCourseState: updateCreateCourseState,
    setCoverImage: setCoverImage,
    resetCreateCourseState: resetCreateCourseState,
    resetCreateCourseStateFull: resetCreateCourseStateFull,
  };
};
