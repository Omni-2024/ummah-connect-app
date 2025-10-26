"use client"

import { Sheet, SheetContent } from "@/components/base/Sheet";
import { ProfileView } from "@/features/settings/components/ProfileView.mobile";
import { useAppState } from "../context/useAppState";

const NavDrawer = () => {
  const { showNavDrawer, setShowNavDrawer } = useAppState();

  const handleOpenchange = (open: boolean) => {
    setShowNavDrawer(open);
  };

  return (
    <Sheet open={showNavDrawer} onOpenChange={handleOpenchange}>
      <SheetContent side="left" className="w-10/12 p-0">
        {/* <ProfileView /> */}
      </SheetContent>
    </Sheet>
  );
};

export default NavDrawer;
