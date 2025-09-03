import { cva } from "class-variance-authority";
import { AnimatePresence, motion } from "framer-motion";
import {JSX, useEffect, useState} from "react";

import { cn } from "@/lib/className";

interface FilterTabsProps {
  items: {
    id: string;
    title: string | JSX.Element;
    disabled?: boolean;
  }[];
  onTabChange?: (id: string) => void;
  tabSize?: "sm" | "md" | "lg";
  widthAuto?: boolean;
  activeItemId?: string;
}
const FilterTabs: React.FC<FilterTabsProps> = ({
  items,
  onTabChange,
  tabSize = "md",
  widthAuto = false,
  activeItemId: externalActiveItemId,
}) => {
  const defaultActiveItem = items?.[0]?.id;
  const [hoveredItem, setHoveredItem] = useState("");
  const [activeItemId, setActiveItemId] = useState(defaultActiveItem);

  useEffect(() => {
    if (externalActiveItemId) {
      setActiveItemId(externalActiveItemId);
    }
  }, [externalActiveItemId]);

  const handleTabChange = (id: string) => {
    setActiveItemId(id);
    onTabChange?.(id);
  };

  return (
    <AnimatePresence mode="wait">
      <div
        className="flex max-w-[calc(100vw-2rem)] items-center justify-around gap-4 overflow-x-scroll scrollbar-none scrollbar-thumb-transparent lg:max-w-[calc(100vw-5rem)]"
        onMouseLeave={() => setHoveredItem("")}
      >
        {items.map(({ id, title, disabled }) => {
          const isActive = id === activeItemId;
          return (
            <TabItem
              key={id}
              id={id}
              title={title}
              tabSize={tabSize}
              isActive={isActive}
              widthAuto={widthAuto}
              isItemHovered={hoveredItem === id}
              onClick={() => handleTabChange(id)}
              setHoveredItem={(itemId) => setHoveredItem(itemId)}
              disabled={disabled}
            />
          );
        })}
      </div>
    </AnimatePresence>
  );
};

export default FilterTabs;

interface TabItemProps {
  id: string;
  isActive: boolean;
  onClick?: () => void;
  isItemHovered?: boolean;
  title: string | JSX.Element;
  setHoveredItem: (id: string) => void;
  tabSize?: FilterTabsProps["tabSize"];
  widthAuto?: boolean;
  disabled?: boolean;
}

const TabItem: React.FC<TabItemProps> = ({
  id,
  title,
  isActive,
  onClick,
  setHoveredItem,
  isItemHovered,
  tabSize,
  widthAuto,
  disabled,
}) => {
  return (
    <div className="relative w-full" onMouseEnter={() => setHoveredItem(id)}>
      <button
        onClick={onClick}
        className={cn(
          "flex cursor-pointer select-none items-center justify-center overflow-hidden text-nowrap rounded-full border font-medium transition-colors ease-in",
          {
            "border-transparent bg-tertiary-500 text-white": isActive,
            "border-dark-50 hover:bg-dark-50": !isActive,
          },
          tabVariants({ size: tabSize }),
          { "w-auto min-w-fit": widthAuto },
          { "cursor-not-allowed opacity-50": disabled },
        )}
        disabled={disabled}
      >
        {title}
      </button>

      {isItemHovered && (
        <motion.div
          layoutId="hover-bg"
          className="absolute inset-0 -z-10 size-full rounded-full bg-dark-50"
        />
      )}
    </div>
  );
};

const tabVariants = cva("", {
  variants: {
    size: {
      sm: "w-full min-w-28 py-1.5 text-xs px-2",
      md: "w-full min-w-36 py-1.5 text-sm px-4",
      lg: "w-full min-w-44 py-2 text-sm px-5",
    },
  },
  defaultVariants: {
    size: "md",
  },
});
