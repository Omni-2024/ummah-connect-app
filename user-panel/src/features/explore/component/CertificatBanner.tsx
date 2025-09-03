const CertificatBanner = ({ serviceId }: { serviceId?: string }) => {
  return (
    <div>
      <div className="w-full space-y-4 bg-tertiary-500 px-4 py-6 text-white lg:hidden">
        <div className="">
          <div className="line-clamp-1 font-primary text-2xl font-medium">
            Earn Certificates for Every services
          </div>
          <p className="line-clamp-3 max-w-screen-sm text-sm font-light">
            Upon successful service completion, you'll receive a certificate,
            enhancing your professional credentials and career growth.
          </p>
        </div>

        <img
          alt="certificate"
          src="/images/certificate-sample.webp"
          className="h-48 w-full rounded-xl object-contain"
        />
      </div>

      <div className="hidden h-40 w-full items-center justify-between gap-4 rounded-2xl bg-tertiary-500 px-6 py-4 text-white lg:flex">
        <div className="flex-[2] space-y-1">
          <div className="line-clamp-1 font-primary text-2xl font-medium">
            Earn Certificates for Every Service
          </div>
          <p className="line-clamp-3 max-w-sm text-sm font-light">
            Upon successful service completion, you'll receive a certificate,
            enhancing your professional credentials and career growth.
          </p>
        </div>

        <div className="flex-1">
          <img
            alt="certificate"
            src="/images/certificate-sample.webp"
            className="h-48 w-full rounded-xl border-2 border-primary-200 bg-white object-contain shadow-xl"
          />
        </div>
      </div>
    </div>
  );
};

export default CertificatBanner;
