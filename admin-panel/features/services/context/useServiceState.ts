import { useSnapshot } from "valtio";
import {
  serviceState,
  setCMEDown,
  setCMEUp,
  setProviders,
  setIsPublished,
  setLimit,
  setOffset,
  setSearch,
  removeProviders,
  setProfession,
  setSpecialist,
} from "./ServiceState";

export const useServiceState = () => {
  const snap = useSnapshot(serviceState);
  return {
    limit: snap.limit,
    offset: snap.offset,
    cmeUp: snap.cmeUp,
    cmeDown: snap.cmeDown,
    search: snap.search,
    isPublished: snap.isPublished,
    providers: snap.providers,
    profession: snap.profession,
    specialist: snap.specialist,
    //
    setLimit: setLimit,
    setOffset: setOffset,
    setCMEUp: setCMEUp,
    setCMEDown: setCMEDown,
    setSearch: setSearch,
    setIsPublished: setIsPublished,
    setProviders: setProviders,
    removeProviders: removeProviders,
    setProfession: setProfession,
    setSpecialist: setSpecialist,
  };
};
