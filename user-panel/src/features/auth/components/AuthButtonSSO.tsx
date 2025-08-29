import Button from "@/components/base/Button";

interface Props {
  method: "email" | "google" | "linkedin";
  onClick?: () => void;
  isLoading?: boolean;
}

const AuthButtonSSO: React.FC<Props> = ({
  onClick,
  isLoading,
  method = "email",
}) => {
  const getButtonDetails = (method: Props["method"]) => {
    switch (method) {
      case "email":
        return {
          icon: <img src="/icons/filled/sms.svg" className="size-5" />,
          label: "Continue With Email",
        };
      case "google":
        return {
          icon: <img src="/icons/filled/google.svg" className="size-5" />,
          label: "Continue With Google",
        };
      case "linkedin":
        return {
          icon: <img src="/icons/filled/linkedin.svg" className="size-5" />,
          label: "Continue With Linkedin",
        };
    }
  };

  const { icon, label } = getButtonDetails(method);

  return (
    <Button
      size="lg"
      leftIcon={icon}
      onClick={onClick}
      variant="unstyled"
      isLoading={isLoading}
      disabled={isLoading}
      className="h-12 w-full border border-dark-50 font-medium text-black transition-transform ease-in-out hover:bg-dark-50 active:scale-95 disabled:text-black disabled:opacity-60"
    >
      {label}
    </Button>
  );
};

export default AuthButtonSSO;
