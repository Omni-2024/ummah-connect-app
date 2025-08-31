import { useWindowSize } from "usehooks-ts";

const useIsDesktop = () => {
  const isDesktop = useWindowSize().width > 1024;
  return isDesktop;
};

export default useIsDesktop;
