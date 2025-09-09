import {useSnapshot} from "valtio";
import {
    exploreState, setLimit, setOffset, setProfession, setProfessionName,
    setSearchTerm, setServiceId, setServiceSlug, setShowGiftServiceModal,
    setShowServiceShareModal, setSpecialties
} from "@/features/explore/context/exploreState";

export const useExploreState = () => {
    const snap = useSnapshot(exploreState);
    return {
        searchTerm: snap.searchTerm,
        setSearchTerm:setSearchTerm,
        showGiftServiceModal: snap.showGiftServiceModal,
        setShowGiftServiceModal:setShowGiftServiceModal,
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