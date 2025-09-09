import {
  TooltipArrow,
  TooltipContent,
  Tooltip as TooltipRoot,
  TooltipTrigger,
} from "../base/Tooltip";
import { TooltipContentProps } from "@radix-ui/react-tooltip";
import { cn } from "@/lib/className";

interface Props {
  text?: string;
  hideArrow?: boolean;
  textClassName?: string;
  children: React.ReactNode;
  content?: React.ReactNode;
  side?: TooltipContentProps["side"];
}

const Tooltip: React.FC<Props> = ({
  side,
  text,
  content,
  children,
  textClassName,
  hideArrow = false,
}) => {
  if (!content && !text) {
    return <>{children}</>;
  }

  return (
    <TooltipRoot>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side}>
        {text && <p className={cn("text-white", textClassName)}>{text}</p>}
        {content}
        {!hideArrow && <TooltipArrow className="fill-secondary-500" />}
      </TooltipContent>
    </TooltipRoot>
  );
};

export default Tooltip;
