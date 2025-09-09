"use client"
import { cva } from "class-variance-authority";
import { AnimatePresence, motion } from "framer-motion";
import {ReactNode, useState} from "react";

import { cn } from "@/lib/className";

interface FilterTabsProps {
  items: {
    id: string;
    title: string | ReactNode;
  }[];
  onTabChange?: (id: string) => void;
  tabSize?: "sm" | "md" | "lg";
  widthAuto?: boolean;
  className?: string;
}
const FilterTabs: React.FC<FilterTabsProps> = ({
  items,
  onTabChange,
  tabSize = "md",
  widthAuto = false,
  className,
}) => {
  console.log("Test",items)
  const defaultActiveItem = items?.[0].id;
  const [hoveredItem, setHoveredItem] = useState("");
  const [activeItemId, setActiveItemId] = useState(defaultActiveItem);

  const handleTabChange = (id: string) => {
    setActiveItemId(id);
    onTabChange?.(id);
  };

  return (
    <AnimatePresence mode="wait">
      <div
        className={cn(
          "flex max-w-[calc(100vw-2rem)] items-center gap-4 overflow-x-scroll scrollbar-none scrollbar-thumb-transparent lg:max-w-[calc(100vw-5rem)]",
          className
        )}
        onMouseLeave={() => setHoveredItem("")}
      >
        {items.map(({ id, title }) => {
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
  title: string | ReactNode;
  setHoveredItem: (id: string) => void;
  tabSize?: FilterTabsProps["tabSize"];
  widthAuto?: boolean;
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
}) => {
  return (
    <div
      className={cn("relative w-auto")}
      onMouseEnter={() => setHoveredItem(id)}
    >
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "flex cursor-pointer select-none items-center justify-center overflow-hidden text-nowrap rounded-full border font-medium transition-colors ease-in text-base",
          {
            "border-transparent bg-tertiary-500 text-white": isActive,
            "border-dark-50 hover:bg-dark-50": !isActive,
          },
          tabVariants({ size: tabSize }),
          { "w-auto min-w-fit": widthAuto }
        )}
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
      md: "w-full min-w-36 py-1.5 text-base px-4",
      lg: "w-full min-w-44 py-2 text-base px-5",
    },
  },
  defaultVariants: {
    size: "md",
  },
});
