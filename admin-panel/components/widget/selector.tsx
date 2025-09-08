import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/base/select";
import { cn } from "@/lib/className";
import type { SelectProps } from "@radix-ui/react-select";

type SelectorProps = {
  placeholder?: string;
  className?: string;
  items?: {
    value: string;
    label: string;
  }[];
  error?: string;
} & SelectProps;

const Selector: React.FC<SelectorProps> = ({
  items = [],
  placeholder,
  className,
  ...props
}) => {
  return (
    <Select {...props}>
      <div className="flex flex-col">
        <SelectTrigger className={cn("w-[180px] px-6 py-4", className)}>
          <SelectValue placeholder={placeholder ?? "Select an item"} />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
        <div className="text-red-500 text-[12px] mt-1 h-[12px]">
          {props.error}
        </div>
      </div>
    </Select>
  );
};

export default Selector;
