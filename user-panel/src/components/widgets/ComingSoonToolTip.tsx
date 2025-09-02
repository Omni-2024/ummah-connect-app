import { Toast } from "@/components/base/Toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/base/Tooltip";
import { cn } from "@/lib/className";
import useIsMobile from "@/lib/hooks/useIsMobile";
import React from "react";

export const ComingSoonToolTip = (props: {
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
}) => {
  const isMobile = useIsMobile();

  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <div>
          <TooltipTrigger
            className={cn("!pointer-events-auto w-full", props.className)}
            // asChild={props.asChild}
            // Toast not working due disabled buttons
            // onPointerDown={(e) => {
            //   Toast.error("Coming Soon");
            // }}
            onClick={(e) => {
              if (isMobile) Toast.error("Coming Soon");
            }}
          >
            {props.children}
          </TooltipTrigger>
        </div>
        <TooltipContent className="pointer-events-none cursor-default touch-auto select-none">
          <p>Coming Soon</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ComingSoonToolTip;
