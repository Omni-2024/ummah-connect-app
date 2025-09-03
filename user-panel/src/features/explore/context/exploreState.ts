import {useSnapshot} from "valtio/index";
import {
    exploreState, setLimit, setOffset, setProfession, setProfessionName,
    setSearchTerm, setServiceId, setServiceSlug,
    setShowGiftCourseModal,
    setShowServiceShareModal, setSpecialties
} from "@/features/explore/context/useExploreState";

export const useExploreState = () => {
    const snap = useSnapshot(exploreState);
    return {
        searchTerm: snap.searchTerm,
        setSearchTerm:setSearchTerm,
        showGiftCourseModal: snap.showGiftCourseModal,
        setShowGiftCourseModal: setShowGiftCourseModal,
        showServiceShareModal: snap.showServiceShareModal,
        setShowServiceShareModal: setShowServiceShareModal,
        showWatchIntroLessonModal: snap.showWatchIntroLessonModal,
        limit: snap.limit,
        setLimit: setLimit,
        offset: snap.offset,
        setOffset: setOffset,
        profession: snap.profession,
        setProfession: setProfession,
        professionName:snap.professionName,
        setProfessionName:setProfessionName,
        specialties:snap.specialties,
        setSpecialties:setSpecialties,
        serviceId:snap.serviceId,
        setServiceId:setServiceId,
        serviceSlug:snap.serviceSlug,
        setServiceSlug:setServiceSlug,
    };
};