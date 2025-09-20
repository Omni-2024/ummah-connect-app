import CardWrapper from "@/features/auth/components/CardWrapper";
import { AnimatePresence } from "framer-motion";
import { CheckIcon } from "@heroicons/react/24/outline";

const ResetSuccessful = () => {
  //
  return (
    <main style={{ backgroundImage: "url(/images/textures/1.svg)" }}>
      <div className="hidden w-full items-center justify-center pt-6 md:flex">
        <img
          alt="logo"
          src="/images/logo.png"
          className="h-14 object-contain"
        />
      </div>

      <div className="container flex min-h-[calc(100vh-5rem)] flex-row items-center justify-center md:py-8">
        <AnimatePresence mode="wait">
          <CardWrapper className="flex h-svh min-w-[40vw] flex-col items-center justify-center space-y-6 p-4 sm:h-auto md:p-8">
            <div className="mb-4 mt-4 flex size-12 items-center justify-center rounded-full bg-primary-50 md:mt-0">
              <CheckIcon className="size-6 text-primary-500" />
            </div>

            <div className="space-y-4 px-10">
              <h1 className="text-center font-primary text-2xl font-semibold">
                Password reset successful
              </h1>

              <div>
                <p className="text-center text-sm text-dark-300">
                  Your password has been successfully reset. You can now log in
                  with your new password.
                </p>
                <p className="text-center text-sm text-dark-300">
                  If you didn't request this change, please contact our support
                  team immediately.
                </p>
              </div>

              <div>
                <div className="mt-8">
                  <p className="text-center text-sm text-primary-500">
                    You'll be redirected shortly to Ummah Community Log In...
                  </p>
                </div>
              </div>
            </div>
          </CardWrapper>
        </AnimatePresence>
      </div>
    </main>
  );
};

export default ResetSuccessful;
