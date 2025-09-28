import Navbar from "@/features/app/components/Navbar";
import NavbarMobile, {TitleWithBackButton} from "@/features/app/components/Navbar.mobile";


type CheckoutPageLayoutProps = {
  children?: React.ReactNode;
};

const CheckoutPageLayout: React.FC<CheckoutPageLayoutProps> = (props) => {
  return (
    <div className="min-h-screen w-full">
      {/*<Head title="Checkout course | Medlearning - Shaping Learning Excellence" />*/}
      <Navbar />
      <NavbarMobile
        left={
          <TitleWithBackButton
            title="Back to service"
            //TODO:: generate back link using slug
            backButtonHref="/settings/profile"
          />
        }
      />
      <div className="container flex h-full max-w-screen-xl flex-col space-y-4 p-4 lg:space-y-8 lg:p-9">
        {props.children}
      </div>
    </div>
  );
};

export default CheckoutPageLayout;
