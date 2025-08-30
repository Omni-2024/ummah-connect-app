import Spinner from "@/components/base/Spinner";
import Image from "next/image";

export const LoadingScreen = () => {
  return (
    <main className="h-screen overflow-y-scroll scrollbar-thin ">
      <div className="flex w-full items-center justify-center pt-6">
        <Image
          alt="logo"
          src="/images/logo.svg"
          className="object-contain"
          height={72}
          width={128}
        />
      </div>

      <div className="container flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center lg:min-h-[calc(100vh-5rem)] overflow-hidden  bg-white p-4 ">
        <Spinner className="size-14 text-primary-500" />

        <div className="l mt-6 space-y-2 lg:w-11/12">
          <h1 className="w-full text-center font-primary text-xl font-bold lg:text-3xl">
            Hang tight while we verify your access!
          </h1>

          <p className="text-center text-sm font-medium text-dark-200">
            We&apos;re setting up your secure environment. This may take a few
            moments. Thank you for your patience!
          </p>
        </div>
      </div>
    </main>
  );
};
