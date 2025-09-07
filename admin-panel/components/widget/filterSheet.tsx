import { Close } from "@/assets/icons/close";
import Button from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
    <>
      <Sheet
        open={props.open}
        onOpenChange={(open) => {
          if (!open) {
            props.onClose();
          }
        }}
      >
        <SheetContent className="flex flex-col p-0 overflow-auto">
          <SheetHeader hidden className="hidden">
            <SheetTitle>{props.title ?? "Filter"}</SheetTitle>
            <SheetDescription>
              {props.description ?? "Filter based on your preferences"}
            </SheetDescription>
          </SheetHeader>
          <div className="sticky top-0 bg-white pt-4 z-10">
            <Button
              variant="link"
              onClick={props.onClose}
              className="justify-start text-black hover:text-black focus:text-black "
            >
              <Close />
              <span className="font-medium text-base text-black">Close</span>
            </Button>
          </div>

          <Separator />

          <div className="flex flex-col bg-white">{props.children}</div>

          <Separator className="mt-auto" />

          <SheetFooter className="px-6 pt-2 pb-4 sticky bottom-0 bg-white">
            <Button variant="secondary" onClick={props.onClose}>
              Close
            </Button>
            <Button className="w-full" onClick={props.onApply}>
              Apply
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default FilterSheet;
