import {proxy} from "valtio/index";


export type ExploreState = {
    searchTerm?: string;
    showGiftCourseModal?: boolean;
    showServiceShareModal?: boolean;
    showWatchIntroLessonModal?: boolean;
    limit: number;
    offset: number;
    profession?: string;
    professionName?: string;
    specialties?:string[];
    serviceId?: string;
    serviceSlug?: string;
}

const initialState: ExploreState = {
    searchTerm: "",
    showGiftCourseModal: false,
    showServiceShareModal: false,
    showWatchIntroLessonModal: false,
    limit: 9,
    offset: 0,
    profession: "",
    professionName: "",
    specialties: [],
    serviceId: "",
    serviceSlug: "",
}

export const exploreState = proxy<ExploreState>(initialState);

export const setSearchTerm = (term: string) => {
    exploreState.searchTerm = term;
};

export const setShowGiftCourseModal = (show: boolean) => {
    exploreState.showGiftCourseModal = show;
};

export const setShowServiceShareModal = (show: boolean) => {
    exploreState.showServiceShareModal = show;
};

export const setShowWatchIntroLessonModal = (show: boolean) => {
    exploreState.showWatchIntroLessonModal = show;
};

export const setLimit = (limit: number) => {
    exploreState.limit = limit;
};

export const setOffset = (offset: number) => {
    exploreState.offset = offset;
};

export const setProfession = (profession: string) => {
    exploreState.profession = profession;
};

export const setProfessionName = (professionName: string) => {
    exploreState.professionName = professionName;
};

export const setSpecialties = (specialities: string[]) => {
    exploreState.specialties = specialities;
};

export const setServiceId = (serviceId: string) => {
    exploreState.serviceId = serviceId;
};

export const setServiceSlug = (serviceSlug: string) => {
    exploreState.serviceSlug = serviceSlug;
};