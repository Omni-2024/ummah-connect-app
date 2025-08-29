import Link from "next/link";

const AuthCardFooter = () => {
  return (
    <div className="w-full py-2">
      <p className="text-center text-xs font-normal text-black/95">
        By proceeding, you agree to the{" "}
        <Link className="text-status-blue hover:underline" href="/terms">
          Terms and Conditions
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy-policy"
          className="text-status-blue hover:underline"
        >
          Privacy Policy.
        </Link>
      </p>
    </div>
  );
};

export default AuthCardFooter;
