import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/base/Dialog";
import { useAppState } from "../context/useAppState";
import Link from "next/link";
import Button from "@/components/base/Button";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { NAV_LOGO_SRC } from "@/lib/constants";

const NotLoggedInNavModal = () => {
  const { showNotLoggedInNavModal, setShowNotLoggedInNavModal } = useAppState();

  const handleShowNavModal = (open: boolean) => {
    setShowNotLoggedInNavModal(open);
  };

  const handleOnClick = () => {
    setShowNotLoggedInNavModal(false);
  };

  return (
    <Dialog open={showNotLoggedInNavModal} onOpenChange={handleShowNavModal}>
      <DialogContent className="max-w-md bg-primary-100">
        <DialogHeader className="border-none p-2 shadow-md">
          <div className="flex items-center gap-3">
            <DialogTitle>
              <Link href="/">
                <img
                  alt="MedLearning Logo"
                  src={NAV_LOGO_SRC}
                  className="max-h-12 min-w-20 cursor-pointer object-contain"
                />
              </Link>
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="p-5">
          <div className="flex flex-col gap-4">
            <div className="w-full">
              <Link href="/user/login" onClick={handleOnClick}>
                <Button variant="secondary" className="w-full">
                  Login
                </Button>
              </Link>
            </div>
            <div className="w-full">
              <Link href="/user/signup" onClick={handleOnClick}>
                <Button
                  variant="primary"
                  rightIcon={<ArrowRightIcon className="size-4" />}
                  className="w-full"
                >
                  Join for Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotLoggedInNavModal;