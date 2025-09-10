import { Close } from "@/assets/icons/close";
import Button from "@/components/base/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/base/sheet";
import { Separator } from "@radix-ui/react-dropdown-menu";

type FilterSheetProps = {
  children?: React.ReactNode;
  open: boolean;
  onClose: () => void;
  onApply: () => void;
  title?: string;
  description?: string;
};

const FilterSheet: React.FC<FilterSheetProps> = (props) => {
  return (
    <Sheet
      open={props.open}
      onOpenChange={(open) => {
        if (!open) props.onClose();
      }}
    >
      <SheetContent className="flex flex-col p-0 overflow-auto bg-white text-white rounded-lg shadow-lg max-w-md w-full border-none">
        {/* Optional Header */}
        <SheetHeader hidden className="hidden">
          <SheetTitle>{props.title ?? "Filter"}</SheetTitle>
          <SheetDescription>
            {props.description ?? "Filter based on your preferences"}
          </SheetDescription>
        </SheetHeader>

        {/* Sticky Top Bar with Close */}
        <div className="sticky top-0 bg-gradient-to-br from-[#669f9d] to-[#337f7c] z-10 flex items-center justify-between px-4 py-3">
          <h2 className="font-semibold text-2xl">{props.title ?? "Filter"}</h2>
          <Button
            variant="link"
            onClick={props.onClose}
            className="p-1 text-white hover:text-white focus:text-white"
          >
            <Close />
          </Button>
        </div>

        {/* Separator */}
        <Separator className="" />

        {/* Content Area */}
        <div className="flex flex-col gap-4 px-4 py-4">{props.children}</div>

        {/* Bottom Separator */}
        <Separator className=" mt-auto" />

        {/* Sticky Footer with Buttons */}
        <SheetFooter className="sticky bg-white px-4 py-3 flex gap-3">
          <Button
            variant="secondary"
            className="flex-1 text-black hover:text-black border-[#337f7c]/50 py-2 rounded-xl"
            onClick={props.onClose}
          >
            Close
          </Button>
          <Button
            className="flex-1 bg-gradient-to-br from-[#669f9d] to-[#337f7c] py-2 rounded-xl"
            onClick={props.onApply}
          >
            Apply
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default FilterSheet;
