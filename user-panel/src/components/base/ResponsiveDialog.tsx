import { Fragment } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/base/Dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/base/Drawer";
import { cn } from "@/lib/className";
import useIsDesktop from "@/lib/hooks/useIsDesktop";

interface Props {
  show: boolean;
  setShow: (open: boolean) => void;
  children?: React.ReactNode;
  title?: string;
  description?: string;
  dialogContainerClassName?: string;
}

const ResponsiveDialog = ({
  show,
  setShow,
  children,
  title,
  description,
  dialogContainerClassName,
}: Props) => {
  const isDesktop = useIsDesktop();

  if (isDesktop) {
    return (
      <Dialog open={show} onOpenChange={setShow}>
        <DialogContent className="max-w-[max-content]">
          <div
            className={cn(
              "max-h-[85dvh] max-w-lg overflow-x-hidden overflow-y-scroll scrollbar-thin",
              dialogContainerClassName,
            )}
          >
            {(title || description) && (
              <DialogHeader>
                {title && <DialogTitle>{title}</DialogTitle>}
                {description && (
                  <DialogDescription>{description}</DialogDescription>
                )}
              </DialogHeader>
            )}

            <Fragment>{children}</Fragment>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={show} onOpenChange={setShow}>
      <DrawerContent className="max-h-[85dvh]">
        <div className="max-h-[85dvh] overflow-y-scroll scrollbar-thin">
          {(title || description) && (
            <DrawerHeader className="gap-0.5 p-0 px-4 text-left">
              {title && <DrawerTitle>{title}</DrawerTitle>}
              {description && (
                <DrawerDescription>{description}</DrawerDescription>
              )}
            </DrawerHeader>
          )}

          <Fragment>{children}</Fragment>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ResponsiveDialog;
