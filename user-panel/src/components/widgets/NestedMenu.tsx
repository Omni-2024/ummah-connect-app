import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../base/DropdownMenu";
import { NextRouter, useRouter } from "next/router";
import {useOnboardingState} from "@/features/onboarding/context/useOnboardingState";
import {useExploreState} from "@/features/explore/context/useExploreState";

export interface MenuItem {
  id: string;
  title: string;
  subMenu?: MenuItem[];
  isProfession?: boolean;
  isSpecialty?: boolean;
  parentProfession?: Partial<MenuItem>;
  parentType?: Partial<MenuItem>;
}

const handleMenuClick = (
  menuItem: MenuItem,
  setOpen: (open: boolean) => void,
  dispatch: AppDispatch,
  router: NextRouter,
) => {
  if (menuItem.isProfession) {
    dispatch(
      exploreActions.setProfession({
        profession: menuItem.id,
        professionName: menuItem.title,
      }),
    );
  } else if (menuItem.isSpecialty) {
    dispatch(
      exploreActions.setProfession({
        profession: menuItem.parentProfession?.id || "",
        professionName: menuItem.parentProfession?.title || "",
      }),
    );
    dispatch(
      exploreActions.toggleType({
        id: menuItem.parentType?.id || "",
        specialties: [],
      }),
    );
    dispatch(exploreActions.toggleSpecialty(menuItem.id));
  }

  // Navigate to /explore after setting the state
  router.push("/explore");
  // Close the dropdown menu
  setOpen(false);
};

const renderMenuItem = (
  menuItem: MenuItem,
  setOpen: (open: boolean) => void,
  dispatch: AppDispatch,
  router: NextRouter,
) => (
  <DropdownMenuItem
    key={menuItem.id}
    className="rounded-md focus:bg-primary-500 focus:text-white"
    onClick={() => {
      handleMenuClick(menuItem, setOpen, dispatch, router);
    }}
  >
    {menuItem.title}
  </DropdownMenuItem>
);

const renderSubMenu = (
  subMenu: MenuItem,
  setOpen: (open: boolean) => void,
  dispatch: AppDispatch,
  router: NextRouter,
) => (
  <DropdownMenuSub key={subMenu.id}>
    <DropdownMenuSubTrigger
      className="rounded-md data-[state=open]:bg-primary-500 data-[state=open]:text-white focus:bg-primary-500 focus:text-white"
      onClick={() => handleMenuClick(subMenu, setOpen, dispatch, router)}
    >
      {subMenu.title}
    </DropdownMenuSubTrigger>
    <DropdownMenuSubContent className="p-2" sideOffset={20}>
      {renderMenuItems(subMenu.subMenu!, setOpen, dispatch, router)}
    </DropdownMenuSubContent>
  </DropdownMenuSub>
);

const renderMenuItems = (
  menuItems: MenuItem[],
  setOpen: (open: boolean) => void,
  dispatch: AppDispatch,
  router: NextRouter,
) =>
  menuItems?.map((menuItem) => {
    if (menuItem.subMenu && menuItem.subMenu.length > 0) {
      return renderSubMenu(menuItem, setOpen, dispatch, router);
    } else {
      return renderMenuItem(menuItem, setOpen, dispatch, router);
    }
  });

interface NestedMenu {
  children?: React.ReactNode;
  menuItems: MenuItem[];
}

const NestedMenu: React.FC<NestedMenu> = ({ children, menuItems }) => {
    const { selectedDesignation, selectedInterests, resetOnboardingState } =
        useExploreState();
  const router = useRouter();
  //
  const [open, setOpen] = useState(false); // State to control menu open/close
  //
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 p-2">
        <DropdownMenuGroup>
          {renderMenuItems(menuItems, setOpen, dispatch, router)}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NestedMenu;
