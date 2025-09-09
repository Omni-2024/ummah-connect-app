import Button from "@/components/base/button";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/base/tooltip";
import type { ReactNode } from "react";

type LabelTooltipProps = {
  label: string;
  children: ReactNode;
};

const LabelTooltip: React.FC<LabelTooltipProps> = (props) => {
  return (
    <TooltipProvider>
      <div className="flex gap-3">
        <div className="font-primary text-xl font-medium shrink-0">
          {props.label}
        </div>

        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="primary"
              className="h-6 w-6 p-0 items-center justify-center hover:bg-primary-500 active:bg-primary-500 shrink-0 "
            >
              ?
            </Button>
          </TooltipTrigger>

          <TooltipContent side="top">
            <TooltipArrow />
            {props.children}
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default LabelTooltip;
