const ServiceBanner = ({ serviceId }: { serviceId?: string }) => {
  return (
      <div>
        {/* Mobile view */}
        <div className="w-full space-y-4 bg-tertiary-500 px-4 py-6 text-white lg:hidden">
          <div>
            <div className="line-clamp-1 font-primary text-2xl font-medium">
              Explore Services that Enrich Your Life
            </div>
            <p className="line-clamp-3 max-w-screen-sm text-sm font-light">
              From Qur’an learning to cooking and child care, discover services
              that support your personal growth, family life, and spiritual journey.
            </p>
          </div>

          <img
              alt="community services"
              src="/images/coverImage.png"
              className="h-48 w-full rounded-xl object-cover"
          />
        </div>

        {/* Desktop view */}
        <div className="hidden h-40 w-full items-center justify-between gap-4 rounded-2xl bg-tertiary-500 px-6 py-4 text-white lg:flex">
          <div className="flex-[2] space-y-1">
            <div className="line-clamp-1 font-primary text-2xl font-medium">
              Learn, Grow, and Share with the Community
            </div>
            <p className="line-clamp-3 max-w-sm text-sm font-light">
              Join meaningful services that help you gain skills, strengthen your
              faith, and contribute positively to your family and community.
            </p>
          </div>

          <div className="flex-1">
            <img
                alt="community services"
                src="/images/coverImage.png"
                className="h-48 w-full rounded-xl border-2 border-primary-200 bg-white object-cover shadow-xl"
            />
          </div>
        </div>
      </div>
  );
};

export default ServiceBanner;
