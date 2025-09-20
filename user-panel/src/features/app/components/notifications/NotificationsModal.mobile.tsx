import { useEffect } from "react";

import { Dialog, DialogContent } from "@/components/base/Dialog";
import useIsMobile from "@/lib/hooks/useIsMobile";
import NavbarMobile, { TitleWithBackButton } from "../Navbar.mobile";
import NotificationItem from "./NotificationItem";
import { useAppState } from "@/features/app/context/useAppState";

const NotificationsModal = (props: { disabled?: boolean }) => {
  const { showNotificationsModal, setShowNotificationsModal } = useAppState();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile) {
      setShowNotificationsModal(false);
    }
  }, [isMobile]);

  const handleOpenChange = (open: boolean) => {
    setShowNotificationsModal(open);
  };

  return (
    <Dialog
      open={props.disabled ? false : showNotificationsModal}
      onOpenChange={handleOpenChange}
    >
      <DialogContent className="h-full max-h-screen max-w-screen-lg overscroll-y-auto">
        <div className="">
          <NavbarMobile
            left={
              <TitleWithBackButton
                title="Notifications"
                onBackClick={() => handleOpenChange(false)}
              />
            }
          />

          <div className="space-y-4 p-4">
            <h4 className="font-primary text-lg font-semibold">Newest</h4>
            <div className="flex flex-col gap-2">
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationsModal;
