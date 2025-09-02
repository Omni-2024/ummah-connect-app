import Button from "@/components/ui/button";

type LoadingErrorProps = {
  error: string;
  fixedError?: boolean;
  reload: () => void;
  buttonText?: string;
};

const LoadingError: React.FC<LoadingErrorProps> = (props) => {
  return (
    <div className="w-full py-24 flex items-center gap-6 flex-col">
      <div>
        {props.fixedError
          ? props.error
          : props.error === "Network Error"
            ? "No internet connection. Please check your network and try again."
            : "Something went wrong. Try refresh the page."}
      </div>
      <Button onClick={props.reload} className="w-min">
        {props.buttonText ?? "Reload"}
      </Button>
    </div>
  );
};

export default LoadingError;
