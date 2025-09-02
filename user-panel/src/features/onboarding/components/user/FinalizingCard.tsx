import Spinner from "@/components/base/Spinner";
import CardWrapper from "@/features/auth/components/CardWrapper";

const FinalizingCard = () => {
  return (
    <CardWrapper className="flex flex-col items-center justify-center lg:w-[55vw] lg:p-14">
      <Spinner classname="size-14 text-primary-500" />

      <div className="l mt-6 space-y-2 lg:w-11/12">
        <h1 className="w-full text-center font-primary text-xl font-bold lg:text-3xl">
          Hang on while we personalize your account!
        </h1>

        <p className="hidden text-center text-sm font-medium text-dark-200 lg:block">
          We're setting up your personalized experience. This may take a few
          moments. Thank you for your patience!
        </p>
      </div>
    </CardWrapper>
  );
};

export default FinalizingCard;
