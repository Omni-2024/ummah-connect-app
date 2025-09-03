import { ArrowLeft2 } from "iconsax-react";
import Link from "next/link";

import IconButton from "@/components/base/IconButton";
import { cn } from "@/lib/className";

interface Props {
  left: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
}

const NavbarMobile = ({ left, right, className }: Props) => {
  return (
    <nav
      className={cn(
        "sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-b-dark-50 bg-white px-2 lg:hidden",
        className,
      )}
    >
      {left}
      {right}
    </nav>
  );
};

export default NavbarMobile;

interface NavbarTitleProps {
  title?: string;
  size?: "sm" | "md";
}
export const NavbarTitle = ({ title, size = "sm" }: NavbarTitleProps) => {
  return (
    <h2
      className={cn("font-primary text-lg font-semibold", {
        "text-2xl font-bold": size === "md",
      })}
    >
      {title}
    </h2>
  );
};

interface TitleWithBackButtonProps {
  title: string;
  onBackClick?: () => void;
  backButtonHref?: string;
}
export const TitleWithBackButton = ({
  title,
  onBackClick,
  backButtonHref,
}: TitleWithBackButtonProps) => {
  return (
    <div className="flex items-center gap-2">
      {backButtonHref ? (
        <IconButton asChild>
          <Link href={backButtonHref}>
            <ArrowLeft2 className="size-6 text-dark-600" />
          </Link>
        </IconButton>
      ) : (
        <IconButton onClick={onBackClick}>
          <ArrowLeft2 className="size-6 text-dark-600" />
        </IconButton>
      )}
      <NavbarTitle title={title} />
    </div>
  );
};
