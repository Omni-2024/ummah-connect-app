import { useWindowSize } from "usehooks-ts";

const useIsMobile = () => {
  const isMobile = useWindowSize().width < 768;
  return isMobile;
};

export default useIsMobile;
