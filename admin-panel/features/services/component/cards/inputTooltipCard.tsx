import { cn } from "@/lib/className";

type InputTooltipCardProps = {
  title: string;
  desc: string;
  center?: boolean;
};

const InputTooltipCard: React.FC<InputTooltipCardProps> = (props) => {
  return (
    <div className={cn("flex flex-col gap-1", props.center && "items-center")}>
      <div className="font-primary text-base font-medium">{props.title}</div>
      <div className="text-sm">{props.desc}</div>
    </div>
  );
};

export default InputTooltipCard;
