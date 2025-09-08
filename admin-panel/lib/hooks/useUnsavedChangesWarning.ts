import { useEffect } from "react";

function useUnsavedChangesWarning(shouldWarn: boolean) {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!shouldWarn) {
        return;
      }
      e.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [shouldWarn]);
}

export default useUnsavedChangesWarning;
