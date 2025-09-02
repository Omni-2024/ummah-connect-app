interface Props {
  heading: string;
}

const AuthCardHeader: React.FC<Props> = ({ heading }) => {
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <img src="/images/logo.png" alt="logo" className="w-28 object-contain" />

      <h1 className="w-11/12 text-center font-primary text-2xl font-semibold md:w-10/12">
        {heading}
      </h1>

      <div className="space-y-3">
        <div className="flex items-center justify-center">
          {Array.from({ length: 6 }, (_, idx) => {
            return (
              <div
                key={idx}
                className="flex size-10 items-center justify-center overflow-hidden rounded-full border-2 border-white"
                style={{ marginLeft: idx === 0 ? 0 : "-0.65rem" }}
              >
                <img
                  src={`/images/doctors/${idx + 1}.png`}
                  alt={`doctor ${idx + 1}`}
                  className="size-full object-cover"
                />
              </div>
            );
          })}
        </div>

        <p className="text-sm">Join these and other 1000+ physicians now</p>
      </div>
    </div>
  );
};

export default AuthCardHeader;
