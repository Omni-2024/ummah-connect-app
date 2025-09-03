import Toaster, { Toast } from "@/components/base/Toast";
import { cn } from "@/lib/className";
import { ArrowRight2 } from "iconsax-react";
import Link from "next/link";

export interface SettingsItemProps {
  title: string;
  icon: React.ReactNode;
  description?: string;
  path?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const SettingsItem = ({
  icon,
  title,
  description,
  onClick,
  path,
  disabled,
}: SettingsItemProps) => {
  return (
    <ItemWrapper
      path={disabled ? undefined : path}
      onClick={disabled ? undefined : onClick}
    >
      <div
        className={cn(
          "flex select-none items-center justify-between rounded-xl border px-4 py-4 transition-transform ease-in-out",
          disabled ? "opacity-50" : "hover:bg-dark-50 active:scale-[.98]",
        )}
      >
        <div className="line-clamp-1 flex items-center gap-4">
          <span>{icon}</span>
          <div>
            <h3 className="font-primary text-base font-medium">{title}</h3>
            {description && (
              <p className="text-xs text-dark-300">{description}</p>
            )}
          </div>
        </div>

        <ArrowRight2 className="size-4 text-dark-400" />
      </div>
    </ItemWrapper>
  );
};

export default SettingsItem;

interface ItemWrapperProps {
  path?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const ItemWrapper = ({
  path,
  onClick,
  children,
  className,
  disabled,
}: ItemWrapperProps) => {
  if (path) {
    return (
      <Link className={className} href={path}>
        {children}
      </Link>
    );
  }
  return (
    <div
      className={cn("cursor-not-allowed", className)}
      onClick={() => {
        if (onClick) {
          onClick();
        }
        if (disabled) Toast.error("Coming Soon.");
      }}
    >
      {children}
    </div>
  );
};
