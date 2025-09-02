import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/base/DropdownMenu";
import NotificationItem from "./NotificationItem";
import { cn } from "@/lib/className";

interface Props {
  children: React.ReactNode;
  disabled?: boolean;
}

const NotificationsDropdown: React.FC<Props> = ({ children, disabled }) => {
  return (
    <DropdownMenu open={disabled ? false : undefined}>
      <DropdownMenuTrigger className={cn("outline-none ring-0")}>
        {children}
      </DropdownMenuTrigger>

      <DropdownMenuContent className="mr-2 w-96 rounded-lg px-2.5 pb-4">
        <DropdownMenuLabel className="py-2" asChild>
          <div className="flex items-center justify-between">
            <h2 className="line-clamp-1 text-base font-bold">Notifications</h2>
            <button className="line-clamp-1 text-xs font-medium text-primary-500">
              Clear all
            </button>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup asChild>
          <div className="max-h-[50vh] space-y-2 overflow-y-scroll px-2 pt-1 scrollbar-thin">
            <h4 className="font-primary text-sm font-semibold">Newest</h4>
            <div className="flex flex-col gap-3">
              {[
                {
                  id: "1",
                  title: "When payment failed or something happenned",
                  description: "Notification description will be added here",
                },
                {
                  id: "2",
                  title: "New courses added",
                  description: "Notification description will be added here",
                },
                {
                  id: "3",
                  title: "Discount amount notification",
                  description: "Notification description will be added here",
                },
                {
                  id: "4",
                  title: "Discount amount notification",
                  description: "Notification description will be added here",
                },
                {
                  id: "5",
                  title: "Discount amount notification",
                  description: "Notification description will be added here",
                },
                {
                  id: "6",
                  title: "Discount amount notification",
                  description: "Notification description will be added here",
                },
              ].map(({ id, title, description }) => (
                <NotificationItem
                  key={id}
                  title={title}
                  description={description}
                  time="2 hours ago"
                />
              ))}
            </div>
          </div>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsDropdown;
