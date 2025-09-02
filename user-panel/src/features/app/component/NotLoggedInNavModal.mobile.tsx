import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@components/base/Dialog";
import { useAppState } from "../context/useAppState";
import Link from "next/link";
import Button from "@components/base/Button";
import { Fragment } from "react";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import ComingSoonToolTip from "@components/widgets/ComingSoonToolTip";

const NotLoggedInNavModal = () => {
  const { showNotLoggedInNavModal, setShowNotLoggedInNavModal } = useAppState();
  //
  const handleShowNavModal = (open: boolean) => {
    setShowNotLoggedInNavModal(open);
  };
  //
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/business", label: "MedLearning Business", disabled: true },
    { href: "/insights", label: "Insights", disabled: true },
    { href: "/contact", label: "Contact", disabled: true },
  ];
  //
  const handleOnClick = () => {
    setShowNotLoggedInNavModal(false);
  };
  //
  return (
    <Dialog open={showNotLoggedInNavModal} onOpenChange={handleShowNavModal}>
      <DialogContent className="h-full max-h-screen max-w-screen-lg bg-primary-100 lg:h-auto lg:max-h-full lg:max-w-3xl">
        <DialogHeader className="border-none p-2 shadow-md">
          <div className="flex items-center gap-3">
            <DialogTitle>
              <Link href="/">
                <img
                  alt="MedLearning Logo"
                  src="/images/logo.svg"
                  className="max-h-12 min-w-20 cursor-pointer object-contain"
                />
              </Link>
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="">
          <div className="h-dvh overflow-y-auto p-5 scrollbar-thin lg:h-auto">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Fragment key={link.href}>
                  {link.disabled ? (
                    <ComingSoonToolTip className="w-full text-left">
                      <Button
                        variant="unstyled"
                        disabled
                        className="px-3 text-xl text-black"
                      >
                        {link.label}
                      </Button>
                      <hr className="mt-3 border-primary-200" />
                    </ComingSoonToolTip>
                  ) : (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={handleOnClick}
                    >
                      <Button
                        variant="unstyled"
                        className="px-3 text-xl text-black"
                      >
                        {link.label}
                      </Button>
                      <hr className="mt-3 border-primary-200" />
                    </Link>
                  )}
                </Fragment>
              ))}

              <div className="flex justify-between gap-4">
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotLoggedInNavModal;
